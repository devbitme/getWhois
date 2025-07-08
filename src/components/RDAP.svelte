<script lang="ts">
	import { getInfosRDAP } from "../lib/services";
	import { rdapData } from "../stores/whoisStore";
	import { JsonView } from "@zerodevx/svelte-json-view";

	interface RDAPData {
		[server: string]: {
			[key: string]: string | string[] | number | boolean | null;
		};
	}

	let { domain } = $props<{ domain: string }>();

	let json = $state<RDAPData | null>(null);

	// Subscribe to the store
	$effect(() => {
		const unsubscribe = rdapData.subscribe((value) => {
			json = value;
		});
		return unsubscribe;
	});

	// Load RDAP data when component mounts or domain changes
	$effect(() => {
		if (domain) {
			getInfosRDAP(domain)
				.then((data) => {
					// store data in the store
					rdapData.set(data);
				})
				.catch((error) => {
					console.error("Error fetching RDAP data:", error);
					rdapData.set(null);
				});
		}
	});
</script>

<div class="wrap">
	{#if json}
		<JsonView {json} />
	{:else}
		<div>No RDAP data available...</div>
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
