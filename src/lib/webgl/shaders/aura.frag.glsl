precision mediump float;

varying vec2 vUv;

uniform float uTime;
uniform float uScroll;
uniform vec2 uResolution;
uniform vec3 uAccent;
uniform vec3 uPrimaryDark;

/* "Аура бренда" — hero: дышащие концентрические кольца вокруг центра. */

void main() {
	vec2 p = vUv - 0.5;
	p.x *= uResolution.x / uResolution.y;
	float r = length(p);
	float t = uTime + uScroll * 2.0;

	float rings = sin(r * 24.0 - t * 1.1) * 0.5 + 0.5;
	float glow = 1.0 - smoothstep(0.0, 0.9, r);

	vec3 col = mix(uPrimaryDark, uAccent, rings);

	// Плавное появление/исчезновение по мере входа/выхода секции из вьюпорта.
	float envelope = smoothstep(0.0, 0.18, uScroll) * (1.0 - smoothstep(0.8, 1.0, uScroll));

	gl_FragColor = vec4(col, glow * 0.5 * envelope);
}
