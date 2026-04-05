<script setup lang="ts">
import { computed, h, useAttrs, type VNodeChild } from 'vue'
import { NImage } from 'naive-ui'
import type { ImageRenderToolbarProps } from 'naive-ui/es/image/src/public-types'

defineOptions({
  inheritAttrs: false,
})

const props = defineProps<{
  src?: string | null
  downloadFilename?: string
}>()

const attrs = useAttrs()

const resolvedSrc = computed(() => {
  const raw = typeof props.src === 'string' ? props.src.trim() : ''
  return raw
})

const inferImageExtension = (url: string): string => {
  if (!url) return 'png'

  if (url.startsWith('data:image/')) {
    const match = url.match(/^data:image\/([a-zA-Z0-9.+-]+);/i)
    if (match && match[1]) {
      const normalized = match[1].toLowerCase()
      if (normalized === 'jpeg') return 'jpg'
      return normalized
    }
    return 'png'
  }

  try {
    const parsed = new URL(url, window.location.href)
    const path = parsed.pathname
    const extensionMatch = path.match(/\.([a-zA-Z0-9]+)$/)
    if (extensionMatch && extensionMatch[1]) {
      return extensionMatch[1].toLowerCase()
    }
  } catch {
    const extensionMatch = url.match(/\.([a-zA-Z0-9]+)(?:$|[?#])/)
    if (extensionMatch && extensionMatch[1]) {
      return extensionMatch[1].toLowerCase()
    }
  }

  return 'png'
}

const openInNewTab = (url: string) => {
  if (!url) return
  window.open(url, '_blank', 'noopener,noreferrer')
}

const triggerDownload = (url: string) => {
  const filename = (props.downloadFilename && props.downloadFilename.trim())
    ? props.downloadFilename.trim()
    : `maa-image-${Date.now()}.${inferImageExtension(url)}`

  const anchor = document.createElement('a')
  anchor.href = url
  anchor.download = filename
  anchor.target = '_blank'
  anchor.rel = 'noopener noreferrer'
  document.body.appendChild(anchor)
  anchor.click()
  document.body.removeChild(anchor)
}

const stopMouseEvent = (event: MouseEvent) => {
  if (typeof event.preventDefault === 'function') event.preventDefault()
  if (typeof event.stopPropagation === 'function') event.stopPropagation()
  if (typeof (event as MouseEvent & { stopImmediatePropagation?: () => void }).stopImmediatePropagation === 'function') {
    (event as MouseEvent & { stopImmediatePropagation?: () => void }).stopImmediatePropagation?.()
  }
}

const handleToolbarDownload = (event: MouseEvent | KeyboardEvent) => {
  if (event instanceof MouseEvent) {
    stopMouseEvent(event)
  } else {
    if (typeof event.preventDefault === 'function') event.preventDefault()
    if (typeof event.stopPropagation === 'function') event.stopPropagation()
  }

  const url = resolvedSrc.value
  if (!url) return

  // 先保证不会在当前页跳转；即使 download 失败也保留新标签页可保存。
  openInNewTab(url)

  try {
    triggerDownload(url)
  } catch {
    // ignore
  }
}

const renderToolbar = ({ nodes }: ImageRenderToolbarProps): VNodeChild => {
  const safeDownloadNode = h(
    'span',
    {
      role: 'button',
      tabindex: 0,
      style: 'display: inline-flex; align-items: center; justify-content: center;',
      onClick: handleToolbarDownload,
      onMousedown: stopMouseEvent,
      onMouseup: stopMouseEvent,
      onKeydown: (event: KeyboardEvent) => {
        if (event.key === 'Enter' || event.key === ' ') {
          handleToolbarDownload(event)
        }
      },
    },
    [
      h(
        'span',
        { style: 'pointer-events: none; display: inline-flex; align-items: center; justify-content: center;' },
        [nodes.download],
      ),
    ],
  )

  return [
    nodes.rotateCounterclockwise,
    nodes.rotateClockwise,
    nodes.resizeToOriginalSize,
    nodes.zoomOut,
    nodes.zoomIn,
    safeDownloadNode,
    nodes.close,
  ]
}
</script>

<template>
  <n-image
    v-bind="attrs"
    :src="resolvedSrc"
    :render-toolbar="renderToolbar"
  />
</template>
