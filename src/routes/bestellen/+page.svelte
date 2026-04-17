<script>
	import { onMount, onDestroy } from 'svelte';
	import { page } from '$app/stores';
	import QrCode from 'svelte-qrcode';
	import { goto } from '$app/navigation';
	import { SNACKS } from '$lib/data/snacks.js';
	import { FRIET } from '$lib/data/friet.js';
	import { BROODJES } from '$lib/data/broodjes.js';

	// bestelcode in de url
	let bestelCode = '';
	$: bestelCode = $page.url.searchParams.get('code') || 'default';

	// qr code url, brengt naar pagina met code op die pagina
	let qrUrl = '';
	$: if (typeof window !== 'undefined') {
		qrUrl = `${window.location.origin}/bestellen?code=${bestelCode}`;
	}

	let bestellingen = [];
	let naamInput = '';
	let errorNaam = '';
	let snackInput = '';
	let frietInput = '';
	let sausInput = '';
	let broodjeBeleg = '';
	let broodjeWitOfBruin = '';
	let broodjeHardOfZacht = '';
	let broodjeVega = false;
	let geopendeBestelling = null;

	let snacks = SNACKS.map((s) => s.naam);
	let frietOpties = FRIET.map((f) => f.naam);
	let broodjesBelegOpties = [...new Set(BROODJES.map((b) => b.beleg))];

	let broodjeHardOpties = [];
	let broodjeWitOpties = [];

	const GEEN_VEGA = ['frikandel', 'kroket'];

	$: heeftVegaOptie = !!broodjeBeleg && !GEEN_VEGA.includes(broodjeBeleg);

	// reset vega als het niet mag
	$: if (!heeftVegaOptie) {
		broodjeVega = false;
	}

	// Reactive block , draait automatisch opnieuw als iets verandert
	$: {
		// Begin met alle broodjes filteren
		let filtered = BROODJES;

		// Als er een beleg gekozen is, filter alleen die broodjes
		if (broodjeBeleg) {
			filtered = filtered.filter((b) => b.beleg === broodjeBeleg);
		}

		// map , haal alle hardOfZacht waarden op
		// Set , verwijder dubbele waarden
		// ... , maak er weer een array van
		broodjeHardOpties = [...new Set(filtered.map((b) => b.hardOfZacht))];

		// Als huidige keuze niet meer in de opties zit , maak leeg
		if (broodjeBeleg && !broodjeHardOpties.includes(broodjeHardOfZacht)) {
			broodjeHardOfZacht = '';
		}

		// auto select als er maar 1 optie is ,bijvoorbeeld bij kroket  ,  alleen "zacht"
		if (broodjeHardOpties.length === 1) {
			broodjeHardOfZacht = broodjeHardOpties[0];
		}

		// filter op hard en zacht
		// Als er een keuze is , filter nog verder
		if (broodjeHardOfZacht) {
			filtered = filtered.filter((b) => b.hardOfZacht === broodjeHardOfZacht);
		}

		// wit/bruin opties kiezen
		// zelfde als hard/zacht
		broodjeWitOpties = [...new Set(filtered.map((b) => b.witOfBruin))];

		// als wit/bruin ongeldig is , resetten
		if (broodjeBeleg && !broodjeWitOpties.includes(broodjeWitOfBruin)) {
			broodjeWitOfBruin = '';
		}

		// auto select wit/bruiin
		if (broodjeWitOpties.length === 1) {
			broodjeWitOfBruin = broodjeWitOpties[0];
		}
	}

	// Haalt alle bestellingen opnieuw op van de server
	async function refresh() {
		const res = await fetch(`/api/bestel-overzicht?code=${bestelCode}`);

		// Zet response om naar JSON
		const data = await res.json();

		// Zet bestellingen in de state (fallback = lege array)
		bestellingen = data.bestellingen ?? [];
	}

	// Zoekt precies het broodje in broodjes.js op basis van de dingen gekozen in het dropdown

	function selectBroodje() {
		// Als niet alles is ingevuld , return geen broodje
		if (!broodjeBeleg || !broodjeWitOfBruin || !broodjeHardOfZacht) return null;

		// Zoek broodje dat matched met alle keuzes
		let broodjeMatch = BROODJES.find(
			(b) =>
				b.beleg === broodjeBeleg &&
				b.witOfBruin === broodjeWitOfBruin &&
				b.hardOfZacht === broodjeHardOfZacht &&
				b.vega === broodjeVega
		);

		// Return het gevonden of gemaakte broodje
		return broodjeMatch;
	}

	// bestelling toevoegen
	// async wacht tvoor server tot alles goed is dan pas zetten op UI
	async function toevoegen() {
		if (!naamInput.trim()) {
			errorNaam = 'Vul je naam in!';
			return;
		}

		// Naam is geldig , foutmelding resetten
		errorNaam = '';

		// Als niks is gekozen return
		if (!snackInput && !frietInput && !broodjeBeleg) return;

		const bestelling = {};

		if (snackInput) {
			// Zoek snack in data
			const snack = SNACKS.find((s) => s.naam === snackInput);

			// Voeg toe en saus erbij
			bestelling.snack = snack ? { ...snack, saus: sausInput || null } : null;
		}

		if (frietInput) {
			// Zoek friet in data
			const friet = FRIET.find((f) => f.naam === frietInput);

			// Voeg toe of niks
			bestelling.friet = friet ?? null;
		}

		const broodje = selectBroodje();

		if (broodje) {
			bestelling.broodje = broodje;
		}

		// sturen naar server met post
		await fetch('/api/bestel-overzicht', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },

			// body = wat je naar backend stuurt
			body: JSON.stringify({
				naam: naamInput,
				bestelling,
				code: bestelCode
			})
		});

		// alles leeg maken

		naamInput = '';
		snackInput = '';
		frietInput = '';
		sausInput = '';

		broodjeBeleg = '';
		broodjeWitOfBruin = '';
		broodjeHardOfZacht = '';
		broodjeVega = false;

		// ui refresehn
		refresh();
	}

	async function verwijderBestelling(id) {
		await fetch('/api/bestel-overzicht', {
			method: 'DELETE',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ id })
		});

		refresh();
	}

	function toggleBestelling(id) {
		// Als dezelfde open is ,sluiten
		// Anders open nieuwe
		geopendeBestelling = geopendeBestelling === id ? null : id;
	}

	//live update op pagina
	let interval;

	onMount(() => {
		refresh();

		// elke 3 seconden opnieuw
		interval = setInterval(refresh, 3000);
	});

	onDestroy(() => clearInterval(interval));

	$: totaal = bestellingen.length;

	let samenvattingFriet = {};
	let samenvattingSnacks = {};
	let samenvattingBroodjes = {};

	// Reactieve block die draait opnieuw als bestellingen veranderen
	$: {
		samenvattingFriet = {};
		samenvattingSnacks = {};
		samenvattingBroodjes = {};

		for (let b of bestellingen) {
			// skip lege items
			if (!b.bestelling) continue;

			const { friet, snack, broodje } = b.bestelling;

			// riet tellen
			if (friet) {
				samenvattingFriet[friet.naam] = (samenvattingFriet[friet.naam] || 0) + 1;
			}

			// snacks tellen
			if (snack) {
				// saus wordt meegeteld in key
				let key = snack.naam + (snack.saus ? ' ' + snack.saus : '');

				samenvattingSnacks[key] = (samenvattingSnacks[key] || 0) + 1;
			}

			//broodjes tellen
			if (broodje) {
				// fallback naam als die niet bestaat
				// in principe kan er geen fout broodje meer zijn, kan wel als iemand met api eentje stuurt
				const key =
					broodje.naam ||
					`${broodje.hardOfZacht} ${broodje.witOfBruin} broodje ${broodje.beleg} ${broodje.vega ? 'Vega' : ''}`.trim();

				samenvattingBroodjes[key] = (samenvattingBroodjes[key] || 0) + 1;
			}
		}
	}

	async function copyLink() {
		try {
			if (navigator.clipboard && window.isSecureContext) {
				await navigator.clipboard.writeText(qrUrl);
			} else {
				// fallback
				const textArea = document.createElement('textarea');
				textArea.value = qrUrl;
				textArea.style.position = 'fixed';
				textArea.style.left = '-9999px';

				document.body.appendChild(textArea);
				textArea.focus();
				textArea.select();

				document.execCommand('copy');
				document.body.removeChild(textArea);
			}
		} catch (err) {
			console.error('Kopiëren mislukt:', err);
		}
	}
</script>

<div class="min-h-screen bg-gray-50 pb-10">
	<div class="mx-auto flex max-w-5xl items-center justify-between p-4">
		<button
			class="rounded bg-gray-200 px-3 py-2 text-sm font-medium text-black hover:bg-gray-300"
			on:click={() => goto('/')}
		>
			← Terug
		</button>
		<h1 class="text-xl font-bold text-black">Code: {bestelCode}</h1>
		<div class="w-10"></div>
	</div>

	<div class="mx-auto grid max-w-5xl gap-4 p-2 md:grid-cols-3 md:p-4">
		<div class="rounded-xl bg-white p-4 shadow-md md:col-span-2">
			<h2 class="mb-4 border-b pb-2 text-lg font-bold text-black">Jouw bestelling</h2>

			<p class="mb-1 text-sm font-bold text-gray-900">
				Naam <span class="text-red-600">*verplicht</span>
			</p>
			<input
				class="mb-4 w-full rounded-lg border border-gray-300 p-3 text-gray-900"
				bind:value={naamInput}
				placeholder="Wie ben je?"
			/>

			<div class="mt-4 rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
				<h3 class="mb-2 font-semibold text-gray-900">Snack</h3>

				<div class="flex flex-col gap-2 sm:flex-row">
					<select
						bind:value={snackInput}
						class="w-full rounded-lg border border-gray-300 p-3 text-gray-900"
					>
						<option value="">Kies een snack</option>
						{#each snacks as s}
							<option value={s}>{s}</option>
						{/each}
					</select>

					<select
						bind:value={sausInput}
						class="w-full rounded-lg border border-gray-300 p-3 text-gray-900"
					>
						<option value="">Saus</option>
						<option value="Mayonaise">Mayonaise</option>
						<option value="Ketchup">Ketchup</option>
						<option value="Curry">Curry</option>
						<option value="Speciaal">Speciaal</option>
					</select>
				</div>
			</div>

			<div class="mt-4 rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
				<h3 class="mb-2 font-semibold text-gray-900">Friet</h3>

				<select
					bind:value={frietInput}
					class="w-full rounded-lg border border-gray-300 p-3 text-gray-900"
				>
					<option value="">Kies friet</option>
					{#each frietOpties as f}
						<option value={f}>{f}</option>
					{/each}
				</select>
			</div>

			<div class="mt-4 rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
				<h3 class="mb-2 font-semibold text-gray-900">Broodje</h3>

				<select
					bind:value={broodjeBeleg}
					class="w-full rounded-lg border border-gray-300 p-3 text-gray-900"
				>
					<option value="">Kies beleg</option>
					{#each broodjesBelegOpties as b}
						<option value={b}>{b}</option>
					{/each}
				</select>

				{#if broodjeBeleg}
					<div class="mt-3 grid grid-cols-2 gap-2">
						{#if broodjeHardOpties.length > 1}
							<select
								bind:value={broodjeHardOfZacht}
								class="rounded-lg border border-gray-300 p-3 text-gray-900"
							>
								<option value="">Hard/Zacht</option>
								{#each broodjeHardOpties as h}
									<option value={h}>{h}</option>
								{/each}
							</select>
						{/if}

						<select
							bind:value={broodjeWitOfBruin}
							class="rounded-lg border border-gray-300 p-3 text-gray-900"
						>
							<option value="">Wit/Bruin</option>
							{#each broodjeWitOpties as w}
								<option value={w}>{w}</option>
							{/each}
						</select>
					</div>

					{#if heeftVegaOptie}
						<label class="mt-3 flex items-center gap-2 font-medium text-gray-900">
							<input type="checkbox" class="h-5 w-5" bind:checked={broodjeVega} />
							Vega optie
						</label>
					{/if}
				{/if}
			</div>

			<button
				class="mt-6 w-full rounded-xl py-4 text-lg font-bold shadow-lg transition-transform active:scale-95 {naamInput.trim()
					? 'bg-green-600 text-white hover:bg-green-700'
					: 'cursor-not-allowed bg-gray-300 text-gray-500'}"
				disabled={!naamInput.trim()}
				on:click={toevoegen}
			>
				{#if naamInput.trim()}
					Toevoegen aan lijst
				{:else}
					Vul eerst je naam in ↑
				{/if}
			</button>

			<h2 class="mt-8 mb-4 border-b pb-2 text-lg font-bold text-black">Wie bestelt wat?</h2>
			<div class="space-y-2">
				{#each bestellingen as b}
					<div class="rounded-lg border border-gray-200 bg-white p-3">
						<div class="flex items-center justify-between">
							<button class="text-left font-bold text-black" on:click={() => toggleBestelling(b.id)}
								>{b.naam}</button
							>
							<button
								class="rounded-full bg-red-100 p-2 text-red-600"
								on:click={() => verwijderBestelling(b.id)}
							>
								✕
							</button>
						</div>
						{#if geopendeBestelling === b.id}
							<div class="mt-2 rounded bg-gray-50 p-2 text-sm text-gray-800">
								{#if b.bestelling?.snack}<p>
										• {b.bestelling.snack.naam}
										{b.bestelling.snack.saus ?? ''}
									</p>{/if}
								{#if b.bestelling?.friet}<p>• {b.bestelling.friet.naam}</p>{/if}
								{#if b.bestelling?.broodje}<p>• {b.bestelling.broodje.naam}</p>{/if}
							</div>
						{/if}
					</div>
				{/each}
			</div>
		</div>

		<div class="space-y-4">
			<div class="rounded-xl bg-white p-4 shadow-md">
				<h2 class="mb-4 border-b pb-2 font-bold text-black">Totaal ({totaal} personen)</h2>

				<div class="space-y-4">
					<div>
						<h3 class="text-xs font-black text-gray-500 uppercase">Friet</h3>
						<ul class="mt-1 text-sm font-bold text-black">
							{#each Object.entries(samenvattingFriet) as [product, aantal]}
								<li class="flex justify-between border-b border-gray-100 py-1">
									<span>{product}</span> <span>{aantal}x</span>
								</li>
							{/each}
						</ul>
					</div>
					<div>
						<h3 class="text-xs font-black text-gray-500 uppercase">Snacks</h3>
						<ul class="mt-1 text-sm font-bold text-black">
							{#each Object.entries(samenvattingSnacks) as [product, aantal]}
								<li class="flex justify-between border-b border-gray-100 py-1">
									<span>{product}</span> <span>{aantal}x</span>
								</li>
							{/each}
						</ul>
					</div>
					<div>
						<h3 class="text-xs font-black text-gray-500 uppercase">Broodjes</h3>
						<ul class="mt-1 text-sm font-bold text-black">
							{#each Object.entries(samenvattingBroodjes) as [product, aantal]}
								<li class="flex justify-between border-b border-gray-100 py-1">
									<span>{product}</span> <span>{aantal}x</span>
								</li>
							{/each}
						</ul>
					</div>
				</div>
			</div>

			<div class="rounded-xl border-2 border-blue-200 bg-blue-50 p-6 text-center shadow-md">
				<p class="mb-4 text-sm font-bold text-blue-900">Laat anderen scannen om mee te bestellen</p>
				<div class="mx-auto inline-block rounded-lg bg-white p-2 shadow-inner">
					<QrCode value={qrUrl} size={160} />
				</div>
				<button
					class="mt-4 w-full rounded bg-white px-2 py-1 font-mono text-[10px] break-all text-blue-700 hover:bg-blue-50"
					on:click={copyLink}
					
				>
					{qrUrl}
				</button>
				<p> klik op de link om te Kopiëren</p>
			</div>
		</div>
	</div>
</div>
