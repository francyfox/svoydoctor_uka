<script lang="ts">
	import type { Attachment } from 'svelte/attachments';
	import { env } from '$env/dynamic/public';

	// Window.hcaptcha is declared in src/app.d.ts (ambient declarations can't live inside
	// a component's script block).

	let { token = $bindable<string | undefined>(undefined) }: { token?: string } = $props();

	// Not $env/static/public: that form hard-fails the build if the key is entirely unset.
	const siteKey = env.PUBLIC_HCAPTCHA_SITE_KEY;

	function loadScript(): Promise<void> {
		if (window.hcaptcha) return Promise.resolve();
		if (document.querySelector('script[data-hcaptcha]')) {
			return new Promise((resolve) => {
				const prev = window.__hcaptchaOnLoad;
				window.__hcaptchaOnLoad = () => {
					prev?.();
					resolve();
				};
			});
		}
		// hCaptcha initializes asynchronously after the script itself finishes downloading —
		// the <script>.onload event fires too early. hCaptcha's own onload query-param callback
		// is the documented way to know the API is actually ready to render.
		return new Promise((resolve) => {
			window.__hcaptchaOnLoad = () => resolve();
			const script = document.createElement('script');
			script.src = 'https://js.hcaptcha.com/1/api.js?onload=__hcaptchaOnLoad&render=explicit';
			script.dataset.hcaptcha = 'true';
			script.async = true;
			document.head.appendChild(script);
		});
	}

	const renderWidget: Attachment = (node) => {
		if (!siteKey) return;
		let widgetId: string | undefined;
		loadScript().then(() => {
			widgetId = window.hcaptcha?.render(node as HTMLElement, {
				sitekey: siteKey,
				callback: (value) => {
					token = value;
				}
			});
		});
		return () => {
			if (widgetId) window.hcaptcha?.remove(widgetId);
		};
	};
</script>

{#if siteKey}
	<div {@attach renderWidget}></div>
{/if}
