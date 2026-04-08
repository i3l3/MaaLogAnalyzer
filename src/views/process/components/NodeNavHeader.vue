<script setup lang="ts">
import { NFlex, NText, NButton, NIcon } from 'naive-ui'
import { VerticalAlignTopOutlined, VerticalAlignBottomOutlined } from '@vicons/antd'
import type { NodeNavMode } from '../composables/useNodeNavSearch'

defineProps<{
  failedOnly: boolean
  mode: NodeNavMode
}>()

const emit = defineEmits<{
  'update:mode': [value: NodeNavMode]
  'toggle-failed-only': []
  'scroll-top': []
  'scroll-bottom': []
}>()
</script>

<template>
  <n-flex align="center" justify="space-between" style="padding-right: 16px">
    <n-flex align="center" style="gap: 8px">
      <n-text style="font-size: 14px; font-weight: 500">节点导航</n-text>
      <n-flex align="center" style="gap: 2px">
        <n-button
          text
          size="tiny"
          :type="mode === 'pipeline' ? 'primary' : 'default'"
          @click="emit('update:mode', 'pipeline')"
          title="按 Pipeline 节点列表显示"
        >
          全部
        </n-button>
        <n-button
          text
          size="tiny"
          :type="mode === 'next-list-hit' ? 'primary' : 'default'"
          @click="emit('update:mode', 'next-list-hit')"
          title="按根层 NextList 命中节点显示"
        >
          命中
        </n-button>
      </n-flex>
      <n-button
        v-if="mode === 'pipeline'"
        text
        size="tiny"
        @click="emit('toggle-failed-only')"
        :title="failedOnly ? '仅显示失败节点（点击显示全部）' : '显示全部节点（点击仅失败）'"
      >
        <span class="node-nav-filter-dot" :class="{ 'node-nav-filter-dot--active': failedOnly }" />
      </n-button>
    </n-flex>
    <n-flex align="center" style="gap: 2px">
      <n-button text size="tiny" @click="emit('scroll-top')" title="跳转顶部">
        <n-icon size="16"><vertical-align-top-outlined /></n-icon>
      </n-button>
      <n-button text size="tiny" @click="emit('scroll-bottom')" title="跳转底部">
        <n-icon size="16"><vertical-align-bottom-outlined /></n-icon>
      </n-button>
    </n-flex>
  </n-flex>
</template>

<style scoped>
.node-nav-filter-dot {
  display: inline-block;
  width: 9px;
  height: 9px;
  border-radius: 50%;
  background: #8f8f8f;
}

.node-nav-filter-dot--active {
  background: #d03050;
}
</style>
