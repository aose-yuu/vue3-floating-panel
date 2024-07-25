import type { MaybeComputedElementRef, MaybeElement } from '@vueuse/core';

type Options = {
  placement: 'left' | 'top' | 'right' | 'bottom';
};

/**
 * FloatingPanelの基準となる要素の座標とサイズ
 * @param targetX FloatingPanelの基準となる要素のX座標
 * @param targetY FloatingPanelの基準となる要素のY座標
 * @param targetWidth FloatingPanelの基準となる要素の幅
 * @param targetHeight FloatingPanelの基準となる要素の高さ
 */
export type TargetBoundings = {
  targetX: number;
  targetY: number;
  targetWidth: number;
  targetHeight: number;
};

/**
 * @param placement FloatingPanelの表示位置
 * @param elementWidth FloatingPanelの幅
 * @param elementHeight FloatingPanelの高さ
 * @param targetBoundings FloatingPanelの基準となる要素の座標とサイズ
 */
export type GetPositionProps = {
  placement: Options['placement'];
  elementWidth: number;
  elementHeight: number;
  targetBoundings: TargetBoundings;
};

const getPosition = ({
  placement,
  elementWidth,
  elementHeight,
  targetBoundings,
}: GetPositionProps) => {
  const { targetX, targetY, targetWidth, targetHeight } = targetBoundings;

  // FloatingPanelの表示位置を管理するオブジェクト
  const positionMap = {
    left: {
      x: targetX - elementWidth,
      y: targetY + targetHeight / 2 - elementHeight / 2,
    },
    top: {
      x: targetX + targetWidth / 2 - elementWidth / 2,
      y: targetY - elementHeight,
    },
    right: {
      x: targetX + targetWidth,
      y: targetY + targetHeight / 2 - elementHeight / 2,
    },
    bottom: {
      x: targetX + targetWidth / 2 - elementWidth / 2,
      y: targetY + targetHeight,
    },
  };

  // placementを分解してpositionMapから表示位置を取得
  const position = positionMap[placement] as {
    x: number;
    y: number;
  };

  return position;
};

export const usePosition = (
  triggerRef: MaybeComputedElementRef<MaybeElement>,
  elementRef: MaybeComputedElementRef<MaybeElement>,
  options: Options
) => {
  const { placement = 'bottom' } = options;

  const x = ref(0);
  const y = ref(0);
  const computedX = computed(() => x.value);
  const computedY = computed(() => y.value);
  const targetX = ref(0);
  const targetY = ref(0);
  const targetWidth = ref(0);
  const targetHeight = ref(0);
  const elementX = ref(0);
  const elementY = ref(0);
  const elementWidth = ref(0);
  const elementHeight = ref(0);

  // FloatingPanelの表示位置を更新する関数
  function update() {
    const _trigger = unrefElement(triggerRef);
    const _element = unrefElement(elementRef);

    if (!_trigger || !_element) {
      targetX.value = 0;
      targetY.value = 0;
      targetWidth.value = 0;
      targetHeight.value = 0;
      elementX.value = 0;
      elementY.value = 0;
      elementWidth.value = 0;
      elementHeight.value = 0;
      return;
    }

    // floatingPanelを表示させるためのトリガーとなる要素
    const {
      x: _targetX,
      y: _targetY,
      width: _targetWidth,
      height: _targetHeight,
    } = useElementBounding(_trigger);

    targetX.value = _targetX.value;
    targetY.value = _targetY.value;
    targetWidth.value = _targetWidth.value;
    targetHeight.value = _targetHeight.value;

    // floatingPanelの情報
    const {
      x: _elementX,
      y: _elementY,
      width: _elementWidth,
      height: _elementHeight,
    } = useElementBounding(_element);

    elementX.value = _elementX.value;
    elementY.value = _elementY.value;
    elementWidth.value = _elementWidth.value;
    elementHeight.value = _elementHeight.value;

    // FloatingPanelの表示位置を計算
    const targetBoundings = {
      targetX: targetX.value,
      targetY: targetY.value,
      targetWidth: targetWidth.value,
      targetHeight: targetHeight.value,
    };
    const position = getPosition({
      placement,
      elementWidth: _elementWidth.value,
      elementHeight: _elementHeight.value,
      targetBoundings,
    });

    // FloatingPanelの表示位置を更新
    x.value = position.x;
    y.value = position.y;
  }

  // マウント直後にupdate関数を呼び出して初期値を設定する
  // コンポーネントのマウント時の処理をtryOnMountedでラップすることで、
  // マウント時に発生する可能性のあるエラーをキャッチし、アプリケーションがクラッシュしないようにする
  tryOnMounted(() => {
    update();
  });

  // elementが変更されたときにFloatingPanelの表示位置を更新
  watch(
    () => unrefElement(elementRef),
    () => {
      nextTick(() => {
        update();
      });
    }
  );

  return {
    x: computedX,
    y: computedY,
  };
};
