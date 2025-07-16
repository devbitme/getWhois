<script lang="ts">
	import { getInfosRDAP } from "../lib/services";
	import { rdapData } from "../stores/whoisStore";
	import { isValidDomain } from "../lib/utils";
	import { JsonView } from "@zerodevx/svelte-json-view";

	let { domain } = $props<{ domain: string }>();
	let loading = $state<boolean>(false);

	$effect(() => {
		if (domain && isValidDomain(domain)) {
			loading = true;
			getInfosRDAP(domain)
				.then((data) => {
					if (data) {
						$rdapData = data;
					} else {
						$rdapData = {};
					}
					loading = false;
				})
				.catch((error) => {
					$rdapData = {};
					loading = false;
				});
		} else {
			$rdapData = {};
			loading = false;
		}
	});
</script>

<div class="wrap">
	{#if $rdapData && Object.keys($rdapData).length > 0}
		<JsonView json={$rdapData} />
	{:else}
		<div>{@html loading ? "Loading data..." : `No RDAP data available...<br />Check the <a class="cursor-pointer transition-colors text-pink-600 hover:text-pink-800" href="https://deployment.rdap.org/" target="_blank">deployment dashboard</a>, perhaps your domain name is not yet supported...`}</div>
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
