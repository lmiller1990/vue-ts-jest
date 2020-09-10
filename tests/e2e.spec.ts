import { createApp } from 'vue'
import Hello from './Hello.vue'
import KitchenSink from './KitchenSink.vue'

function mount(comp: any, props: any = {}) {
  document.getElementsByTagName('html')[0].innerHTML = ''
  const el = document.createElement('div')
  document.body.appendChild(el)
  createApp(comp, props).mount(el)
}

test('works on a basic component', () => {
  mount(Hello)
  expect(document.body.outerHTML).toContain('Count: 5')
})

test('works on a complex component', () => {
  mount(KitchenSink, { msg: 'hello world' })
  expect(document.body.outerHTML).toContain('Count: 5')
  expect(document.body.outerHTML).toContain('hello world')
  console.log(document.body.outerHTML)
})