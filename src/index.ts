import { parse, compileScript, compileTemplate, BindingMetadata, SFCScriptBlock } from '@vue/compiler-sfc'
import { TsJestTransformer } from 'ts-jest/dist/ts-jest-transformer';
import type { TransformedSource, Transformer, TransformOptions } from '@jest/transform';
import type { Config } from '@jest/types';

// Example in vue-loader: https://github.com/vuejs/vue-loader/commit/fb09c8b1755086c4e0627d0e83035e8ef53ed5c3
// Script Setup RFC: https://github.com/vuejs/rfcs/blob/sfc-improvements/active-rfcs/0000-sfc-script-setup.md#transform-api

class VueTsJestTransformer extends TsJestTransformer implements Transformer {
  process(input: string, filePath: Config.Path, jestConfig: Config.ProjectConfig, transformOptions?: TransformOptions): TransformedSource | string {
    const { descriptor } = parse(input)
    let bindings: BindingMetadata | undefined
    let scriptSetupResult: SFCScriptBlock
    let output: TransformedSource | string = ''

    if (descriptor.script || descriptor.scriptSetup) {
      scriptSetupResult = compileScript(descriptor)
      bindings = scriptSetupResult.bindings
      output = super.process(scriptSetupResult.loc.source, `${filePath}.ts`, jestConfig, transformOptions)
      const template = compileTemplate({
        filename: descriptor.filename,
        source: descriptor.template!.content,
        compilerOptions: {
          bindingMetadata: bindings,
          mode: 'function'
        }
      })
      const templateCode = template.code
      // this is fairly dirty
      if (templateCode.includes('exports.render = render;')) {
        output += templateCode + ';exports.default = {...exports.default, render};'
      } else {
        output += templateCode + ';exports.default = {...exports.default};'
      }
    }

    // For js, ts, we can call super.process to ask ts-jest to compile. The rest we ask Vue compiler
    return output
  }
}

export = new VueTsJestTransformer()
