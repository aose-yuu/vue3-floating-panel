<script setup lang="ts">
const undraggableRef = ref<HTMLElement | null>(null);

const attrs = useAttrs();

defineExpose({ undraggableRef: readonly(undraggableRef) });
</script>

<template>
  <!-- FloatingPanel用のコンポーネント。`.stop` で親へのイベント伝播を防いでいるため、このコンポーネントで囲んだ要素はFloatingPanelのドラッグ対象から外れる -->
  <div
    ref="undraggableRef"
    v-bind="attrs"
    class="Undraggable"
    @pointerdown.stop
    @pointerup.stop
    @pointermove.stop
  >
    <slot />
  </div>
</template>

<style scoped>
.Undraggable {
  height: 100%;
}
</style>
