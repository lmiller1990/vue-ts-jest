import { createApp } from 'vue'
import Hello from './Hello.vue'

function mount(comp: any) {
  document.getElementsByTagName('html')[0].innerHTML = ''
  const el = document.createElement('div')
  document.body.appendChild(el)
  createApp(comp).mount(el)
}

test('works on a basic component', () => {
  mount(Hello)
  expect(document.body.outerHTML).toContain('Count: 5')
})