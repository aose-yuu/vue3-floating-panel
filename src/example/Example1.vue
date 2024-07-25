<script setup lang="ts">
import FloatingPanel from '../components/FloatingPanel.vue';
import { useFloatingPanelStore } from '../store/useFloatingPanelStore';

const { floatingPanels } = useFloatingPanelStore();
const floatingPanelRef1 = ref(null);
const floatingPanelId1 = computed(
  () => floatingPanelRef1.value?.floatingPanelId
);
const floatingPanelRef2 = ref(null);
const floatingPanelId2 = computed(
  () => floatingPanelRef2.value?.floatingPanelId
);
const floatingPanelRef3 = ref(null);
const floatingPanelId3 = computed(
  () => floatingPanelRef3.value?.floatingPanelId
);
</script>

<template>
  <div class="example-1">
    <template v-if="floatingPanels.length">
      <template
        v-for="floatingPanel in floatingPanels"
        :key="floatingPanel.floatingPanelId"
      >
        <p>{{ floatingPanel }}</p>
      </template>
    </template>
    <template v-else>
      <p>floatingPanels = []</p>
    </template>
    <FloatingPanel
      ref="floatingPanelRef1"
      title="親フローティングパネル"
      placement="bottom"
    >
      <template #trigger>
        <button>親フローティングパネルのトリガー要素</button>
      </template>

      <template #contents>
        <div class="floating-panel-contents">
          <p>{{ floatingPanelId1 }}</p>
          <FloatingPanel
            ref="floatingPanelRef2"
            title="子フローティングパネル1"
            width="12rem"
            placement="left"
          >
            <template #trigger>
              <button>←子フローティングパネルのトリガー要素</button>
            </template>

            <template #contents>
              <p>{{ floatingPanelId2 }}</p>
            </template>
          </FloatingPanel>

          <FloatingPanel
            ref="floatingPanelRef3"
            title="子フローティングパネル2"
            width="12rem"
            placement="right"
          >
            <template #trigger>
              <button>子フローティングパネルのトリガー要素→</button>
            </template>

            <template #contents>
              <p>{{ floatingPanelId3 }}</p>
            </template>
          </FloatingPanel>
        </div>
      </template>
    </FloatingPanel>
  </div>
</template>

<style scoped>
.example-1 {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.floating-panel-contents {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 1rem;
}
</style>
