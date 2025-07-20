<script lang="ts">
	import { onMount } from "svelte";
	import { Tabs } from "melt/builders";
	import Whois from "~/components/Whois.svelte";
	import RDAP from "~/components/RDAP.svelte";
	import { downloadData, loadStoredData, copyData } from "~/stores/whoisStore";

	const tabIds = ["WHOIS", "RDAP"];

	let domain: string | null = $state("No domain provided...");
	let currentRecordType = $state(tabIds[0]);
	let isCopied = $state(false);

	const tabs = new Tabs({
		value: tabIds[0],
		selectWhenFocused: true,
		orientation: "horizontal",
		loop: true,
		onValueChange: (newValue) => {
			currentRecordType = newValue;
			// Reset copy state when switching tabs
			isCopied = false;
		}
	});

	onMount(() => {
		const urlParams = new URLSearchParams(window.location.search);
		if (urlParams.get("domain")) {
			domain = urlParams.get("domain");
		}

		// Load stored data from localStorage
		loadStoredData();

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

	// Function to handle download
	function handleDownload() {
		if (domain) {
			downloadData(currentRecordType, domain);
		}
	}

	// Function to handle copy
	async function handleCopy() {
		if (domain) {
			const success = await copyData(currentRecordType);
			if (success) {
				isCopied = true;
				setTimeout(() => {
					isCopied = false;
				}, 3000);
			} else {
				console.error('Failed to copy data');
			}
		}
	}
</script>

<main class="container mx-auto min-h-screen p-4">
	<h1 class="sr-only">Get Whois</h1>

	<div class="text-center text-xl text-pink-800 select-none">°˖✧◝(⁰▿⁰)◜✧˖°</div>

	<nav class="mt-4 flex justify-center gap-4 p-2">
		<section
			id="nav-whois"
			{...tabs.triggerList}
			class="relative flex min-w-fit cursor-pointer rounded bg-pink-100 ring-1 ring-pink-800 ring-offset-2"
		>
			<div
				class="absolute inset-y-0 left-0 w-1/2 rounded bg-pink-800 transition-transform duration-300 ease-in-out {currentRecordType ===
				'RDAP'
					? 'translate-x-full'
					: 'translate-x-0'}"
			></div>

			{#each tabIds as id}
				<button
					{...tabs.getTrigger(id)}
					class="relative z-10 min-w-16 flex-1 cursor-pointer px-2 py-1 text-center text-xs text-pink-800 transition-colors first:rounded-l last:rounded-r hover:bg-transparent focus:outline-0 aria-selected:text-pink-100"
				>
					{id}
				</button>
			{/each}
		</section>
	</nav>
	<div class="tools mb-4 flex justify-start gap-4 border-b-1 border-pink-800 p-2">
		<button class="flex cursor-pointer transition-colors text-pink-600 hover:text-pink-800" onclick={handleCopy} aria-label="Copy data">
			<svg
				class="size-6 stroke-pink-800"
				stroke-width="1.5"
				viewBox="0 0 24 24"
				fill="none"
				xmlns="http://www.w3.org/2000/svg"
				color="#000000"
				><path
					d="M19.4 20H9.6C9.26863 20 9 19.7314 9 19.4V9.6C9 9.26863 9.26863 9 9.6 9H19.4C19.7314 9 20 9.26863 20 9.6V19.4C20 19.7314 19.7314 20 19.4 20Z"
					stroke-width="1.5"
					stroke-linecap="round"
					stroke-linejoin="round"
				></path><path
					d="M15 9V4.6C15 4.26863 14.7314 4 14.4 4H4.6C4.26863 4 4 4.26863 4 4.6V14.4C4 14.7314 4.26863 15 4.6 15H9"
					stroke-width="1.5"
					stroke-linecap="round"
					stroke-linejoin="round"
				></path>
			</svg> {isCopied ? 'copied!' : 'copy'}
		</button>
		<button class="flex cursor-pointer transition-colors text-pink-600 hover:text-pink-800" onclick={handleDownload} aria-label="Download data">
			<svg
				class="size-6 stroke-pink-800"
				stroke-width="1.5"
				viewBox="0 0 24 24"
				fill="none"
				xmlns="http://www.w3.org/2000/svg"
				color="#000000"
				><path d="M6 20L18 20" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path><path
					d="M12 4V16M12 16L15.5 12.5M12 16L8.5 12.5"
					stroke-width="1.5"
					stroke-linecap="round"
					stroke-linejoin="round"
				></path>
			</svg> download
		</button>
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

<footer class="sticky bottom-2 flex justify-end gap-1 px-4 text-[.6rem] text-pink-700 select-none">
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
			title="Releases">1.0.3</a
		>
	</div>
</footer>
