/**
 * Minimal WebGL1 fullscreen-quad helpers — no dependency, kept tiny on purpose
 * (this renders continuously behind a sticky header, perf on mobile matters more
 * than a library's convenience API).
 */

export function compileShader(gl: WebGLRenderingContext, type: number, source: string): WebGLShader {
	const shader = gl.createShader(type);
	if (!shader) throw new Error('Failed to create shader');

	gl.shaderSource(shader, source);
	gl.compileShader(shader);

	if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
		const info = gl.getShaderInfoLog(shader);
		gl.deleteShader(shader);
		throw new Error(`Shader compile error: ${info}`);
	}

	return shader;
}

export function createProgram(
	gl: WebGLRenderingContext,
	vertexSource: string,
	fragmentSource: string
): WebGLProgram {
	const vertexShader = compileShader(gl, gl.VERTEX_SHADER, vertexSource);
	const fragmentShader = compileShader(gl, gl.FRAGMENT_SHADER, fragmentSource);

	const program = gl.createProgram();
	if (!program) throw new Error('Failed to create program');

	gl.attachShader(program, vertexShader);
	gl.attachShader(program, fragmentShader);
	gl.linkProgram(program);

	// Shaders are only needed at link time; detach/delete once linked.
	gl.deleteShader(vertexShader);
	gl.deleteShader(fragmentShader);

	if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
		const info = gl.getProgramInfoLog(program);
		gl.deleteProgram(program);
		throw new Error(`Program link error: ${info}`);
	}

	return program;
}

/** Binds a full-viewport triangle-strip quad (clip-space -1..1) to `aPosition`. */
export function createFullscreenQuad(gl: WebGLRenderingContext, program: WebGLProgram): WebGLBuffer {
	const buffer = gl.createBuffer();
	if (!buffer) throw new Error('Failed to create buffer');

	gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
	gl.bufferData(
		gl.ARRAY_BUFFER,
		new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]),
		gl.STATIC_DRAW
	);

	const location = gl.getAttribLocation(program, 'aPosition');
	gl.enableVertexAttribArray(location);
	gl.vertexAttribPointer(location, 2, gl.FLOAT, false, 0, 0);

	return buffer;
}

/** Reads a `--color-*` CSS custom property and parses it to a 0..1 RGB triple. */
export function readCssColor(el: Element, varName: string): [number, number, number] {
	const raw = getComputedStyle(el).getPropertyValue(varName).trim();
	const hex = raw.replace('#', '');
	if (hex.length !== 6) return [1, 1, 1];

	const r = parseInt(hex.slice(0, 2), 16) / 255;
	const g = parseInt(hex.slice(2, 4), 16) / 255;
	const b = parseInt(hex.slice(4, 6), 16) / 255;
	return [r, g, b];
}
