import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

const isTauriDev = Boolean(process.env.TAURI_ENV_PLATFORM || process.env.TAURI_DEV_HOST)

export default defineConfig({
  plugins: [vue()],
  // 自定义域名直接使用根路径
  base: '/',
  server: {
    port: 5173,
    open: !isTauriDev,
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks(id) {
          const normalizedId = id.replace(/\\/g, '/')

          // 视图级拆分（配合异步组件）
          if (normalizedId.includes('/src/views/TextSearchView.vue')) return 'view-search'
          if (normalizedId.includes('/src/views/NodeStatisticsView.vue')) return 'view-statistics'
          if (normalizedId.includes('/src/views/FlowchartView.vue')) return 'view-flowchart'
          if (normalizedId.includes('/src/views/SettingsView.vue')) return 'view-settings'

          if (!normalizedId.includes('/node_modules/')) return undefined

          // 核心框架
          if (normalizedId.includes('/node_modules/vue/')) return 'vue-vendor'

          // UI 与图表
          if (normalizedId.includes('/node_modules/naive-ui/')) return 'naive-ui'
          if (normalizedId.includes('/node_modules/echarts/') || normalizedId.includes('/node_modules/vue-echarts/')) return 'echarts'

          // 自动布局
          if (normalizedId.includes('/node_modules/elkjs/')) return 'elkjs'

          // 其他较大的第三方库
          if (normalizedId.includes('/node_modules/highlight.js/') || normalizedId.includes('/node_modules/vue-virtual-scroller/')) {
            return 'vendor'
          }

          return undefined
        },
      },
    },
    chunkSizeWarningLimit: 1000,
  },
})
