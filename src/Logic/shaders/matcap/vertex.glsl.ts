export default  `#define TOTO
#define MATCAP
#define USE_MATCAP
#define M_PI 3.1415926535897932384626433832795

varying vec2 vUv;

varying vec3 vViewPosition;

#ifndef FLAT_SHADED

    varying vec3 vNormal;
    varying vec2 vNormal2;
#endif

#include <common>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>

#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>

// Custom start
uniform float uRevealProgress;

varying vec3 vWorldPosition;


float easeSin(float _value)
{
    return sin((_value - 0.5) * M_PI) * 0.5 + 0.5;
}



// Custom end

void main() {

    #include <uv_vertex>

    #include <beginnormal_vertex>
    #include <morphnormal_vertex>
    #include <skinbase_vertex>
    #include <skinnormal_vertex>
    #include <defaultnormal_vertex>

    #ifndef FLAT_SHADED // Normal computed with derivatives when FLAT_SHADED

        vNormal = normalize( transformedNormal );

    #endif

    #include <begin_vertex>
    #include <morphtarget_vertex>
    #include <skinning_vertex>
    #include <displacementmap_vertex>

    // Custom start
    vec4 worldNormal = modelMatrix * vec4(normal, 1.0);

    vec4 worldPosition = modelMatrix * vec4(transformed, 1.0);

    // Reveal
    float distanceToCenter = length(worldPosition);
    float zAmplitude = 3.2;
    float revealProgress = (uRevealProgress - distanceToCenter / 30.0) * 5.0;
    revealProgress = 1.0 - clamp(revealProgress, - 0.1, 1.0);
    revealProgress = pow(revealProgress, 2.0);
    if(uRevealProgress > 0.9)
    {
        revealProgress = 0.0;
    }
    worldPosition.z = revealProgress * zAmplitude;

    // Update varying
    vWorldPosition = worldPosition.xyz;

    vec4 mvPosition = viewMatrix * worldPosition;
    //gl_Position = projectionMatrix * mvPosition;
    // Custom end

    // #include <project_vertex>

    #include <logdepthbuf_vertex>
    #include <clipping_planes_vertex>
    #include <fog_vertex>


    vec4 p = vec4( position, 1. );
			
    vec3 e = normalize( vec3( modelViewMatrix * p ) );
    vec3 n = normalize( normalMatrix * normal );
  
    vec3 r = reflect( e, n );
    float m = 2. * sqrt(
      pow( r.x, 2. ) +
      pow( r.y, 2. ) +
      pow( r.z + 1., 2. )
    );
    vNormal2 = r.xy / m + .5;
     

    vViewPosition = - mvPosition.xyz;
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);

}`