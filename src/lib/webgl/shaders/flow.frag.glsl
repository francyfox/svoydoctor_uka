precision mediump float;

varying vec2 vUv;

uniform float uTime;
uniform float uScroll;
uniform vec3 uAccent;
uniform vec3 uPrimary;

/* "Структурированный поток" — services: тёплые изогнутые полосы-русла. */

void main() {
	float t = uTime + uScroll * 2.0;

	float warp = sin(vUv.y * 5.0 + t * 0.5) * 0.18;
	float band = sin((vUv.x + warp) * 9.0 - t * 1.3);
	float edge = smoothstep(0.1, 1.0, band);

	vec3 col = mix(uPrimary, uAccent, edge);

	float envelope = smoothstep(0.0, 0.18, uScroll) * (1.0 - smoothstep(0.8, 1.0, uScroll));

	gl_FragColor = vec4(col, (edge * 0.3 + 0.05) * envelope);
}
