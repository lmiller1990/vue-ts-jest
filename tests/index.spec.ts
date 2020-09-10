import VueTsJestTransformer from "../src";

describe("VueTsJestTransformer", () => {
  test(`should compile code`, () => {
    const CODE_TO_TRANSFORM_BASIC = `
      <template>
        <button @click="inc">Count: {{ count }}</button>
      </template>
      
      <script setup="props, { emit }" lang="ts">
        import { ref } from 'vue'
        
        export const count = ref(5)
        export const inc = () => count.value++
      </script>
    `;

    const output = VueTsJestTransformer.process(
      CODE_TO_TRANSFORM_BASIC,
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
      //# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJmaWxlIjoiZm9vLnRzIiwibWFwcGluZ3MiOiI7OztBQUFBLDJCQUFtRDtBQUVuRCwyQkFBeUI7QUFHekIsU0FBZ0IsS0FBSyxDQUFDLEtBQVMsRUFBRSxFQUloQztRQUprQyxJQUFJLFVBQUE7SUFNL0IsSUFBTSxLQUFLLEdBQUcsU0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFBO0lBQ3BCLElBQU0sR0FBRyxHQUFHLGNBQU0sT0FBQSxLQUFLLENBQUMsS0FBSyxFQUFFLEVBQWIsQ0FBYSxDQUFBO0lBRXZDLE9BQU8sRUFBRSxLQUFLLE9BQUEsRUFBRSxHQUFHLEtBQUEsRUFBRSxDQUFBO0FBQ3JCLENBQUM7QUFWRCxzQkFVQztBQUVELGtCQUFlLHFCQUFVLENBQUM7SUFDeEIsS0FBSyxPQUFBO0NBQ04sQ0FBQyxDQUFBIiwibmFtZXMiOltdLCJzb3VyY2VzIjpbImZvby50cyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBkZWZpbmVDb21wb25lbnQgYXMgX19kZWZpbmVfXyB9IGZyb20gJ3Z1ZSdcbmltcG9ydCB7IFNsb3RzIGFzIF9fU2xvdHNfXyB9IGZyb20gJ3Z1ZSdcbmltcG9ydCB7IHJlZiB9IGZyb20gJ3Z1ZSdcbiAgICAgICAgXG4gICAgICAgIFxuZXhwb3J0IGZ1bmN0aW9uIHNldHVwKHByb3BzOiB7fSwgeyBlbWl0IH06IHtcbiAgZW1pdDogKGU6IHN0cmluZywgLi4uYXJnczogYW55W10pID0+IHZvaWQsXG4gIHNsb3RzOiBfX1Nsb3RzX18sXG4gIGF0dHJzOiBSZWNvcmQ8c3RyaW5nLCBhbnk+XG59KSB7XG5cbiAgICAgICAgY29uc3QgY291bnQgPSByZWYoNSlcbiAgICAgICAgY29uc3QgaW5jID0gKCkgPT4gY291bnQudmFsdWUrK1xuICAgICAgXG5yZXR1cm4geyBjb3VudCwgaW5jIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgX19kZWZpbmVfXyh7XG4gIHNldHVwXG59KSJdLCJ2ZXJzaW9uIjozfQ==\\"use strict\\";
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

  xtest(`should compile more complex code`, () => {
    const CODE_TO_TRANSFORM_KITCHEN_SINK = `
      <template>
        <div>Count: {{ count }}</div>
        <div>{{ computedMsg }}</div>
      </template>

      <script lang="ts">
      export const named = 'named'
      </script>

      <script setup="props" lang="ts">
      import { ref, computed } from 'vue'

      export const count = ref(5)

      declare const props: {
        msg: string
      }

      export const computedMsg = computed(() => props.msg)
      </script>
    `;

    const output = VueTsJestTransformer.process(
      CODE_TO_TRANSFORM_KITCHEN_SINK,
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
        `);
  });
});
