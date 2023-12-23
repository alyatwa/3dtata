export default ` 

precision highp float;
precision mediump int;
precision mediump sampler2D;

in vec2 uvu;
out vec4 fragColor;

//===================//
//  Global uniforms  //
//===================//

uniform float uTime;
uniform vec2 uResolution;
uniform vec3 uPlanetPosition;
uniform float uPlanetRadius;
uniform float uRotationOffset;
uniform float uBumpStrength;
uniform sampler2D uPlanetColor;
uniform sampler2D uStars;

//==========================//
//  Controllable  uniforms  //
//==========================//

uniform vec3 uAtmosphereColor;
uniform float uAtmosphereDensity;
uniform float uSunIntensity;
uniform float uAmbientLight;
in vec3 uSunDirection;

//==========================================================//
//  Constants (could be turned into controllable uniforms)  //
//==========================================================//

// Planet geometry
#define ROTATION_SPEED .1
#define PLANET_ROTATION rotateY(uTime * ROTATION_SPEED + uRotationOffset)

// Lighting
#define SUN_COLOR vec3(1.0, 1.0, 1.0)
#define DEEP_SPACE vec3(0., 0., 0.0005)

// Ray tracing
#define INFINITY 1e10
#define CAMERA_POSITION vec3(0., 0., 6.0)
#define FOCAL_LENGTH CAMERA_POSITION.z / (CAMERA_POSITION.z - uPlanetPosition.z)

#define PI acos(-1.)

//=========//
//  Types  //
//=========//

struct Material {
  vec3 color;
  float diffuse;
  float specular;
  vec3 emission;
};

struct Hit {
  float len;
  vec3 normal;
  Material material;
};

struct Sphere {
  vec3 position;
  float radius;
};

// Note: I had created a struct for Ray but then deleted it because it caused artifacts on some mobile devices
// because of a precision issue with struct (https://github.com/KhronosGroup/WebGL/issues/3351)
// I use ro and rd instead in this shader.

Hit miss = Hit(INFINITY, vec3(0.), Material(vec3(0.), -1., -1., vec3(-1.)));

Sphere getPlanet() {
  return Sphere(uPlanetPosition, uPlanetRadius);
}

//===============================================//
//  Generic utilities stolen from smarter people //
//===============================================//

float inverseLerp(float v, float minValue, float maxValue) {
  return (v - minValue) / (maxValue - minValue);
}

float remap(float v, float inMin, float inMax, float outMin, float outMax) {
  float t = inverseLerp(v, inMin, inMax);
  return mix(outMin, outMax, t);
}

vec2 sphereProjection(vec3 p, vec3 origin) {
  vec3 dir = normalize(p - origin);
  float longitude = atan(dir.x, dir.z); // [-PI, PI]
  float latitude = asin(dir.y); // [-PI/2, PI/2]

  return vec2(
    (longitude + PI) / (2. * PI), // [0, 1]
    (latitude + PI / 2.) / PI // [0, 1]
  );
}

// https://iquilezles.org/articles/intersectors/
float sphIntersect(in vec3 ro, in vec3 rd, in Sphere sphere) {
  vec3 oc = ro - sphere.position;
  float b = dot(oc, rd);
  float c = dot(oc, oc) - sphere.radius * sphere.radius;
  float h = b * b - c;
  if(h < 0.0)
    return -1.; // no intersection
  return -b - sqrt(h);
}

mat3 rotateY(float angle) {
  float c = cos(angle);
  float s = sin(angle);
  return mat3(//
  vec3(c, 0, s),//
  vec3(0, 1, 0),//
  vec3(-s, 0, c)//
  );
}

// Zavie - https://www.shadertoy.com/view/lslGzl
vec3 simpleReinhardToneMapping(vec3 color) {
  float exposure = 1.5;
  color *= exposure / (1. + color / exposure);
  color = pow(color, vec3(1. / 2.4));
  return color;
}

// https://www.shadertoy.com/view/MtX3z2
float Sigmoid (float x) {
  return 1.0 / (1.0 + (exp(-(x - 0.7) * 6.5))); 
}

vec3 Scurve (vec3 color) {
  return vec3(Sigmoid(color.x), Sigmoid(color.y), Sigmoid(color.z));
}

//========//
//  Misc  //
//========//

 
 

vec3 spaceColor(vec3 direction) {
  vec3 backgroundCoord = direction * rotateY(uTime * ROTATION_SPEED / 3. + 1.5);

  vec2 textureCoord = sphereProjection(backgroundCoord, vec3(0.));
  textureCoord.x = 1. - textureCoord.x; // flip X because we are inside the texture
  vec3 stars = texture(uStars, textureCoord).rgb;

  return DEEP_SPACE + stars * stars * stars * .5;
}

 

//===============//
//  Ray Tracing  //
//===============//

 

vec3 radiance(vec3 ro, vec3 rd) {
  vec3 color = vec3(0.);
  float spaceMask = 1.;
  

   
    float zoomFactor = min(uResolution.x / uResolution.y, 1.); // zoom for portrait mode because the background image is cropped to optimize file size
    vec3 backgroundRd = normalize(vec3(uvu * zoomFactor, -1.)); // background not affected by focal length
    color = spaceColor(backgroundRd);
  

  return color;
}

//========//
//  Main  //
//========//

void main() {
  vec3 ro = vec3(CAMERA_POSITION);
  vec3 rd = normalize(vec3(uvu * FOCAL_LENGTH, -1.));

  vec3 color = radiance(ro, rd);

  // color grading
  color = simpleReinhardToneMapping(color);

  // vignette
  color *= 1. - 0.5 * pow(length(uvu), 3.);

  fragColor = vec4(color, 1.0);
}`