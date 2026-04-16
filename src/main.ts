import { createApp } from 'vue'
import Index from './Index.vue'
import './style.css'
import { reportAnalyticsContext } from './utils/analytics'
import { installVueLogParserRuntime } from './utils/logParserVueRuntime'
import { i18n } from './i18n'

installVueLogParserRuntime()

const app = createApp(Index)
app.use(i18n)
app.mount('#app')

reportAnalyticsContext()
