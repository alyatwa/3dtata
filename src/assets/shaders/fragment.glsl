  precision mediump float;
  uniform vec3 uColor;
  uniform float uTime;

  varying vec2 vUv;
  varying float vWave;

  void main() {
    float wave = vWave * 0.2;
    
    gl_FragColor = vec4(vUv.x * uColor, 1.0); 
  }