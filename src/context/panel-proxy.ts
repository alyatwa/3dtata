import { proxy } from "valtio";

const state = proxy<{ playAnimation: boolean; enableAnimationLoop: boolean }>({
    playAnimation: true,
    enableAnimationLoop: true
  });

  export { state }