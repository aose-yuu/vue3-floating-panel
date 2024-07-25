import type { FloatingPanel } from '../composables/useFloatingPanel';

const FloatingPanelStoreKey: InjectionKey<
  ReturnType<typeof floatingPanelStore>
> = Symbol('floatingPanelStore');

export const INITIAL_FLOATING_PANEL_Z_INDEX = 0;

const floatingPanelStore = () => {
  const floatingPanels = ref<FloatingPanel[]>([]);

  const addFloatingPanel = (floatingPanel: FloatingPanel) => {
    floatingPanels.value.push(floatingPanel);
  };

  const deleteFloatingPanel = (floatingPanelId: string) => {
    floatingPanels.value = floatingPanels.value.filter((panel) => {
      return panel.floatingPanelId !== floatingPanelId;
    });
  };

  const currentHighestFloatingPanelZIndex = computed(() => {
    return (
      floatingPanels.value.reduce((acc, panel) => {
        return panel.zIndex > acc ? panel.zIndex : acc;
      }, INITIAL_FLOATING_PANEL_Z_INDEX) ?? INITIAL_FLOATING_PANEL_Z_INDEX
    );
  });

  const replaceFloatingPanels = (_floatingPanels: FloatingPanel[]) => {
    floatingPanels.value = _floatingPanels;
  };

  return {
    floatingPanels: readonly(floatingPanels),
    addFloatingPanel,
    deleteFloatingPanel,
    currentHighestFloatingPanelZIndex,
    replaceFloatingPanels,
  };
};

export const createFloatingPanelStore = () => {
  provide(FloatingPanelStoreKey, floatingPanelStore());
};

export const useFloatingPanelStore = () => {
  const _floatiingPanelStore = inject(FloatingPanelStoreKey);
  if (!_floatiingPanelStore) {
    throw new Error('FloatingPanelStore not provided');
  }
  return _floatiingPanelStore;
};
