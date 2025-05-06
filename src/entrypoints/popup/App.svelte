<script lang="ts">
	import { onMount } from "svelte";
	import { currentDomain } from "../../stores/whoisStore";

	let result: any = null;
	let error: string | null = null;

	// Loading state tracking
	let loading = {
		whois: true
	};

	const extractDomain = (url: string): string => {
		try {
			const domain = new URL(url).hostname;
			// Supprimer www. si présent
			return domain.replace(/^www\./, "");
		} catch (e) {
			return "";
		}
	};

	const getCurrentTabDomain = async (): Promise<string> => {
		try {
			const [tab] = await browser.tabs.query({
				active: true,
				currentWindow: true
			});
			if (tab?.url) {
				return extractDomain(tab.url);
			}
			return "";
		} catch (e) {
			console.error("Erreur lors de la récupération de l'onglet actif:", e);
			return "";
		}
	};

	const getInfosWhois = async (domain: string): Promise<any> => {
		const response = await fetch(`https://www.rdap.net/domain/${domain}`, {
			method: "GET",
			headers: {
				"Content-Type": "application/json"
			}
		});

		if (!response.ok) {
			throw new Error("Erreur lors de la récupération des informations WHOIS");
		}

		// fetch response.url to get json
		const url = response.url;

		const whois = await fetch(url, {
			method: "GET",
			headers: {
				"Content-Type": "application/json"
			}
		});

		if (!whois.ok) {
			throw new Error("Erreur lors de la récupération des informations WHOIS");
		}

		console.log(whois);
	};

	// Appeler la fonction au chargement de la page
	onMount(async () => {
		const domain = await getCurrentTabDomain();
		currentDomain.set(domain);

		try {
			loading.whois = true;
			if (!$currentDomain) {
				error = "Impossible de récupérer le domaine de l'onglet actif";
				return;
			}
			result = await getInfosWhois($currentDomain);
			if (result.error) {
				error = result.error;
			}
		} catch (e) {
			error = (e as Error).message;
		} finally {
			loading.whois = false;
		}
	});
</script>

<main class="relative flex h-96 w-[520px] flex-col p-4 pb-6 text-[.8rem] select-none">
	<section class="header">
		<h1 class="sr-only">Get Whois</h1>

		<div class="text-center text-xl text-red-800 select-none">°˖✧◝(⁰▿⁰)◜✧˖°</div>

		<h2 class="my-2 text-center font-bold">{$currentDomain}</h2>
	</section>

	<section class="content max-h-min flex-1 overflow-y-auto select-text">
		{#if loading.whois}
			<div class="my-1">
				<span class="text-gray-500">Loading...</span>
			</div>
		{:else}
			<!-- <pre>{JSON.stringify(result, null, 2)}</pre> -->

			<h3 class="my-2 text-xl font-bold select-none">Domain Information :</h3>
			<ul>
				<li>
					<strong>Domain Name :</strong>
				</li>
				<li>
					<strong>Status :</strong>
				</li>
				<li>
					<strong>Creation Date :</strong>
				</li>
				<li>
					<strong>Expiration Date :</strong>
				</li>
				<li>
					<strong>Last Updated :</strong>
				</li>
			</ul>
			<h3 class="my-2 text-xl font-bold select-none">Registrar Information :</h3>

			<ul>
				<li>
					<strong>Name :</strong>
				</li>
				<li>
					<strong>URL :</strong>
				</li>
				<li>
					<strong>Registrar ID :</strong>
				</li>
				<li>
					<strong>WHOIS Server :</strong>
				</li>
			</ul>

			<h3 class="my-2 text-xl font-bold select-none">Domain Owner Information :</h3>
			<ul>
				<li>
					<strong>Name :</strong>
				</li>
				<li>
					<strong>Organization :</strong>
				</li>
				<li>
					<strong>Address :</strong>
				</li>
				<li>
					<strong>Postal Code :</strong>
				</li>
				<li>
					<strong>Phone :</strong>
				</li>
				<li>
					<strong>Email :</strong>
				</li>
			</ul>

			<h3 class="my-2 text-xl font-bold select-none">DNS Servers :</h3>
			<ul>
				<li>
					<strong>DNS Server :</strong>
				</li>
			</ul>

			<h3 class="my-2 text-xl font-bold select-none">Administrative Contact :</h3>
			<ul>
				<li>
					<strong>Name :</strong>
				</li>
				<li>
					<strong>Organization :</strong>
				</li>
				<li>
					<strong>Email :</strong>
				</li>
				<li>
					<strong>Phone :</strong>
				</li>
				<li>
					<strong>Address :</strong>
				</li>
			</ul>

			<h3 class="my-2 text-xl font-bold select-none">Technical Contact :</h3>
			<ul>
				<li>
					<strong>Name :</strong>
				</li>
				<li>
					<strong>Organization :</strong>
				</li>
				<li>
					<strong>Email :</strong>
				</li>
				<li>
					<strong>Phone :</strong>
				</li>
				<li>
					<strong>Address :</strong>
				</li>
			</ul>

			<h3 class="my-2 text-xl font-bold select-none">Domain History :</h3>
			<ul>
				<li>
					<strong>Registration Date :</strong>
				</li>
				<li>
					<strong>Expiration Date :</strong>
				</li>
				<li>
					<strong>Last Updated :</strong>
				</li>
				<li>
					<strong>Last Transfer :</strong>
				</li>
			</ul>
		{/if}
	</section>

	<div class="absolute right-4 bottom-1 flex items-center gap-1 text-[.6rem] text-red-700 select-none">
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
	</div>
</main>
