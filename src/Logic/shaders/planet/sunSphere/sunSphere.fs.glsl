#ifdef GL_ES
    precision highp float;
#endif

#include "./../includes/visibility";
#define CAMERA_POSITION vec3(0., 0., 6.0)


varying vec3 vWorld;
varying vec3 vNormal;

varying vec3 vLayer0;
varying vec3 vLayer1;
varying vec3 vLayer2;
varying vec3 vPosition;
in vec2 uvu;

uniform samplerCube uPerlinCube;


uniform float uFresnelPower;
uniform float uFresnelInfluence;
uniform float uTint;
uniform float uBase;
uniform float uBrightnessOffset;
uniform float uBrightness;
uniform vec3 uCamPos;

#define FOCAL_LENGTH CAMERA_POSITION.z / (CAMERA_POSITION.z +10.0)


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


   //vec3 ro = vec3(CAMERA_POSITION);
   //vec3 rd = normalize(vec3(uvu * FOCAL_LENGTH, -1.));


    vec3 n = normalize(vNormal);
    float nDotV = dot(n, -rd);
    float fresnel = pow(1. - nDotV,uFresnelPower) * uFresnelInfluence;

    float brightness = ocean(n);
    brightness = brightness * uBase + uBrightnessOffset;
    brightness += fresnel;

    vec3 col = brightnessToColor(brightness);
    col = clamp(col, 0., 1.);

     //fragColor = vec4(1.,1.,0.0, 1.0);
   fragColor = vec4( col , getAlpha(n));
 }

void main(void) {
    mainImage(gl_FragColor, gl_FragCoord.xy);
}