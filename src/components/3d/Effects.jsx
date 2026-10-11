import { EffectComposer, Bloom, Vignette, Noise, ToneMapping, ChromaticAberration } from "@react-three/postprocessing";
import { BlendFunction, ToneMappingMode } from "postprocessing";
import { Vector2 } from "three";

const CA = new Vector2(0.0004, 0.0006);

/** Subtle cinematic grade: bloom only on true highlights, vignette, grain, neutral tone map. */
export default function Effects() {
  return (
    <EffectComposer multisampling={4} disableNormalPass>
      <Bloom intensity={0.6} luminanceThreshold={1.02} luminanceSmoothing={0.18} mipmapBlur radius={0.7} />
      <ChromaticAberration offset={CA} radialModulation={false} modulationOffset={0} />
      <Vignette eskil={false} offset={0.3} darkness={0.35} />
      <Noise premultiply blendFunction={BlendFunction.SOFT_LIGHT} opacity={0.12} />
      <ToneMapping mode={ToneMappingMode.NEUTRAL} />
    </EffectComposer>
  );
}
