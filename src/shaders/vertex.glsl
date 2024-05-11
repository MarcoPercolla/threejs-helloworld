attribute vec3 color;
attribute float offset;
varying vec3 vColor;
uniform float uTime;
varying float vDistance;

void main() {

  vColor = color;
  vec3 pos = position;
  pos.y += sin(uTime * 2. * (offset - 0.5) + offset * 10.) * 0.05;
  pos.x += cos(uTime * 2. * (offset - 0.5) + offset * 10.) * 0.05;
  
  vec3 wPos = vec4( modelMatrix * vec4(pos, 1.0) ).xyz;
  float dist = distance(cameraPosition, wPos);

  vDistance = smoothstep(20.,0., dist);

  gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  gl_PointSize = 50. * vDistance  * (sin(uTime * 4. + offset * 20.)*0.4 +0.6);
}