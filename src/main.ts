import { mount } from 'svelte'
import './styles/app.scss'
import App from './app/App.svelte'

const app = mount(App, {
  target: document.getElementById('app')!,
})

export default app


