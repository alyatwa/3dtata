export default ` 

precision highp float;

in vec3 positionX;
uniform vec2 uResolution;
uniform vec2 sunDirectionXY;
uniform float uQuality;

out vec3 uSunDirection;
out vec2 uvu;

void main() {
   vec2 resolution = uResolution * uQuality;
   uvu = (position.xy - 0.5) * resolution / min(resolution.y, resolution.x);
   uSunDirection = normalize(vec3(sunDirectionXY, 0.));

   gl_Position = vec4(2.0 * position - 1.0, 1.0);
}`