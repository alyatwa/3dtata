//attribute vec3 position;

varying float vRadial;
varying vec3 vWorld;
varying vec3 vPosition;
 
uniform vec3 uCamUp;
uniform vec3 uCamPos;
uniform float uRadius;
varying vec3	vVertexWorldPosition;
varying vec3	vVertexNormal;
varying vec4	vFragColor;


void main(void) {
    vPosition=position;
    vec3 side = normalize(cross(normalize(-uCamPos), uCamUp));
    vec3 p = position.x * side + position.y * uCamUp;
    p *= 1. + position.z * uRadius;
    
    vec4 world = vec4(p , 1.);
    vWorld = world.xyz;
    gl_Position	= projectionMatrix * modelViewMatrix * vec4(p, 1.0);
    
    //vVertexNormal	= normalize(normalMatrix * normal);
    //vVertexWorldPosition	= (modelMatrix * vec4(position, 1.0)).xyz;
    //vWorld = vVertexWorldPosition;
}