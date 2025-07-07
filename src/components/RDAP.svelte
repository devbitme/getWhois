<script lang="ts">
	import { getInfosRDAP } from "../lib/services";
	import { rdapData } from "../stores/whoisStore";

	interface RDAPData {
		[server: string]: {
			[key: string]: string | string[] | number | boolean | null;
		};
	}

	let { domain } = $props<{ domain: string }>();

	let rdap = $state<RDAPData | null>(null);

	// Subscribe to the store
	$effect(() => {
		const unsubscribe = rdapData.subscribe((value) => {
			rdap = value;
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

	function openJsonInNewTab(data: RDAPData) {
		window.open("newTab.html?type=whois", "_blank");
	}
</script>

{#if rdap}
	<button
		onclick={() => openJsonInNewTab(rdap as RDAPData)}
		class="font-inherit mb-2 cursor-pointer border-none bg-transparent p-0 text-blue-500 underline"
	>
		Voir JSON
	</button>
{:else}
	<div>Loading...</div>
{/if}
