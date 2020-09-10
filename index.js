"use strict";
exports.__esModule = true;
exports.process = void 0;
var compiler_sfc_1 = require("@vue/compiler-sfc");
var typescript_1 = require("typescript");
// REF: https://github.com/vuejs/vue-loader/commit/fb09c8b1755086c4e0627d0e83035e8ef53ed5c3
function transpileToCommonJS(code) {
    return typescript_1.transpile(code, {
        module: 1,
        target: 1 // es5
    });
}
function process(src, path) {
    var descriptor = compiler_sfc_1.parse(src).descriptor;
    var bindings;
    var scriptSetupResult;
    if (descriptor.script || descriptor.scriptSetup) {
        scriptSetupResult = compiler_sfc_1.compileScript(descriptor);
        bindings = scriptSetupResult.bindings;
    }
    var template = compiler_sfc_1.compileTemplate({
        filename: 'component.vue',
        source: descriptor.template.content,
        compilerOptions: {
            bindingMetadata: bindings
        }
    });
    var scriptSetupCode = transpileToCommonJS(scriptSetupResult.content);
    var templateCode = transpileToCommonJS(template.code);
    var output = scriptSetupCode;
    // this is fairly dirty
    if (templateCode.includes('exports.render = render;')) {
        output += templateCode + ';exports.default = {...exports.default, render};';
    }
    else {
        output += templateCode + ';exports.default = {...exports.default};';
    }
    return {
        code: output
    };
}
exports.process = process;
