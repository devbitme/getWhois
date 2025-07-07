<script lang="ts">
	import { onMount } from "svelte";
	import { currentDomain } from "../../stores/whoisStore";
	import { getCurrentTabDomain } from "../../lib/utils";

	// Appeler la fonction au chargement de la page
	onMount(async () => {	
		const domain = await getCurrentTabDomain();
		currentDomain.set(domain);

		const url = browser.runtime.getURL(`/get-whois.html?domain=${domain}`);	
		window.open(url, "_blank");
	});
</script>