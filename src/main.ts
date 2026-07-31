import './style/base.css'
import './style/story.css'
import './style/reading.css'
import { App } from './app.ts'

const host = document.getElementById('app')
if (!host) throw new Error('#app fehlt in index.html')
new App(host).start()
