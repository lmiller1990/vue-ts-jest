import { createApp } from 'vue'
import ScriptSetup from './ScriptSetup.vue'
import Hello from './Hello.vue'
// import KitchenSink from './KitchenSink.vue'

function mount(comp: any, props: any = {}) {
  document.getElementsByTagName('html')[0].innerHTML = ''
  const el = document.createElement('div')
  document.body.appendChild(el)
  createApp(comp, props).mount(el)
}

describe('E2E', () => {
  it('works - 1', () => {
    expect(1).toBe(1)
  })

  it('works with script setup component', () => {
    mount(ScriptSetup)
    expect(document.body.outerHTML).toContain('Count: 5')
  })

  it('works on a basic component', () => {
    mount(Hello)
    expect(document.body.outerHTML).toContain('Count: 5')
  })

  it('works - 2', () => {
    expect(1).toBe(1)
  })

  // xit('works on a complex component', () => {
  //   mount(KitchenSink, { msg: 'hello world' })
  //   expect(document.body.outerHTML).toContain('Count: 5')
  //   expect(document.body.outerHTML).toContain('hello world')
  //   console.log(document.body.outerHTML)
  // })
})
