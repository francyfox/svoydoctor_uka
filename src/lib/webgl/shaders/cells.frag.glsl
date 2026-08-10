precision mediump float;

varying vec2 vUv;

uniform float uTime;
uniform float uScroll;
uniform vec2 uResolution;
uniform vec3 uAccent;
uniform vec3 uPrimaryDark;
uniform vec3 uSuccess;

/* "Взаимодействие микро-клеток" — symptoms: дрейфующие метаболы, зелёный акцент. */

float metaball(vec2 uv, vec2 center, float r) {
	return r / max(length(uv - center), 0.001);
}

void main() {
	vec2 uv = vUv;
	float aspect = uResolution.x / uResolution.y;
	uv.x *= aspect;
	float t = uTime + uScroll * 2.0;

	float sum = 0.0;
	for (int i = 0; i < 5; i++) {
		float fi = float(i);
		vec2 c = vec2(0.5 * aspect, 0.5) + 0.35 * vec2(cos(t * 0.22 + fi * 2.4), sin(t * 0.27 + fi * 1.7));
		sum += metaball(uv, c, 0.045);
	}
	float m = smoothstep(0.85, 1.35, sum);

	vec3 col = mix(uAccent, uPrimaryDark, vUv.y);
	col = mix(col, uSuccess, 0.35);

	float envelope = smoothstep(0.0, 0.18, uScroll) * (1.0 - smoothstep(0.8, 1.0, uScroll));

	gl_FragColor = vec4(col, m * 0.4 * envelope);
}
