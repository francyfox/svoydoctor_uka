import auraShader from './aura.frag.glsl?raw';
import flowShader from './flow.frag.glsl?raw';
import cellsShader from './cells.frag.glsl?raw';
import mosaicShader from './mosaic.frag.glsl?raw';
import spectrumShader from './spectrum.frag.glsl?raw';

export type ShaderSceneKey = 'aura' | 'flow' | 'cells' | 'mosaic' | 'spectrum';

export const shaderScenes: Record<ShaderSceneKey, string> = {
	aura: auraShader,
	flow: flowShader,
	cells: cellsShader,
	mosaic: mosaicShader,
	spectrum: spectrumShader
};

export function resolveShaderScene(key: string | undefined, fallback: ShaderSceneKey): string {
	return (key && key in shaderScenes ? shaderScenes[key as ShaderSceneKey] : undefined) ?? shaderScenes[fallback];
}
