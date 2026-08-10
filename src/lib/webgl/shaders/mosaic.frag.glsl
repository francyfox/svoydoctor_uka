precision mediump float;

varying vec2 vUv;

uniform float uTime;
uniform float uScroll;
uniform vec2 uResolution;
uniform vec3 uAccent;
uniform vec3 uPrimary;
uniform vec3 uPrimaryDark;

/* "Клеточная мозаика" — we-help: сетка пульсирующих кружков разного размера. */

float hash(vec2 p) {
	return fract(sin(dot(p, vec2(41.3, 289.1))) * 43758.5453);
}

void main() {
	vec2 uv = vUv;
	uv.x *= uResolution.x / uResolution.y;
	float t = uTime + uScroll * 2.0;

	float scale = 9.0;
	vec2 grid = uv * scale;
	vec2 cellId = floor(grid);
	vec2 cellUv = fract(grid) - 0.5;

	float n = hash(cellId);
	float pulse = sin(t * 0.6 + n * 6.2831) * 0.5 + 0.5;
	float radius = mix(0.16, 0.4, n) * mix(0.7, 1.0, pulse);

	float dist = length(cellUv);
	float d = 1.0 - smoothstep(radius - 0.08, radius, dist);

	vec3 col = mix(uPrimary, uAccent, n);
	col = mix(col, uPrimaryDark, pulse * 0.4);

	float envelope = smoothstep(0.0, 0.18, uScroll) * (1.0 - smoothstep(0.8, 1.0, uScroll));

	gl_FragColor = vec4(col, d * 0.4 * envelope);
}
