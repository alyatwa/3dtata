  precision mediump float;
  varying vec2 vUv;
  varying float vWave;

  void main() {
    vUv = uv;
    
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);  
  }