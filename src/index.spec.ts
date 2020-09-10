import VueTsJestTransformer from "./index";

const CODE_TO_TRANSFORM = `
  <template>
    <button @click="inc">Count: {{ count }}</button>
  </template>
  
  <script setup="props, { emit }" lang="ts">
    import { ref } from 'vue'
    
    export const count = ref(5)
    export const inc = () => count.value++
  </script>
`;

describe("VueTsJestTransformer", () => {
  test(`should compile code`, () => {
    const output = VueTsJestTransformer.process(
      CODE_TO_TRANSFORM,
      "foo.ts",
      {
        testMatch: [],
        testRegex: [{}],
        globals: {
          "ts-jest": {
            isolatedModules: true,
            tsConfig: require.resolve("../tsconfig.json"),
          },
        },
      } as any,
      { instrument: false }
    );

    expect(output).toMatchInlineSnapshot(`
      "\\"use strict\\";
      Object.defineProperty(exports, \\"__esModule\\", { value: true });
      exports.setup = void 0;
      var vue_1 = require(\\"vue\\");
      var vue_2 = require(\\"vue\\");
      function setup(props, _a) {
          var emit = _a.emit;
          var count = vue_2.ref(5);
          var inc = function () { return count.value++; };
          return { count: count, inc: inc };
      }
      exports.setup = setup;
      exports.default = vue_1.defineComponent({
          setup: setup
      });
      \\"use strict\\";
      Object.defineProperty(exports, \\"__esModule\\", { value: true });
      exports.render = void 0;
      var vue_1 = require(\\"vue\\");
      function render(_ctx, _cache, $props, $setup, $data, $options) {
          return (vue_1.openBlock(), vue_1.createBlock(\\"button\\", {
              onClick: _cache[1] || (_cache[1] = function () {
                  var args = [];
                  for (var _i = 0; _i < arguments.length; _i++) {
                      args[_i] = arguments[_i];
                  }
                  return ($setup.inc.apply($setup, args));
              })
          }, \\"Count: \\" + vue_1.toDisplayString($setup.count), 1 /* TEXT */));
      }
      exports.render = render;
      ;exports.default = {...exports.default, render};"
    `);
  });
});
