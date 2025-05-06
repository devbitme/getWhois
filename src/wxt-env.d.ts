/// <reference types="wxt/client" />
/// <reference types="wxt/sandbox" />

declare global {
	interface Window {
		chrome: typeof chrome;
	}
}
