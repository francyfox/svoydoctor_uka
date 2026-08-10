precision mediump float;

varying vec2 vUv;

uniform float uTime;
uniform float uScroll;
uniform vec2 uResolution;
uniform vec3 uAccent;
uniform vec3 uPrimary;
uniform vec3 uPrimaryDark;

/*
 * Три сцены — "Аура бренда", "Структурированный поток", "Взаимодействие микро-клеток"
 * (см. docs/moodboard.md, референс присланных пользователем визуалов). Смешиваются
 * между собой по uScroll (0..1, прогресс страницы) — один compiled-program, без
 * пересборки шейдера на каждую секцию. Каждая сцена дешёвая (без fbm/октав шума) —
 * рассчитана на постоянный рендер в sticky-шапке на мобильных.
 */

vec4 sceneAura(vec2 uv, float t) {
	vec2 p = uv - 0.5;
	p.x *= uResolution.x / uResolution.y;
	float r = length(p);
	float rings = sin(r * 26.0 - t * 1.1) * 0.5 + 0.5;
	float glow = 1.0 - smoothstep(0.0, 0.85, r);
	vec3 col = mix(uPrimaryDark, uAccent, rings);
	return vec4(col, glow * 0.85);
}

vec4 sceneFlow(vec2 uv, float t) {
	float warp = sin(uv.y * 5.0 + t * 0.5) * 0.18;
	float band = sin((uv.x + warp) * 9.0 - t * 1.3);
	float edge = smoothstep(0.1, 1.0, band);
	vec3 col = mix(uPrimary, uAccent, edge);
	return vec4(col, edge * 0.45 + 0.1);
}

float metaball(vec2 uv, vec2 center, float r) {
	return r / max(length(uv - center), 0.001);
}

vec4 sceneCells(vec2 uv, float t) {
	float sum = 0.0;
	for (int i = 0; i < 5; i++) {
		float fi = float(i);
		vec2 c = vec2(0.5) + 0.36 * vec2(cos(t * 0.22 + fi * 2.4), sin(t * 0.27 + fi * 1.7));
		sum += metaball(uv, c, 0.05);
	}
	float m = smoothstep(0.85, 1.35, sum);
	vec3 col = mix(uAccent, uPrimaryDark, uv.y);
	return vec4(col, m * 0.6);
}

void main() {
	vec2 uv = vUv;
	float s = clamp(uScroll, 0.0, 1.0);

	vec4 aura = sceneAura(uv, uTime);
	vec4 flow = sceneFlow(uv, uTime);
	vec4 cells = sceneCells(uv, uTime);

	float mixAB = smoothstep(0.0, 0.55, s);
	float mixBC = smoothstep(0.45, 1.0, s);

	vec4 col = mix(mix(aura, flow, mixAB), cells, mixBC);

	gl_FragColor = vec4(col.rgb, col.a);
}
