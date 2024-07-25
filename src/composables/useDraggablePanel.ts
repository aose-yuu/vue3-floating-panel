import { useFloatingPanel } from './useFloatingPanel';

export const useDraggablePanel = (
  floatingPanelRef: Ref<HTMLElement | null>,
  floatingPanelId: Ref<string>
) => {
  const { reorderFloatingPanels } = useFloatingPanel();

  const setupPanelDraggable = () => {
    const {
      x: floatingPanelX,
      y: floatingPanelY,
      isDragging,
    } = useDraggable(floatingPanelRef, {
      initialValue: { x: 0, y: 0 },
      onStart: () => {
        reorderFloatingPanels(floatingPanelId.value);
      },
      capture: false,
    });

    return {
      floatingPanelX,
      floatingPanelY,
      isDragging,
    };
  };

  const createDraggableStyle = (
    floatingPanelX: Ref<number>,
    floatingPanelY: Ref<number>
  ) => {
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;
    const { width: floatingWidth, height: floatingHeight } =
      useElementBounding(floatingPanelRef);

    const DEFAULT_OFFSET = 0;

    // -- style --
    // 要素が画面端以上には出ないように制限
    const restrictedX = computed(() => {
      return clamp(
        DEFAULT_OFFSET,
        floatingPanelX.value,
        windowWidth - DEFAULT_OFFSET - floatingWidth.value
      );
    });

    const restrictedY = computed(() => {
      return clamp(
        DEFAULT_OFFSET,
        floatingPanelY.value,
        windowHeight - DEFAULT_OFFSET - floatingHeight.value
      );
    });

    const draggableStyle = computed(() => {
      return {
        left: `${restrictedX.value}px`,
        top: `${restrictedY.value}px`,
      };
    });

    return {
      draggableStyle,
    };
  };

  return {
    setupPanelDraggable,
    createDraggableStyle,
  };
};
