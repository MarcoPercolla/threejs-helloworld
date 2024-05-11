attribute vec3 color;
attribute float offset;
attribute vec3 position2;
varying vec3 vColor;
uniform float uTime;
uniform float uProgress;
varying float vDistance;

void main() {

  vColor = color;
  vec3 pos = mix(position,position2,uProgress);
  pos *= 1. + sin(3.14 * uProgress) * 3.;
  pos.y += sin(uTime * 1. * (offset - 2.) + offset * 10.) * 0.05;
  pos.x += cos(uTime * 1. * (offset - 2.) + offset * 10.) * 0.05;
  
  vec3 wPos = vec4( modelMatrix * vec4(pos, 1.0) ).xyz;
  float dist = distance(cameraPosition, wPos);

  vDistance = smoothstep(12.,1.5, dist);

  gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.3);
  gl_PointSize = 100. * vDistance * (sin(uTime * 4. + offset * 30.)*0.2 +0.3);
}