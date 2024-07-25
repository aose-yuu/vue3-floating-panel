import {
  useFloatingPanelStore,
  INITIAL_FLOATING_PANEL_Z_INDEX,
} from '../store/useFloatingPanelStore';
import { v4 as uuidv4 } from 'uuid';

export type FloatingPanel = {
  floatingPanelId: string;
  zIndex: number;
  canCloseOutside: boolean;
};

export const useFloatingPanel = (canCloseOutside?: boolean) => {
  const floatingPanelId = ref('');
  const visible = ref(false);

  const {
    floatingPanels,
    addFloatingPanel,
    deleteFloatingPanel: _deleteFloatingPanel,
    currentHighestFloatingPanelZIndex,
    replaceFloatingPanels,
  } = useFloatingPanelStore();

  /**
   * 選択（クリック）したFloatingPanelを取得する関数
   * @param floatingPanelId 取得したいFloatingPanelのID
   * @returns 選択したFloatingPanel
   */
  const getCurrentFloatingPanel = (floatingPanelId: string) => {
    return floatingPanels.value.find((panel) => {
      return panel.floatingPanelId === floatingPanelId;
    });
  };

  const currentFloatingPanel = computed(() => {
    return getCurrentFloatingPanel(floatingPanelId.value);
  });

  /**
   * 指定したFloatingPanelが存在するかどうかを判定する関数
   * @param floatingPanelId 存在を判定したいFloatingPanelのID
   * @returns 存在する場合はtrue、存在しない場合はfalse
   */
  const existsFloatingPanel = (floatingPanelId: string) => {
    return getCurrentFloatingPanel(floatingPanelId) !== undefined;
  };

  /**
   * FloatingPanelを生成する関数
   * @param floatingPanelId 生成するFloatingPanelのID
   * @returns 生成されたFloatingPanel
   */
  const generateFloatingPanel = (floatingPanelId: string): FloatingPanel => {
    const newZIndex = currentHighestFloatingPanelZIndex.value + 1;

    const createNewPanel = (floatingPanelId?: string) => {
      const newFloatingPanel: FloatingPanel = {
        canCloseOutside: canCloseOutside ?? true,
        floatingPanelId: floatingPanelId ?? uuidv4(),
        zIndex: newZIndex,
      };
      addFloatingPanel(newFloatingPanel);
      return newFloatingPanel;
    };

    // floatingPanelIdが存在する場合、生成せずに既存のFloatingPanelを返却
    if (floatingPanelId && existsFloatingPanel(floatingPanelId)) {
      return {
        canCloseOutside: canCloseOutside ?? true,
        floatingPanelId,
        zIndex: newZIndex,
      };
    }

    // floatingPanelIdが空文字または存在しない場合、新しいFloatingPanelを生成
    return createNewPanel();
  };

  /**
   * FloatingPanelを削除する関数
   * @param floatingPanelId 削除するFloatingPanelのID
   * @returns void
   */
  const deleteFloatingPanel = (floatingPanelId: string) => {
    if (!existsFloatingPanel(floatingPanelId)) return;
    _deleteFloatingPanel(floatingPanelId);
  };

  /**
   * 全てのFloatingPanelを削除する関数
   * @returns void
   */
  const deleteAllFloatingPanels = () => {
    for (const panel of floatingPanels.value) {
      if (!panel.canCloseOutside) continue;
      deleteFloatingPanel(panel.floatingPanelId);
    }
  };

  /**
   * FloatingPanelの順序を変更する関数
   * @param floatingPanelId 順序を変更するFloatingPanelのID
   * @returns void
   */
  const reorderFloatingPanels = (floatingPanelId: string) => {
    if (!existsFloatingPanel(floatingPanelId)) return;

    const currentPanel = getCurrentFloatingPanel(floatingPanelId);

    const otherPanels = floatingPanels.value.filter(
      (panel) => panel.floatingPanelId !== floatingPanelId
    );

    // 現在のパネルを先頭に配置し、z-indexを振り直す
    const reorderedPanels = [...otherPanels, currentPanel].map(
      (panel, index) => ({
        ...panel,
        zIndex: INITIAL_FLOATING_PANEL_Z_INDEX + index + 1,
      })
    );

    replaceFloatingPanels(reorderedPanels);
  };

  const show = () => {
    const { floatingPanelId: _floatingPanelId } = generateFloatingPanel(
      floatingPanelId.value
    );
    floatingPanelId.value = _floatingPanelId;
    visible.value = true;
  };

  const hide = () => {
    visible.value = false;
    _deleteFloatingPanel(floatingPanelId.value);
  };

  return {
    floatingPanels,
    currentHighestFloatingPanelZIndex,
    existsFloatingPanel,
    deleteFloatingPanel,
    deleteAllFloatingPanels,
    reorderFloatingPanels,
    floatingPanelId,
    visible,
    currentFloatingPanel,
    show,
    hide,
  };
};
