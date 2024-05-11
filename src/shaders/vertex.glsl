attribute vec3 color;
attribute float offset;
varying vec3 vColor;
uniform float uTime;

void main() {

  vColor = color;
  vec3 wPos = vec4( modelMatrix * vec4(position, 1.0) ).xyz;
  float dist = distance(cameraPosition, wPos);

  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  gl_PointSize = 150. * smoothstep(15.,0., dist) * (sin(uTime * 4. + offset * 20.)*0.4 +0.6);
}