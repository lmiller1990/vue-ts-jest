import { parse, compileScript, compileTemplate, BindingMetadata, SFCScriptBlock } from '@vue/compiler-sfc'
import { transpile } from 'typescript'

// Example in vue-loader: https://github.com/vuejs/vue-loader/commit/fb09c8b1755086c4e0627d0e83035e8ef53ed5c3
// Script Setup RFC: https://github.com/vuejs/rfcs/blob/sfc-improvements/active-rfcs/0000-sfc-script-setup.md#transform-api

function transpileToCommonJS(code: string) {
  return transpile(code, {
    module: 1, // commonjs
    target: 1  // es5
  })
}

/** jest transformers must export a process function
 * @param {src} code to transform
 * @param {path} the path to the file
 */
export function process(src: string, path: string) {
  const { descriptor } = parse(src)

  let bindings: BindingMetadata
  let scriptSetupResult: SFCScriptBlock

  if (descriptor.script || descriptor.scriptSetup) {
    scriptSetupResult = compileScript(descriptor)
    bindings = scriptSetupResult.bindings
  }

  const template = compileTemplate({
    filename: 'component.vue',
    source: descriptor.template.content,
    compilerOptions: {
      bindingMetadata: bindings
    }
  })

  const scriptSetupCode = transpileToCommonJS(scriptSetupResult.content)
  const templateCode = transpileToCommonJS(template.code)

  let output = scriptSetupCode

  // this is fairly dirty
  if (templateCode.includes('exports.render = render;')) {
    output += templateCode + ';exports.default = {...exports.default, render};'
  } else {
    output += templateCode + ';exports.default = {...exports.default};'
  }

  return {
    code: output
  }
}