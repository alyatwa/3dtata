export default `


./earth/earth.fs.glsl

#ifdef GL_ES
    precision highp float;
#endif
    
#include includes/visibility.glsl

varying vec3 vNormal;
varying vec3 vWorld;

uniform samplerCube uTexture;
uniform samplerCube uCloudsTexture;
uniform samplerCube uWaterTexture;
uniform vec3 uBackgroundColor;
uniform vec3 uCamPos;
uniform vec3 uBackgroundColor;
uniform float uFresnelPower;
uniform float uFresnelAmount;
uniform float uWaterSunPower;
uniform float uLandSunPower;
uniform float uWaterSunAmount;
uniform float uLandSunAmount;
uniform vec3 uSunDir;

uniform float uSpatialFrequency;
uniform float uTemporalFrequency;
uniform float uAmplitude;
uniform float uH;
uniform float uTime;
uniform float uVisibility;

#define m4  mat4( 0.00, 0.80, 0.60, -0.4, -0.80,  0.36, -0.48, -0.5, -0.60, -0.48, 0.64, 0.2, 0.40, 0.30, 0.20,0.4)
vec4 twistedSineNoise(vec4 q)
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
        a *= uH;
        f /= uH;
        //f *= 2.;
    }
    return sum;
}

void main(void) {

    vec3 n = normalize(vNormal);
    vec3 v = normalize(uCamPos-vWorld);
    float fresnel = pow(1. - dot(n, v), uFresnelPower)* uFresnelAmount;
    vec3 c = textureCube(uTexture, n).xyz;
//  c *= c;
  float water = textureCube(uWaterTexture, n).x;
  float sunReflection = max(dot(n, uSunDir), 0.);
  float power = mix(uLandSunPower, uWaterSunPower, water);
  float amount = mix(uLandSunAmount, uWaterSunAmount, water);
  c += pow (sunReflection, power) * amount;

    vec3 n1 = n + twistedSineNoise(vec4(n * uSpatialFrequency, uTime * uTemporalFrequency)).xyz * uAmplitude;
    float clouds = textureCube(uCloudsTexture, n1).x;
  //clouds *= clouds;

    c = mix(c, vec3(1,1,1), clouds);

    c = mix(c, uBackgroundColor, fresnel);

/*  float nDotL = dot(n, l);
  c *= max(nDotL, 0.);*/

//  c = sqrt(c);

  gl_FragColor.xyz = c;

    gl_FragColor.w = getAlpha(n);

    //premultiplied alpha
    gl_FragColor.xyz *= gl_FragColor.w;
}

----------------------------------
./earth/earth.vs.glsl

attribute vec3 aPos;
attribute vec2 aUV0;

varying vec3 vWorld;
varying vec3 vNormal;

uniform mat4 uModel;
uniform mat4 uViewProjection;

void main(void) {
    vec4 world = uModel * vec4(aPos , 1.);

    vWorld = world.xyz;

    vNormal = mat3(uModel) * aPos;

    gl_Position = uViewProjection * world;
}

----------------------------------
./glow/glow.fs.glsl

#ifdef GL_ES
    precision highp float;
#endif

#include includes/visibility.glsl

varying float vRadial;
varying vec3 vWorld;

uniform float uTint;
uniform float uBrightness;
uniform float uFalloffColor;

 vec3 brightnessToColor(float b)
 {
       b *= uTint;
    return (vec3(b, b * b, b*b*b * b)/ (uTint)) * uBrightness;
 }

void main(void) {

    float alpha = (1. - vRadial);
    alpha *= alpha;
    float brightness = 1. + alpha * uFalloffColor;
    alpha *= getAlpha(normalize(vWorld));

    gl_FragColor.xyz = brightnessToColor(brightness) * alpha;
    gl_FragColor.w = alpha;
}

----------------------------------
./glow/glow.vs.glsl

attribute vec3 aPos;

varying float vRadial;
varying vec3 vWorld;

uniform mat4 uViewProjection;
uniform float uRadius;

uniform vec3 uCamUp;
uniform vec3 uCamPos;

void main(void) {
    vRadial = aPos.z;

    vec3 side = normalize(cross(normalize(-uCamPos), uCamUp));
    vec3 p = aPos.x * side + aPos.y * uCamUp;
    p *= 1. + aPos.z * uRadius;

    vec4 world = vec4(p , 1.);

    vWorld = world.xyz;

    gl_Position = uViewProjection * world;
}
----------------------------------
./includes/simplex4d.glsl

//
// Description : Array and textureless GLSL 2D/3D/4D simplex
//               noise functions.
//      Author : Ian McEwan, Ashima Arts.
//  Maintainer : ijm
//     Lastmod : 20110822 (ijm)
//     License : Copyright (C) 2011 Ashima Arts. All rights reserved.
//               Distributed under the MIT License. See LICENSE file.
//               https://github.com/ashima/webgl-noise
//

vec4 mod289(vec4 x) {
    return x - floor(x * (1.0 / 289.0)) * 289.0; 
}

float mod289(float x) {
    return x - floor(x * (1.0 / 289.0)) * 289.0; 
}

vec4 permute(vec4 x) {
     return mod289(((x*34.0)+1.0)*x);
}

float permute(float x) {
     return mod289(((x*34.0)+1.0)*x);
}

vec4 taylorInvSqrt(vec4 r)
{
    return 1.79284291400159 - 0.85373472095314 * r;
}

float taylorInvSqrt(float r)
{
    return 1.79284291400159 - 0.85373472095314 * r;
}

vec4 grad4(float j, vec4 ip)
{
    const vec4 ones = vec4(1.0, 1.0, 1.0, -1.0);
    vec4 p,s;

    p.xyz = floor( fract (vec3(j) * ip.xyz) * 7.0) * ip.z - 1.0;
    p.w = 1.5 - dot(abs(p.xyz), ones.xyz);
    s = vec4(lessThan(p, vec4(0.0)));
    p.xyz = p.xyz + (s.xyz*2.0 - 1.0) * s.www;

    return p;
}

// (sqrt(5) - 1)/4 = F4, used once below
#define F4 0.309016994374947451

float snoise(vec4 v)
{
const vec4  C = vec4( 0.138196601125011,  // (5 - sqrt(5))/20  G4
                    0.276393202250021,  // 2 * G4
                    0.414589803375032,  // 3 * G4
                    -0.447213595499958); // -1 + 4 * G4

// First corner
    vec4 i  = floor(v + dot(v, vec4(F4)) );
    vec4 x0 = v -   i + dot(i, C.xxxx);

// Other corners

// Rank sorting originally contributed by Bill Licea-Kane, AMD (formerly ATI)
    vec4 i0;
    vec3 isX = step( x0.yzw, x0.xxx );
    vec3 isYZ = step( x0.zww, x0.yyz );
//  i0.x = dot( isX, vec3( 1.0 ) );
    i0.x = isX.x + isX.y + isX.z;
    i0.yzw = 1.0 - isX;
//  i0.y += dot( isYZ.xy, vec2( 1.0 ) );
    i0.y += isYZ.x + isYZ.y;
    i0.zw += 1.0 - isYZ.xy;
    i0.z += isYZ.z;
    i0.w += 1.0 - isYZ.z;

    // i0 now contains the unique values 0,1,2,3 in each channel
    vec4 i3 = clamp( i0, 0.0, 1.0 );
    vec4 i2 = clamp( i0-1.0, 0.0, 1.0 );
    vec4 i1 = clamp( i0-2.0, 0.0, 1.0 );

    //  x0 = x0 - 0.0 + 0.0 * C.xxxx
    //  x1 = x0 - i1  + 1.0 * C.xxxx
    //  x2 = x0 - i2  + 2.0 * C.xxxx
    //  x3 = x0 - i3  + 3.0 * C.xxxx
    //  x4 = x0 - 1.0 + 4.0 * C.xxxx
    vec4 x1 = x0 - i1 + C.xxxx;
    vec4 x2 = x0 - i2 + C.yyyy;
    vec4 x3 = x0 - i3 + C.zzzz;
    vec4 x4 = x0 + C.wwww;

// Permutations
    i = mod289(i);
    float j0 = permute( permute( permute( permute(i.w) + i.z) + i.y) + i.x);
    vec4 j1 = permute( permute( permute( permute (
             i.w + vec4(i1.w, i2.w, i3.w, 1.0 ))
           + i.z + vec4(i1.z, i2.z, i3.z, 1.0 ))
           + i.y + vec4(i1.y, i2.y, i3.y, 1.0 ))
           + i.x + vec4(i1.x, i2.x, i3.x, 1.0 ));

// Gradients: 7x7x6 points over a cube, mapped onto a 4-cross polytope
// 7*7*6 = 294, which is close to the ring size 17*17 = 289.
    vec4 ip = vec4(1.0/294.0, 1.0/49.0, 1.0/7.0, 0.0) ;

    vec4 p0 = grad4(j0,   ip);
    vec4 p1 = grad4(j1.x, ip);
    vec4 p2 = grad4(j1.y, ip);
    vec4 p3 = grad4(j1.z, ip);
    vec4 p4 = grad4(j1.w, ip);

// Normalise gradients
    vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
    p0 *= norm.x;
    p1 *= norm.y;
    p2 *= norm.z;
    p3 *= norm.w;
    p4 *= taylorInvSqrt(dot(p4,p4));

// Mix contributions from the five corners
    vec3 m0 = max(0.6 - vec3(dot(x0,x0), dot(x1,x1), dot(x2,x2)), 0.0);
    vec2 m1 = max(0.6 - vec2(dot(x3,x3), dot(x4,x4)            ), 0.0);
    m0 = m0 * m0;
    m1 = m1 * m1;
    return 49.0 * ( dot(m0*m0, vec3( dot( p0, x0 ), dot( p1, x1 ), dot( p2, x2 )))
               + dot(m1*m1, vec2( dot( p3, x3 ), dot( p4, x4 ) ) ) ) ;

    }
----------------------------------
./includes/visibility.glsl

uniform float uVisibility;
uniform float uDirection;
uniform vec3 uLightView;

//const vec3 l = vec3(0.57735,0.57735,0.57735);

float getAlpha(vec3 n)
{
//    float nDotL = dot(n, l) * uDirection;
    float nDotL = dot(n, uLightView) * uDirection;
    return smoothstep(1., 1.5, nDotL + uVisibility * 2.5);
}

----------------------------------
./moon/moon.fs.glsl

#ifdef GL_ES
    precision highp float;
#endif

#include includes/visibility.glsl

varying vec3 vNormal;
varying vec3 vWorld;

uniform samplerCube uTexture;
uniform vec3 uBackgroundColor;
uniform vec3 uCamPos;
uniform vec3 uBackgroundColor;
uniform float uFresnelPower;
uniform float uFresnelAmount;

void main(void) {
    vec3 n = normalize(vNormal);
    vec3 v = normalize(uCamPos-vWorld);
    float fresnel = pow(1. - dot(n, v), uFresnelPower)* uFresnelAmount;
    vec3 c = textureCube(uTexture, n).xyz;
    c = mix(c, uBackgroundColor, fresnel);
    gl_FragColor.xyz = c;

    gl_FragColor.w = getAlpha(n);

  //premultiplied alpha
  gl_FragColor.xyz *= gl_FragColor.w;
}

----------------------------------
./moon/moon.vs.glsl

attribute vec3 aPos;
attribute vec2 aUV0;

varying vec3 vWorld;
varying vec3 vNormal;

uniform mat4 uModel;
uniform mat4 uViewProjection;

void main(void) {
    vec4 world = uModel * vec4(aPos , 1.);

    vWorld = world.xyz;

    vNormal = mat3(uModel) * aPos;

    gl_Position = uViewProjection * world;
}

----------------------------------
./perlinCube/perlinCube.fs.glsl.ts

#ifdef GL_ES
    precision highp float;
#endif

#include includes/simplex4d.glsl

varying vec3 vWorld;
uniform float uTime;
uniform float uSpatialFrequency;
uniform float uTemporalFrequency;
uniform float uH;
uniform float uContrast;
uniform float uFlatten;

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


----------------------------------

./perlinCube/perlinCube.vs.glsl.ts


attribute vec3 aPos;
attribute vec2 aUV0;

varying vec3 vWorld;

uniform mat4 uViewProjection;

void main(void) {
    vec4 world = vec4(aPos , 1.);

    vWorld = world.xyz;

    gl_Position = uViewProjection * world;
}



----------------------------------

./sunFlares/sunFlares.fs.glsl.ts



#ifdef GL_ES
    precision highp float;
#endif

#include includes/visibility.glsl

varying float vUVY;
varying float vOpacity;
varying vec3 vColor;
varying vec3 vNormal;
uniform float uAlphaBlended;

void main(void) {
    float alpha = smoothstep(1., 0., abs(vUVY));
    alpha *= alpha;
    alpha *= vOpacity;
    alpha *= getAlpha(vNormal);
    gl_FragColor = vec4(vColor * alpha, alpha * uAlphaBlended);
}


----------------------------------

./sunFlares/sunFlares.vs.glsl.ts


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

    vNormal = normalize(p);

    //transparent base
    vOpacity = smoothstep(1., 1.05, length(p));
    //fade out while growing
    vOpacity *= 1. - animPhase;
    vOpacity *= uOpacity;

    vColor = hue (aWireRandom.w * uHueSpread + uHue);

    gl_Position = uViewProjection * vec4(p , 1.);
}


----------------------------------
./sunRays/sunRays.fs.glsl.ts


#ifdef GL_ES
    precision highp float;
#endif

#include includes/visibility.glsl

varying float vUVY;
varying float vOpacity;
varying vec3 vColor;
varying vec3 vNormal;

uniform float uAlphaBlended;

void main(void) {
    vec3 c = vec3(1,0.6,0.4) ;
    float alpha = smoothstep(1., 0., abs(vUVY));
    alpha *= alpha;
    alpha *= vOpacity;
    alpha *= getAlpha(vNormal);
    gl_FragColor = vec4(vColor * alpha, alpha * uAlphaBlended);
}









----------------------------------

./sunRays/sunRays.vs.glsl.ts



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
uniform mat4 uViewProjection;
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
    vUVY = aPos.z;

    float animPhase = fract(uTime * 0.3 * (aWireRandom.y * 0.5) + aWireRandom.x);

    vec3 p = getPos(aPos.x, animPhase);
    vec3 p1 = getPos(aPos.x + 0.01, animPhase);

    vec3 dir = p1 - p;
    dir = normalize(dir);
    vec3 v = normalize(p - uCamPos);
    vec3 side = normalize(cross(v, dir));

    float width = uWidth  * aPos.z * (1. - aPos.x);

    vNormal = normalize(p);

    p += side * width;

    vOpacity = uOpacity * (0.5 + aWireRandom.w);

    vColor = spectrum (aWireRandom.w * uHueSpread + uHue);

    gl_Position = uViewProjection * vec4(p , 1.);
}

----------------------------------

./sunSphere/sunSphere.fs.glsl

#ifdef GL_ES
    precision highp float;
#endif

#include includes/visibility.glsl

varying vec3 vWorld;
varying vec3 vNormal;

varying vec3 vLayer0;
varying vec3 vLayer1;
varying vec3 vLayer2;

uniform samplerCube uPerlinCube;

uniform float uFresnelPower;
uniform float uFresnelInfluence;
uniform float uTint;
uniform float uBase;
uniform float uBrightnessOffset;
uniform float uBrightness;
uniform vec3 uCamPos;

 vec3 brightnessToColor(float b)
 {
     b *= uTint;
     return (vec3(b, b * b, b*b*b * b)/ (uTint)) * uBrightness;
 }
    float ocean(in vec3 p)
    {
        float sum = 0.;
        sum += textureCube(uPerlinCube, vLayer0).r;
        sum += textureCube(uPerlinCube, vLayer1).r;
        sum += textureCube(uPerlinCube, vLayer2).r;
        return sum * 0.33;
    }

    float distToCenter(vec3 ro, vec3 rd)
    {
      float d = dot(- ro, rd);
      return length(ro + d * rd);
    }

 void mainImage( out vec4 fragColor, in vec2 fragCoord )
 {
    vec3 rd = normalize(vWorld - uCamPos);
    vec3 ro = uCamPos;
    vec3 n = normalize(vNormal);
    float nDotV = dot(n, -rd);
    float fresnel = pow(1. - nDotV,uFresnelPower) * uFresnelInfluence;

    float brightness = ocean(n);
    brightness = brightness * uBase + uBrightnessOffset;
    brightness += fresnel;

    vec3 col = brightnessToColor(brightness);
    col = clamp(col, 0., 1.);

    fragColor = vec4( col , getAlpha(n));
 }

void main(void) {
    mainImage(gl_FragColor, gl_FragCoord.xy);
}

----------------------------------
./sunSphere/sunSphere.vs.glsl

attribute vec3 aPos;
attribute vec2 aUV0;

varying vec3 vWorld;
varying vec3 vNormal;

varying vec3 vLayer0;
varying vec3 vLayer1;
varying vec3 vLayer2;

uniform mat4 uModel;
uniform mat4 uViewProjection;
uniform float uTime;

   mat2 getMatrix(float a)
   {
       float s = sin(a);
       float c = cos(a);
       return mat2(c, -s, s, c);
   }


void setLayers(vec3 p){
    float t = uTime * 0.015;
    mat2 m = getMatrix(t);
    float sum = 0.;

    vec3 p1 = p;
    p1.yz = m * p1.yz;
    vLayer0 = p1;

    p1 = p;
     m = getMatrix(t + 2.094);
    p1.zx = m * p1.zx;
    vLayer1 = p1;

    p1 = p;
     m = getMatrix(t + 4.188);
    p1.xy = m * p1.xy;
    vLayer2 = p1;
}

void main(void) {
    vec4 world = uModel * vec4(aPos , 1.);

    vWorld = world.xyz;
    vNormal = mat3(uModel) * aPos;
    setLayers(aPos);

    gl_Position = uViewProjection * world;
}`