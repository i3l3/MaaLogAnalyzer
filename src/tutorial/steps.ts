import { i18n } from '../i18n'
import type { TourStep } from './types'

export const TOUR_VERSION = 3
export const TOUR_STORAGE_KEY = 'maa-log-analyzer-tutorial-version'

export const getTutorialSteps = (): TourStep[] => {
  const t = i18n.global.t
  return [
    {
      id: 'view-switch',
      sectionId: 'overview',
      sectionTitle: t('tutorial.section.overview'),
      title: t('tutorial.step.viewSwitch.title'),
      content: t('tutorial.step.viewSwitch.content'),
      target: '[data-tour="header-view-switch"]',
      mobileTarget: '[data-tour="header-mobile-menu"]',
      view: 'analysis',
      placement: 'bottom',
      nextLabel: t('tutorial.next'),
      sinceVersion: 1
    },
    {
      id: 'settings-entry',
      sectionId: 'overview',
      sectionTitle: t('tutorial.section.overview'),
      title: t('tutorial.step.settingsEntry.title'),
      content: t('tutorial.step.settingsEntry.content'),
      target: '[data-tour="header-settings-button"]',
      mobileTarget: '[data-tour="header-mobile-menu"]',
      view: 'analysis',
      placement: 'bottom',
      nextLabel: t('tutorial.next'),
      sinceVersion: 1
    },
    {
      id: 'theme-toggle',
      sectionId: 'overview',
      sectionTitle: t('tutorial.section.overview'),
      title: t('tutorial.step.themeToggle.title'),
      content: t('tutorial.step.themeToggle.content'),
      target: '[data-tour="header-theme-button"]',
      mobileTarget: '[data-tour="header-mobile-menu"]',
      view: 'analysis',
      placement: 'bottom',
      nextLabel: t('tutorial.step.themeToggle.nextLabel'),
      sinceVersion: 1
    },
    {
      id: 'analysis-main',
      sectionId: 'analysis',
      sectionTitle: t('tutorial.section.analysis'),
      title: t('tutorial.step.analysisMain.title'),
      content: t('tutorial.step.analysisMain.content'),
      target: '[data-tour="analysis-process-root"]',
      view: 'analysis',
      placement: 'right',
      nextLabel: t('tutorial.step.analysisMain.nextLabel'),
      sinceVersion: 1
    },
    {
      id: 'flowchart-main',
      sectionId: 'flowchart',
      sectionTitle: t('tutorial.section.flowchart'),
      title: t('tutorial.step.flowchartMain.title'),
      content: t('tutorial.step.flowchartMain.content'),
      target: '[data-tour="flowchart-main"]',
      view: 'flowchart',
      placement: 'left',
      nextLabel: t('tutorial.next'),
      sinceVersion: 1
    },
    {
      id: 'flowchart-playback',
      sectionId: 'flowchart',
      sectionTitle: t('tutorial.section.flowchart'),
      title: t('tutorial.step.flowchartPlayback.title'),
      content: t('tutorial.step.flowchartPlayback.content'),
      target: '[data-tour="flowchart-toolbar"]',
      view: 'flowchart',
      placement: 'bottom',
      nextLabel: t('tutorial.step.flowchartPlayback.nextLabel'),
      sinceVersion: 1
    },
    {
      id: 'search-main',
      sectionId: 'search',
      sectionTitle: t('tutorial.section.search'),
      title: t('tutorial.step.searchMain.title'),
      content: t('tutorial.step.searchMain.content'),
      target: '[data-tour="search-main"]',
      view: 'search',
      placement: 'left',
      nextLabel: t('tutorial.step.searchMain.nextLabel'),
      sinceVersion: 1
    },
    {
      id: 'statistics-main',
      sectionId: 'statistics',
      sectionTitle: t('tutorial.section.statistics'),
      title: t('tutorial.step.statisticsMain.title'),
      content: t('tutorial.step.statisticsMain.content'),
      target: '[data-tour="statistics-main"]',
      view: 'statistics',
      placement: 'left',
      nextLabel: t('tutorial.step.statisticsMain.nextLabel'),
      sinceVersion: 1
    },
    {
      id: 'split-main',
      sectionId: 'split',
      sectionTitle: t('tutorial.section.split'),
      title: t('tutorial.step.splitMain.title'),
      content: t('tutorial.step.splitMain.content'),
      target: '[data-tour="split-main"]',
      view: 'split',
      placement: 'left',
      nextLabel: t('tutorial.next'),
      sinceVersion: 1
    },
    {
      id: 'tutorial-replay-entry',
      sectionId: 'ending',
      sectionTitle: t('tutorial.section.ending'),
      title: t('tutorial.step.tutorialReplayEntry.title'),
      content: t('tutorial.step.tutorialReplayEntry.content'),
      target: '[data-tour="about-start-tutorial"]',
      view: 'split',
      placement: 'left',
      nextLabel: t('tutorial.step.tutorialReplayEntry.nextLabel'),
      sinceVersion: 2
    }
  ]
}
