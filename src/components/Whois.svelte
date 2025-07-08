<script lang="ts">
	import { getInfosWhois } from "../lib/services";
	import { whoisData } from "../stores/whoisStore";
	import { JsonView } from "@zerodevx/svelte-json-view";

	interface WhoisData {
		[server: string]: {
			[key: string]: string | string[] | number | boolean | null;
		};
	}

	let { domain } = $props<{ domain: string }>();

	let json = $state<WhoisData | null>(null);

	// Subscribe to the store
	$effect(() => {
		const unsubscribe = whoisData.subscribe((value) => {
			json = value;
		});
		return unsubscribe;
	});

	// Load WHOIS data when component mounts or domain changes
	$effect(() => {
		if (domain) {
			getInfosWhois(domain)
				.then((data) => {
					// store data in the store
					whoisData.set(data);
				})
				.catch((error) => {
					console.log("Error fetching WHOIS data:", error);
				});
		}
	});
</script>

<div class="wrap">
	{#if json}
		<JsonView {json} />
	{:else}
		<div>No WHOIS data available...</div>
	{/if}
</div>

<style>
	/* https://www.npmjs.com/package/@zerodevx/svelte-json-view */
	.wrap {
		font-family: Consolas, monospace;
		font-size: .8rem;
		--jsonPaddingLeft: 2rem;
		/* --jsonSeparatorColor: #0074e8; */
		--jsonValColor: #5c5c5f;
		--jsonValStringColor: #dd00a9;
		--jsonKeyColor: #0074e8;
		--jsonValNumberColor: #058b00;
		--jsonValBooleanColor: #058b00;
	}
</style>
