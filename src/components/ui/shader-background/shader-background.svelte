<script lang="ts">
	import type { Attachment } from 'svelte/attachments';
	import { cn } from '$lib/utils.js';
	import { createFullscreenQuad, createProgram, readCssColor } from '$lib/webgl/gl';
	import vertexSource from '$lib/webgl/shaders/quad.vert.glsl?raw';

	let {
		class: className,
		fragment,
		mode = 'local'
	}: {
		class?: string;
		/** Raw GLSL fragment shader source (import with `?raw`). */
		fragment: string;
		/**
		 * `page` — uScroll is the whole page's scroll progress (0..1), for a persistent
		 * element like the sticky header. `local` (default) — uScroll is how far this
		 * element itself has scrolled through the viewport (0 entering, 1 leaving), used
		 * to fade a section's background in/out as it comes into view.
		 */
		mode?: 'page' | 'local';
	} = $props();

	// Внутреннее разрешение рендера меньше, чем размер на экране — картинка мягкая
	// и абстрактная по дизайну, а дешевле в разы на мобильных GPU.
	const RESOLUTION_SCALE = 0.55;
	const MAX_DPR = 1.5;
	const TARGET_FRAME_MS = 1000 / 30;

	function runShader(): Attachment<HTMLCanvasElement> {
		return (canvas) => {
			const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

			const gl = canvas.getContext('webgl', {
				alpha: true,
				antialias: false,
				depth: false,
				stencil: false,
				powerPreference: 'low-power'
			}) as WebGLRenderingContext | null;
			if (!gl) return;

			// Контекст создаётся один раз и живёт всё время, пока канвас смонтирован —
			// частое create/destroy WebGL-контекста (например через IntersectionObserver
			// на каждой секции) быстро упирается в лимит браузера на число живых
			// контекстов и роняет их ("WebGL context was lost"). Видимость управляет
			// только тем, крутится ли rAF-цикл ниже, не жизненным циклом контекста.
			let program: WebGLProgram | undefined;
			let uTime: WebGLUniformLocation | null = null;
			let uScroll: WebGLUniformLocation | null = null;
			let uResolution: WebGLUniformLocation | null = null;

			function setup() {
				program = createProgram(gl!, vertexSource, fragment);
				gl!.useProgram(program);
				createFullscreenQuad(gl!, program);

				gl!.enable(gl!.BLEND);
				gl!.blendFunc(gl!.SRC_ALPHA, gl!.ONE_MINUS_SRC_ALPHA);

				uTime = gl!.getUniformLocation(program, 'uTime');
				uScroll = gl!.getUniformLocation(program, 'uScroll');
				uResolution = gl!.getUniformLocation(program, 'uResolution');
				const uAccent = gl!.getUniformLocation(program, 'uAccent');
				const uPrimary = gl!.getUniformLocation(program, 'uPrimary');
				const uPrimaryDark = gl!.getUniformLocation(program, 'uPrimaryDark');
				const uSuccess = gl!.getUniformLocation(program, 'uSuccess');

				// Неиспользуемые в конкретном шейдере юниформы дают location:null —
				// присвоение им значения по WebGL-спеке молча игнорируется.
				gl!.uniform3fv(uAccent, readCssColor(canvas, '--color-brand-accent'));
				gl!.uniform3fv(uPrimary, readCssColor(canvas, '--color-brand-primary'));
				gl!.uniform3fv(uPrimaryDark, readCssColor(canvas, '--color-brand-primary-dark'));
				gl!.uniform3fv(uSuccess, readCssColor(canvas, '--color-success'));

				resize();
			}

			function resize() {
				if (!program) return;
				const rect = canvas.getBoundingClientRect();
				const dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR);
				const width = Math.max(1, Math.round(rect.width * dpr * RESOLUTION_SCALE));
				const height = Math.max(1, Math.round(rect.height * dpr * RESOLUTION_SCALE));
				canvas.width = width;
				canvas.height = height;
				gl!.viewport(0, 0, width, height);
				gl!.uniform2f(uResolution, width, height);
			}

			try {
				setup();
			} catch {
				return;
			}

			const resizeObserver = new ResizeObserver(resize);
			resizeObserver.observe(canvas);

			// uScroll: прогресс скролла по всей странице (mode="page") либо прогресс
			// прохождения самого элемента через вьюпорт (mode="local", 0..1).
			let scrollProgress = 0;
			let scrollScheduled = false;

			function readScroll() {
				if (mode === 'page') {
					const max = document.documentElement.scrollHeight - window.innerHeight;
					scrollProgress = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
				} else {
					const rect = canvas.getBoundingClientRect();
					const vh = window.innerHeight;
					const denom = vh + rect.height;
					scrollProgress = denom > 0 ? Math.min(1, Math.max(0, (vh - rect.top) / denom)) : 0;
				}
				scrollScheduled = false;
			}

			function renderStatic() {
				if (!program) return;
				gl!.uniform1f(uTime, 0);
				gl!.uniform1f(uScroll, scrollProgress);
				gl!.clear(gl!.COLOR_BUFFER_BIT);
				gl!.drawArrays(gl!.TRIANGLE_STRIP, 0, 4);
			}

			function onScroll() {
				if (scrollScheduled) return;
				scrollScheduled = true;
				requestAnimationFrame(() => {
					readScroll();
					// prefers-reduced-motion: без rAF-цикла, но локальный uScroll (появление
					// секции во вьюпорте) всё равно должен обновлять статичный кадр.
					if (reducedMotion) renderStatic();
				});
			}

			readScroll();
			window.addEventListener('scroll', onScroll, { passive: true });
			window.addEventListener('resize', onScroll, { passive: true });

			// Пауза rAF-цикла (не самого контекста) вне вьюпорта — дёшево, не роняет контекст.
			let visible = mode === 'page';
			const intersectionObserver = new IntersectionObserver(
				(entries) => {
					visible = entries.some((entry) => entry.isIntersecting);
				},
				{ rootMargin: '40% 0px' }
			);
			intersectionObserver.observe(canvas);

			function onContextLost(event: Event) {
				event.preventDefault();
				program = undefined;
			}

			function onContextRestored() {
				try {
					setup();
				} catch {
					// оставляем program === undefined — draw()/renderStatic() станут no-op
				}
			}

			canvas.addEventListener('webglcontextlost', onContextLost);
			canvas.addEventListener('webglcontextrestored', onContextRestored);

			let rafId = 0;
			let lastFrameTime = 0;
			const start = performance.now();

			function draw(time: number) {
				if (document.hidden || !visible || !program) {
					rafId = requestAnimationFrame(draw);
					return;
				}
				if (time - lastFrameTime < TARGET_FRAME_MS) {
					rafId = requestAnimationFrame(draw);
					return;
				}
				lastFrameTime = time;

				gl!.uniform1f(uTime, (time - start) / 1000);
				gl!.uniform1f(uScroll, scrollProgress);
				gl!.clear(gl!.COLOR_BUFFER_BIT);
				gl!.drawArrays(gl!.TRIANGLE_STRIP, 0, 4);

				rafId = requestAnimationFrame(draw);
			}

			if (reducedMotion) {
				renderStatic();
			} else {
				rafId = requestAnimationFrame(draw);
			}

			return () => {
				cancelAnimationFrame(rafId);
				window.removeEventListener('scroll', onScroll);
				window.removeEventListener('resize', onScroll);
				canvas.removeEventListener('webglcontextlost', onContextLost);
				canvas.removeEventListener('webglcontextrestored', onContextRestored);
				resizeObserver.disconnect();
				intersectionObserver.disconnect();
				gl.getExtension('WEBGL_lose_context')?.loseContext();
			};
		};
	}
</script>

<canvas
	{@attach runShader()}
	aria-hidden="true"
	class={cn('pointer-events-none block h-full w-full', className)}
></canvas>
