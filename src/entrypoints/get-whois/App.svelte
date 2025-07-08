<script lang="ts">
	import { onMount } from "svelte";
	import { Tabs } from "melt/builders";
	import Whois from "~/components/Whois.svelte";
	import RDAP from "~/components/RDAP.svelte";

	const tabIds = ["WHOIS", "RDAP"];

	let domain: string | null = $state("No domain provided...");
	let currentRecordType = $state(tabIds[0]);

	const tabs = new Tabs({
		value: tabIds[0],
		selectWhenFocused: true,
		orientation: "horizontal",
		loop: true,
		onValueChange: (newValue) => {
			currentRecordType = newValue;
		}
	});

	onMount(() => {
		const urlParams = new URLSearchParams(window.location.search);
		if (urlParams.get("domain")) {
			domain = urlParams.get("domain");
		}

		// Fetch initial DNS record (A record)
		currentRecordType = tabIds[0];

		// Focus first button of nav-whois before fetching Whois info
		const firstButton: HTMLElement | null = document.querySelector("#nav-whois button");
		if (firstButton) {
			firstButton.focus();
			setTimeout(() => {
				firstButton.focus();
			}, 600);
		}
	});
</script>

<main class="container mx-auto min-h-screen p-4">
	<h1 class="sr-only">Get Whois</h1>

	<div class="text-center text-xl text-red-800 select-none">°˖✧◝(⁰▿⁰)◜✧˖°</div>

	<nav class="flex justify-center gap-4 p-2 mt-4">
		<section id="nav-whois" {...tabs.triggerList} class="rounded bg-red-100 ring-1 ring-red-800 ring-offset-2 cursor-pointer">
			{#each tabIds as id}
				<button
					{...tabs.getTrigger(id)}
					class="cursor-pointer px-1 py-0 text-red-800 transition-colors first:rounded-l last:rounded-r hover:bg-red-200 focus:outline-0 aria-selected:bg-red-800 aria-selected:text-red-100"
				>
					{id}
				</button>
			{/each}
		</section>
	</nav>
	<div class="tools mb-4 flex justify-center gap-4 border-b-2 border-red-800 p-2">
		<button class="cursor-pointer">Copy to Clipboard</button>
		<button>Download</button>
	</div>
	<div class="content max-h-min flex-1 overflow-y-auto">
		{#each tabIds as id}
			<div {...tabs.getContent(id)} class="flex flex-col gap-4">
				{#if id === "WHOIS"}
					<h2 class="text-xl font-bold">WHOIS Information for {domain}</h2>
					<Whois domain={domain || ""} />
				{:else if id === "RDAP"}
					<h2 class="text-xl font-bold">RDAP Information for {domain}</h2>
					<RDAP domain={domain || ""} />
				{/if}
			</div>
		{/each}
	</div>
</main>

<footer class="sticky bottom-2 flex justify-end gap-1 px-4 text-[.6rem] text-red-700 select-none">
	<a
		class="transition-opacity hover:opacity-75 focus:outline-0"
		href="https://devbit.me"
		title="devbit.me"
		target="_blank"
		rel="noopener noreferrer"
	>
		<img src="devbitme.png" alt="logo devbitme" />
	</a>
	<div>
		getWhois <a
			class="font-bold transition-opacity hover:opacity-75 focus:outline-0"
			href="https://github.com/devbitme/getWhois/releases"
			target="_blank"
			rel="noopener noreferrer"
			title="Releases">1.0.0</a
		>
	</div>
</footer>
