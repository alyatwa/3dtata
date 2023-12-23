attribute vec3 aPos;
attribute vec3 aPos0;
attribute vec3 aPos1;
attribute vec4 aWireRandom;

varying float vUVY;
varying float vOpacity;
varying vec3 vColor;
varying vec3 vNormal;

uniform float uWidth;
uniform float uAmp;
uniform float uTime;
uniform float uNoiseFrequency;
uniform float uNoiseAmplitude;
uniform vec3 uCamPos;
uniform mat4 uViewProjection;
uniform float uOpacity;
uniform float uHueSpread;
uniform float uHue;

 #define m4  mat4( 0.00, 0.80, 0.60, -0.4, -0.80,  0.36, -0.48, -0.5, -0.60, -0.48, 0.64, 0.2, 0.40, 0.30, 0.20,0.4)
    vec4 twistedSineNoise(vec4 q, float falloff)
    {
        float a = 1.;
        float f = 1.;
        vec4 sum = vec4(0);
        for(int i = 0; i < 4 ; i++){
            q = m4 * q;
            vec4 s = sin( q.ywxz * f) * a;
            q += s;
            sum += s;
         //sum += max(s, 0.);
            a *= falloff;
            f /= falloff;
         //f *= 2.;
        }
        return sum;
    }

vec3 getPos(float phase, float animPhase)
{
    float size = distance(aPos0, aPos1);
    vec3 n = normalize((aPos0 + aPos1) * 0.5);

    vec3 p = mix(aPos0, aPos1, phase);

    float amp = sin(phase * 3.14) * size * uAmp;
    //amp *= max(sin((uTime* 0.05 * (aWireRandom.y * 0.5) + aWireRandom.x) * 6.28), 0.);
    amp *= animPhase;

    p += n * amp;

    p += twistedSineNoise(vec4(p * uNoiseFrequency,uTime ), 0.707).xyz * (amp * uNoiseAmplitude);
    //p += n * (0.5 - abs( phase - 0.5)) * size * 5.;

    return p;
}

 #define hue(v)  ( .6 + .6 * cos( 6.3*(v)  + vec3(0,23,21)  ) )

vec3 spectrum(in float d)
{
    return smoothstep(0.25, 0., abs(d + vec3(-0.375,-0.5,-0.625)));
}

void main(void) {
    vUVY = aPos.z;

    float animPhase = fract(uTime * 0.3 * (aWireRandom.y * 0.5) + aWireRandom.x);

    vec3 p = getPos(aPos.x, animPhase);
    vec3 p1 = getPos(aPos.x + 0.01, animPhase);

    vec3 dir = p1 - p;
    dir = normalize(dir);
    
    vec3 v = normalize(p - uCamPos);
    vec3 side = normalize(cross(v, dir));

    float width = uWidth  * aPos.z;
    width *= 1. + animPhase;

    p += side * width;
//vNormal = normalize( normalMatrix * normal );
    vNormal = normalize(p);

    //transparent base
    vOpacity = smoothstep(1., 1.05, length(p));
    //fade out while growing
    vOpacity *= 1. - animPhase;
    vOpacity *= uOpacity;

    vColor = hue (aWireRandom.w * uHueSpread + uHue);

    gl_Position =projectionMatrix * modelViewMatrix * vec4(p, 1.0);// uViewProjection * vec4(p , 1.);
}