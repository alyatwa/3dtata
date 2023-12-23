attribute vec3 aPos;
attribute vec3 aPos0;
attribute vec4 aWireRandom;

varying float vUVY;
varying float vOpacity;
varying vec3 vColor;
varying vec3 vNormal;


uniform float uHueSpread;
uniform float uHue;
uniform float uLength;
uniform float uWidth;
uniform float uTime;
uniform float uNoiseFrequency;
uniform float uNoiseAmplitude;
uniform vec3 uCamPos;
//uniform mat4 uViewProjection;
uniform float uOpacity;

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
    float size = aWireRandom.z + 0.2;

    float d = phase * uLength * size;

    vec3 p = aPos0 + aPos0 * d;

    p += twistedSineNoise(vec4(p * uNoiseFrequency,uTime ), 0.707).xyz * (d * uNoiseAmplitude);

    return p;
}

//TODO: use something like this to backface cull.
//or do depth test
float distToCenter(vec3 ro, vec3 rd)
{
  float d = dot(- ro, rd);
  return length(ro + d * rd);
}

vec3 spectrum(in float d)
{
    return smoothstep(0.25, 0., abs(d + vec3(-0.375,-0.5,-0.625)));
}

void main(void) {
    vUVY = position.z;

    float animPhase = fract(uTime * 0.3 * (aWireRandom.y * 0.5) + aWireRandom.x);

    vec3 p = getPos(position.x, animPhase);
    vec3 p1 = getPos(position.x + 0.01, animPhase);

    vec3 dir = p1 - p;
    dir = normalize(dir);
    vec3 v = normalize(p - uCamPos);
    vec3 side = normalize(cross(v, dir));

    float width = uWidth  * position.z * (1. - position.x);

    vNormal = normalize(p);

    p += side * width;

    vOpacity = uOpacity * (0.5 + aWireRandom.w);

    vColor = spectrum (aWireRandom.w * uHueSpread + uHue);
     gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
    }
