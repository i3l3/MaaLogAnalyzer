import { createI18n } from 'vue-i18n'
import en from './locales/en.json'
import ko from './locales/ko.json'
import zhCn from './locales/zh-cn.json'

export type SupportedLocale = 'zh-cn' | 'en' | 'ko'

export const i18n = createI18n({
  legacy: false,
  locale: (localStorage.getItem('locale') ?? 'zh-cn') as SupportedLocale,
  fallbackLocale: 'zh-cn',
  messages: {
    'zh-cn': zhCn,
    en,
    ko,
  },
})

export function setLocale(locale: SupportedLocale) {
  i18n.global.locale.value = locale
  localStorage.setItem('locale', locale)
}
