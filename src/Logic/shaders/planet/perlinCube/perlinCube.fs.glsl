#ifdef GL_ES
precision highp float;
#endif

#include "./../includes/simplex4d.glsl"

#define OCTAVES   		2

varying vec3 vWorld;
uniform float uTime;
uniform float uSpatialFrequency;
uniform float uTemporalFrequency;
uniform float uH;
uniform float uContrast;
uniform float uFlatten;
	varying vec2 vUv;


vec2 fbm(vec4 p)
{
vec4 q =  p;
float a = 1.;
float f = 1.;
vec2 sum = vec2(0);
for(int i = 0; i < OCTAVES ; i++){
    sum.x +=  snoise(p * f) * a;
    //sum.x +=  abs(snoise(p * f)) * a;
    p.w += 100.;
    sum.y +=  snoise(p * f) * a;
    a *= uH;
    f *= 2.;
}
return sum;
}


void main(void) {
vec3 world = normalize(vWorld);
world += 12.45;
vec4 p = vec4(world * uSpatialFrequency, uTime * uTemporalFrequency);
gl_FragColor.xy = fbm(p) * uContrast + 0.5;

//low frequency modulation on opacity to mimic flares
vec4 p2 = vec4(world * 2., uTime * uTemporalFrequency);
float modulate = max(snoise(p2) , 0.);
gl_FragColor.x *= mix(1., modulate, uFlatten);

gl_FragColor.zw = gl_FragColor.yx;
}