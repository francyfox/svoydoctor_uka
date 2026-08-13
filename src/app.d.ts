// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		// interface Locals {}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}

	interface Window {
		hcaptcha?: {
			render: (
				container: HTMLElement,
				options: { sitekey: string; callback: (token: string) => void }
			) => string;
			remove: (widgetId: string) => void;
		};
		__hcaptchaOnLoad?: () => void;
	}
}

export {};
