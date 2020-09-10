import { createApp } from 'vue'
import Hello from './hello.vue'


test('yep', () => {
  const el = document.createElement('div')
  document.body.appendChild(el)
  const app = createApp(Hello).mount(el)

  console.log(document.body.outerHTML)
  expect(document.body.outerHTML).toContain('Count: 5')
})