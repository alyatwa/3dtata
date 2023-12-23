attribute vec3 aPos;
attribute vec2 aUV0;
varying vec2 vUv;
varying vec3 vWorld;

uniform mat4 uViewProjection;

void main(void) {
   vUv = uv;
    vec4 world = vec4(position , 1.);

    vWorld = world.xyz;

 gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);

   // gl_Position = uViewProjection * world;
}