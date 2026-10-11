import { useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

const FOOT = /* glsl */ `
  #include <tonemapping_fragment>
  #include <colorspace_fragment>
`;

/** Luminous gradient sky dome with a warm horizon glow (never dark). */
export function Sky({ w }) {
  const mat = useMemo(
    () =>
      new THREE.ShaderMaterial({
        side: THREE.BackSide,
        depthWrite: false,
        fog: false,
        uniforms: { uTop: { value: w.top }, uMid: { value: w.mid }, uHor: { value: w.horizon }, uGlow: { value: w.glow }, uK: { value: 0.5 } },
        vertexShader: /* glsl */ `
          varying vec3 vDir;
          void main(){ vDir = normalize(position); gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.); }`,
        fragmentShader: /* glsl */ `
          uniform vec3 uTop,uMid,uHor,uGlow; uniform float uK; varying vec3 vDir;
          void main(){
            float h = vDir.y;
            vec3 c = mix(uHor, uMid, smoothstep(-.02, .2, h));
            c = mix(c, uTop, smoothstep(.06, .42, h));
            float g = pow(max(dot(normalize(vDir), normalize(vec3(0.,.16,-1.))), 0.), 14.);
            float g2 = pow(max(dot(normalize(vDir), normalize(vec3(-.5,.5,-.8))), 0.), 30.);
            c += uGlow * (g * .55 + g2 * .3) * uK;
            gl_FragColor = vec4(c, 1.);
            ${FOOT}
          }`,
      }),
    [w]
  );
  useFrame(() => (mat.uniforms.uK.value = 0.55 + w.rays * 0.3));
  return (
    <mesh renderOrder={-10} frustumCulled={false} material={mat}>
      <sphereGeometry args={[90, 32, 24]} />
    </mesh>
  );
}

/** Calm reflective-looking water: caustic light, ripples from the cake stage, glints. */
export default function WaterSurface({ w }) {
  const mat = useMemo(
    () =>
      new THREE.ShaderMaterial({
        fog: false,
        uniforms: {
          uTime: { value: 0 }, uC1: { value: w.water1 }, uC2: { value: w.water2 },
          uHor: { value: w.horizon }, uGlow: { value: w.glow }, uRip: { value: 0 }, uWarm: { value: 0 },
        },
        vertexShader: /* glsl */ `
          varying vec3 vW;
          void main(){ vec4 p = modelMatrix * vec4(position,1.); vW = p.xyz; gl_Position = projectionMatrix * viewMatrix * p; }`,
        fragmentShader: /* glsl */ `
          uniform float uTime,uRip,uWarm; uniform vec3 uC1,uC2,uHor,uGlow; varying vec3 vW;
          float caustic(vec2 p){
            float t = uTime*.25;
            float a = sin(p.x*1.7+t*2.)+sin(p.y*1.9-t*1.6)+sin((p.x+p.y)*1.3+t*1.2)+sin(length(p)*2.2-t*2.);
            return pow(1.-abs(a*.25), 6.);
          }
          void main(){
            vec2 p = vW.xz;
            vec3 v = vW - cameraPosition; float d = length(v); v /= d;
            float fres = pow(1. - clamp(-v.y, 0., 1.), 3.);
            vec3 base = mix(uC1, uC2, clamp(d/30., 0., 1.));
            float c = caustic(p*.6)*.6 + caustic(p*1.3+4.)*.4;
            base += c * .2 * vec3(1.,.98,.92);
            float r = length(p);
            float rip = sin(r*6.5 - uTime*1.5) * smoothstep(9., 2., r) * smoothstep(2.6, 3.4, r);
            base += rip * .05 * uRip;
            base += uGlow * exp(-r*.42) * .26 * uWarm;
            float g = pow(max(0., sin(p.x*9.+uTime*.8) * sin(p.y*8.-uTime*.7)), 24.) * .55;
            base += g * uGlow * (1.-fres);
            vec3 col = mix(base, uHor, clamp(fres*.5 + smoothstep(18., 70., d)*.55, 0., 1.));
            gl_FragColor = vec4(col, 1.);
            ${FOOT}
          }`,
      }),
    [w]
  );
  useFrame(({ clock }) => {
    mat.uniforms.uTime.value = clock.elapsedTime;
    mat.uniforms.uRip.value = Math.min(w.cakeS, 1);
    mat.uniforms.uWarm.value = Math.min(w.warm, 1.4) * Math.min(w.cakeS, 1);
  });
  return (
    <mesh position={[0, -2.62, -22]} rotation-x={-Math.PI / 2} material={mat} frustumCulled={false}>
      <planeGeometry args={[160, 90]} />
    </mesh>
  );
}
