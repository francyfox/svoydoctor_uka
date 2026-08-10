precision mediump float;

varying vec2 vUv;

uniform float uTime;
uniform float uScroll;
uniform vec3 uAccent;
uniform vec3 uPrimary;
uniform vec3 uPrimaryDark;

/* "Баланс спектра" — contacts: две мягкие волнистые полосы спектра. */

void main() {
	float t = uTime * 0.5 + uScroll * 2.0;

	float band1 = sin((vUv.y + sin(vUv.x * 3.0 + t) * 0.05) * 14.0 - t * 1.4);
	float band2 = sin((vUv.y + 0.15 + sin(vUv.x * 3.0 + t * 0.8) * 0.05) * 14.0 - t * 1.1);

	float edge1 = smoothstep(0.3, 1.0, band1);
	float edge2 = smoothstep(0.3, 1.0, band2);

	vec3 col = mix(uPrimary, uAccent, edge1);
	col = mix(col, uPrimaryDark, edge2 * 0.5);

	float envelope = smoothstep(0.0, 0.18, uScroll) * (1.0 - smoothstep(0.8, 1.0, uScroll));

	gl_FragColor = vec4(col, (edge1 * 0.25 + edge2 * 0.2) * envelope);
}
