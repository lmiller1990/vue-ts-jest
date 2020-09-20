import { ConfigSet } from "ts-jest/dist/config/config-set";
import tsc from "typescript";

import * as removeVueImport from "../src/transformers/remove-vue-import";

const CODE_WITH_NAME_IMPORT = `
  import { defineComponent, ref } from 'vue'
  
  export default defineComponent({
    setup() {
      const count = ref<string>(5)
      const inc = () => count.value++
  
      return {
        count,
        inc
      }
    }
  })
`;
const CODE_WITH_START_IMPORT = `
  import * as vue1 from 'vue'
  
  export default vue1.defineComponent({
    setup() {
      const count = vue1.ref<string>(5)
      const inc = () => count.value++
  
      return {
        count,
        inc
      }
    }
  })
`;
const CODE_WITH_REQUIRE = `
  const vue2 = require('vue')
  
  export default vue2.defineComponent({
    setup() {
      const count = vue2.ref<string>(5)
      const inc = () => count.value++
      vue2.bar()
  
      return {
        count,
        inc
      }
    }
  })
`

describe("remove-vue-import", () => {
  test("should have correct signature", () => {
    expect(removeVueImport.name).toBe("remove-vue-import");
    expect(typeof removeVueImport.version).toBe("number");
    expect(removeVueImport.version).toBeGreaterThan(0);
    expect(typeof removeVueImport.factory).toBe("function");
  });

  test.each([
    CODE_WITH_NAME_IMPORT,
    CODE_WITH_START_IMPORT,
    CODE_WITH_REQUIRE,
  ])("should remove all vue imports", data => {
    const configSet = new ConfigSet(Object.create(null));
    const createFactory = () => removeVueImport.factory(configSet);
    const transpile = (source: string) =>
      tsc.transpileModule(source, {
        transformers: { before: [createFactory()] },
      });

    const out = transpile(data);

    expect(out.outputText).toMatchSnapshot()
  });
});
