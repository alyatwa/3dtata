#ifdef GL_ES
precision highp float;
#endif

#include "./../includes/visibility.glsl"

varying float vUVY;
varying float vOpacity;
varying vec3 vColor;
varying vec3 vNormal;

uniform float uAlphaBlended;

void main(void) {
vec3 c = vec3(1,0.6,0.4);
float alpha = smoothstep(1., 0., abs(vUVY));
alpha *= alpha;
alpha *= vOpacity;
alpha *= getAlpha(vNormal);
gl_FragColor = vec4(vColor * alpha, alpha * uAlphaBlended);
}