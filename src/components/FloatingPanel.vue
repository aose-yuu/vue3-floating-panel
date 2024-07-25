<script setup lang="ts">
import { useFloatingPanel } from '../composables/useFloatingPanel';
import { useDraggablePanel } from '../composables/useDraggablePanel';
import { usePosition } from '../composables/usePosition';

type Props = {
  title: string;
  placement: 'left' | 'top' | 'right' | 'bottom';
  width?: string;
  maxHeight?: string;
  canCloseOutside?: boolean;
};

const props = withDefaults(defineProps<Props>(), {
  string: '',
  width: 'auto',
  maxHeight: 'none',
  canCloseOutside: true,
});

const triggerRef = ref<HTMLElement | null>(null);
const floatingPanelRef = ref<HTMLElement | null>(null);

const {
  deleteAllFloatingPanels,
  floatingPanelId,
  visible,
  currentFloatingPanel,
  show,
  hide,
  toggle,
  reorderFloatingPanels,
} = useFloatingPanel(props.canCloseOutside);

// -- click outside --
onMounted(() => {
  const teleportForFloatingPanel = document.querySelector(
    '#teleport-for-floating-panel'
  ) as MaybeElementRef<MaybeElement>;

  onClickOutside(
    teleportForFloatingPanel,
    () => {
      hide();
      deleteAllFloatingPanels();
    },
    {
      // 他のフローティングパネルをクリックしたりパネルからモーダルを開いて操作しても、自身のパネルが閉じないように
      // #teleport-for-floating-panelを除外する
      ignore: [teleportForFloatingPanel],
    }
  );
});

// -- panel dragging --
const { setupPanelDraggable, createDraggableStyle } = useDraggablePanel(
  floatingPanelRef,
  floatingPanelId
);
const { floatingPanelX, floatingPanelY, isDragging } = setupPanelDraggable();

const { draggableStyle } = createDraggableStyle(floatingPanelX, floatingPanelY);

const floatingPanelStyle = computed<StyleValue>(() => ({
  ...draggableStyle.value,
  width: props.width,
  maxHeight: props.maxHeight,
  overflowY: props.maxHeight === 'none' ? 'visible' : 'scroll',
  'z-index': currentFloatingPanel.value?.zIndex,
  cursor: isDragging.value ? 'grabbing' : 'grab',
}));

// 初期位置に戻すためのキャッシュ
const initialPositionX = ref(0);
const initialPositionY = ref(0);

const setPosition = async () => {
  await nextTick();
  const { x: positionX, y: positionY } = usePosition(
    triggerRef,
    floatingPanelRef,
    { placement: props.placement }
  );
  initialPositionX.value = positionX.value;
  initialPositionY.value = positionY.value;
  floatingPanelX.value = positionX.value;
  floatingPanelY.value = positionY.value;
};

const setInitialPosition = () => {
  floatingPanelX.value = initialPositionX.value;
  floatingPanelY.value = initialPositionY.value;
};

// パネルが表示された際に位置を計算
watch(
  () => visible.value,
  async (value) => {
    if (value) {
      await setPosition();
    } else {
      // パネルが閉じられた際に位置をキャッシュで初期化
      setInitialPosition();
    }
  }
);

const handleClickTrigger = () => {
  // 表示状態でトリガー要素をクリックしたら初期位置に戻す
  setInitialPosition();

  // 親パネル内に子パネルのトリガー要素がある場合、クリックしても onClickOutside が実行されないため、
  // reorderFloatingPanels が実行されず、子パネルが最前面に表示されないので、トリガー要素をクリックした際は明示的に reorderFloatingPanels を実行する
  reorderFloatingPanels(floatingPanelId.value);
  show();
};

defineExpose({
  floatingPanelId: readonly(floatingPanelId),
  visible: readonly(visible),
  show,
  hide,
  toggle,
});
</script>

<template>
  <span ref="triggerRef" @click="handleClickTrigger">
    <slot name="trigger" />
  </span>

  <Teleport v-if="visible" to="#teleport-for-floating-panel">
    <div
      :id="floatingPanelId"
      :key="floatingPanelId"
      ref="floatingPanelRef"
      class="floating-panel"
      :style="floatingPanelStyle"
      @mousedown="reorderFloatingPanels(floatingPanelId)"
    >
      <div class="floating-panel-header">
        <div class="floating-panel-header-wrapper">
          <p class="floating-panel-header-title">{{ props.title }}</p>
          <button @click="hide">x</button>
        </div>
        <div class="floating-panel-header-spacer" />
        <slot name="contents" />
      </div>
    </div>
  </Teleport>
</template>

<style scoped>
.floating-panel {
  border: 1px solid gray;
  border-radius: 2px;
  position: fixed;
  user-select: none;
  padding: 12px;
  background-color: white;
}

.floating-panel-header {
  display: flex;
  flex-direction: column;
}

.floating-panel-header-wrapper {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.floating-panel-header-title {
  font-size: 1.2rem;
  font-weight: bold;
}

.floating-panel-header-spacer {
  width: 100%;
  border: 1px solid gray;
  margin-top: 4px;
  margin-bottom: 4px;
}
</style>
