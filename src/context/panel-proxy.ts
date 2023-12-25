import { proxy } from "valtio";

const state = proxy<{ isCanvasLoading:boolean, playAnimation: boolean; enableAnimationLoop: boolean }>({
    playAnimation: true,
    enableAnimationLoop: true,
    isCanvasLoading: true
  });

  export { state }