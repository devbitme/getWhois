<script lang="ts">
	import { getInfosWhois } from "../lib/services";
	import { whoisData } from "../stores/whoisStore";
	import { isValidDomain } from "../lib/utils";
	import { JsonView } from "@zerodevx/svelte-json-view";

	let { domain } = $props<{ domain: string }>();
	let loading = $state<boolean>(false);

	$effect(() => {
		if (domain && isValidDomain(domain)) {
			loading = true;
			getInfosWhois(domain)
				.then((data) => {
					if (data) {
						$whoisData = data;
					} else {
						$whoisData = {};
					}
					loading = false;
				})
				.catch((error) => {
					$whoisData = {};
					loading = false;
				});
		} else {
			$whoisData = {};
			loading = false;
		}
	});
</script>

<div class="wrap">
	{#if $whoisData && Object.keys($whoisData).length > 0}
		<JsonView json={$whoisData} />
	{:else}
		<div>{loading ? "Loading data..." : "No WHOIS data available..."}</div>
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
