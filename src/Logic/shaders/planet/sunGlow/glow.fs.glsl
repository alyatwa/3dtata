#ifdef GL_ES
    precision highp float;
#endif

#include "./../includes/visibility.glsl"

varying float vRadial;
varying vec3 vPosition;
varying vec3 vWorld;

uniform float uTint;
uniform float uBrightness;
uniform float uFalloffColor;
varying vec3	vVertexNormal;
varying vec3	vVertexWorldPosition;
 vec3 brightnessToColor(float b)
 {
       b *= uTint;
    return (vec3(b, b * b, b*b*b * b)/ (uTint)) * uBrightness;
 }

void main(void) { 



vec3 worldCameraToVertex= vVertexWorldPosition - cameraPosition; 
vec3 viewCameraToVertex	= (viewMatrix * vec4(worldCameraToVertex, 0.0)).xyz; 
viewCameraToVertex	= normalize(viewCameraToVertex); 
float intensity		= pow(uTint + dot(vVertexNormal, viewCameraToVertex), uBrightness);

    float alpha = (1. - vPosition.z);
    alpha *= alpha;
    float brightness = 1. + alpha * uFalloffColor;
    alpha *= getAlpha(normalize(vWorld));

    gl_FragColor.xyz = brightnessToColor(brightness) * alpha;
    gl_FragColor.w = alpha;
    


//gl_FragColor		= vec4(uFalloffColor, intensity);
 
    //gl_FragColor = vec4(brightnessToColor(brightness) * alpha, alpha); 
}
