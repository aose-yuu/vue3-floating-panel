<script setup lang="ts">
import Child from './Child.vue';
import { createFloatingPanelStore } from './store/useFloatingPanelStore';

createFloatingPanelStore();
</script>

<template>
  <div class="app">
    <div id="teleport-for-floating-panel" />
    <Child />
  </div>
</template>

<style scoped>
.app {
  width: 100dvw;
  height: 100dvh;
  background-color: lightcyan;
}
</style>
