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