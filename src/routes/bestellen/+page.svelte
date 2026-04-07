<script>
	import { onMount, onDestroy } from 'svelte';
	import { page } from '$app/stores';
	import QrCode from 'svelte-qrcode';
	import { goto } from '$app/navigation';
	import { SNACKS } from '$lib/data/snacks.js';
	import { FRIET } from '$lib/data/friet.js';
	import { BROODJES } from '$lib/data/broodjes.js';

	// BESTELCODE UIT URL
	let bestelCode = '';
	$: bestelCode = $page.url.searchParams.get('code') || 'default';

	// AUTOMATISCHE QR URL
	let qrUrl = '';
	$: if (typeof window !== 'undefined') {
		qrUrl = `${window.location.origin}/?code=${bestelCode}`;
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

	// Dropdown-opties
	let snacks = SNACKS.map((s) => s.naam);
	let frietOpties = FRIET.map((f) => f.naam);
	let broodjesBelegOpties = [...new Set(BROODJES.map((b) => b.beleg))];

	// REFRESH BESTELLINGEN
	async function refresh() {
		const res = await fetch(`/api/bestel-overzicht?code=${bestelCode}`);
		const data = await res.json();
		bestellingen = data.bestellingen ?? [];
	}

	function selectBroodje() {
		if (!broodjeBeleg || !broodjeWitOfBruin || !broodjeHardOfZacht) return null;

		let broodjeMatch = BROODJES.find(
			(b) =>
				b.beleg === broodjeBeleg &&
				b.witOfBruin === broodjeWitOfBruin &&
				b.hardOfZacht === broodjeHardOfZacht &&
				b.vega === broodjeVega
		);

		if (!broodjeMatch) {
			broodjeMatch = {
				beleg: broodjeBeleg,
				witOfBruin: broodjeWitOfBruin,
				hardOfZacht: broodjeHardOfZacht,
				vega: broodjeVega,
				naam: `${broodjeHardOfZacht} ${broodjeWitOfBruin} broodje ${broodjeBeleg} ${broodjeVega ? 'Vega' : ''}`.trim()
			};
		}

		return broodjeMatch;
	}

	async function toevoegen() {
		if (!naamInput.trim()) {
			errorNaam = 'Vul je naam in!';
			return;
		}
		errorNaam = '';

		if (!snackInput && !frietInput && !broodjeBeleg) return;

		const bestelling = {};

		if (snackInput) {
			const snack = SNACKS.find((s) => s.naam === snackInput);
			bestelling.snack = snack ? { ...snack, saus: sausInput || null } : null;
		}

		if (frietInput) {
			const friet = FRIET.find((f) => f.naam === frietInput);
			bestelling.friet = friet ?? null;
		}

		const broodje = selectBroodje();
		if (broodje) bestelling.broodje = broodje;

		await fetch('/api/bestel-overzicht', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({
				naam: naamInput,
				bestelling,
				code: bestelCode
			})
		});

		naamInput = '';
		snackInput = '';
		frietInput = '';
		sausInput = '';
		broodjeBeleg = '';
		broodjeWitOfBruin = '';
		broodjeHardOfZacht = '';
		broodjeVega = false;

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
		geopendeBestelling = geopendeBestelling === id ? null : id;
	}

	let interval;

	onMount(() => {
		refresh();
		interval = setInterval(refresh, 3000);
	});

	onDestroy(() => clearInterval(interval));

	$: totaal = bestellingen.length;

	let samenvattingFriet = {};
	let samenvattingSnacks = {};
	let samenvattingBroodjes = {};

	$: {
		samenvattingFriet = {};
		samenvattingSnacks = {};
		samenvattingBroodjes = {};

		for (let b of bestellingen) {
			if (!b.bestelling) continue;

			const { friet, snack, broodje } = b.bestelling;

			if (friet) samenvattingFriet[friet.naam] = (samenvattingFriet[friet.naam] || 0) + 1;

			if (snack) {
				let key = snack.naam;
				if (snack.saus) key += ' ' + snack.saus;

				samenvattingSnacks[key] = (samenvattingSnacks[key] || 0) + 1;
			}

			if (broodje) {
				const key =
					broodje.naam ||
					`${broodje.hardOfZacht} ${broodje.witOfBruin} broodje ${broodje.beleg} ${broodje.vega ? 'Vega' : ''}`.trim();

				samenvattingBroodjes[key] = (samenvattingBroodjes[key] || 0) + 1;
			}
		}
	}

	function terugNaarStart() {
		goto('/');
	}
</script>

<div class="mx-auto flex max-w-5xl items-center justify-between px-4">
	<button
		class="rounded bg-gray-300 px-3 py-2 text-sm hover:bg-gray-400"
		on:click={terugNaarStart}
	>
		← Terug naar startpagina
	</button>

	<h1 class="text-2xl font-semibold">
		Wat wil je bestellen? (Code: {bestelCode})
	</h1>

	<div></div>
</div>

<div class="mx-auto grid max-w-5xl gap-5 p-4 md:grid-cols-3">
	<!-- Bestellen -->
	<div class="rounded-lg bg-white p-5 shadow-sm md:col-span-2">
		<h2 class="mb-3 font-semibold">Bestellen</h2>

		<p>Vul je naam in</p>
		<input class="mb-3 w-full rounded border p-2" bind:value={naamInput} placeholder="Naam" />

		<!-- Snack -->
		<div class="mt-4 rounded border p-3">
			<h3 class="font-semibold">Kies een snack</h3>
			<div class="grid gap-2 md:grid-cols-2">
				<select bind:value={snackInput} class="rounded border p-2">
					<option value=""> Kies een snack </option>
					{#each snacks as s}
						<option value={s}>{s}</option>
					{/each}
				</select>

				<select bind:value={sausInput} class="rounded border p-2">
					<option value=""> Saus </option>
					<option value="Mayonaise">Mayonaise</option>
					<option value="Ketchup">Ketchup</option>
					<option value="Curry">Curry</option>
					<option value="Speciaal">Speciaal</option>
				</select>
			</div>
		</div>

		<!-- Friet -->
		<div class="mt-4 rounded border p-3">
			<h3 class="font-semibold">Kies friet</h3>
			<select bind:value={frietInput} class="rounded border p-2">
				<option value=""> Kies een frietje </option>
				{#each frietOpties as f}
					<option value={f}>{f}</option>
				{/each}
			</select>
		</div>

		<div class="mt-4 rounded border p-3">
			<h3 class="font-semibold">Kies een broodje</h3>

			<select bind:value={broodjeBeleg} class="w-full rounded border p-2">
				<option value="">Beleg</option>
				{#each broodjesBelegOpties as b}
					<option value={b}>{b}</option>
				{/each}
			</select>

			{#if broodjeBeleg}
				<select bind:value={broodjeWitOfBruin} class="mt-2 w-full rounded border p-2">
					<option value="">Wit of bruin</option>
					<option value="wit">Wit</option>
					<option value="bruin">Bruin</option>
				</select>
			{/if}

			{#if broodjeWitOfBruin}
				<select bind:value={broodjeHardOfZacht} class="mt-2 w-full rounded border p-2">
					<option value="">Hard of zacht</option>
					<option value="hard">Hard</option>
					<option value="zacht">Zacht</option>
				</select>

				<label class="mt-2 flex items-center gap-2">
					<input type="checkbox" bind:checked={broodjeVega} /> Vega
				</label>
			{/if}
		</div>

		<button
			class="mt-4 w-full rounded bg-primary-500 py-2 text-white hover:bg-primary-600"
			on:click={toevoegen}
		>
			{errorNaam ? errorNaam : 'Toevoegen'}
		</button>

		<h2 class="mt-6 font-semibold">Bestellingen</h2>
		{#each bestellingen as b}
			<div class="mt-2 rounded bg-gray-100 p-3">
				<div class="flex items-center justify-between">
					<button class="text-left font-semibold" on:click={() => toggleBestelling(b.id)}
						>{b.naam}</button
					>
					<button
						class="rounded bg-red-400 px-2 py-1 text-sm text-white hover:bg-red-500"
						on:click={() => verwijderBestelling(b.id)}
					>
						X
					</button>
				</div>

				{#if geopendeBestelling === b.id}
					<div class="mt-2 text-sm">
						{#if b.bestelling?.snack}
							<p>{b.bestelling.snack.naam} {b.bestelling.snack.saus ?? ''}</p>
						{/if}
						{#if b.bestelling?.friet}
							<p>{b.bestelling.friet.naam}</p>
						{/if}
						{#if b.bestelling?.broodje}
							<p>
								{b.bestelling.broodje.naam ??
									`${b.bestelling.broodje.beleg ?? ''} ${b.bestelling.broodje.witOfBruin ?? ''} ${b.bestelling.broodje.hardOfZacht ?? ''} ${b.bestelling.broodje.vega ? 'Vega' : ''}`.trim()}
							</p>
						{/if}
					</div>
				{/if}
			</div>
		{/each}
	</div>

	<!-- Totale bestellingen -->
	<div class="h-fit rounded-lg bg-white p-5 shadow-sm">
		<h2 class="mb-3 font-semibold">Totale bestelling ({totaal} personen)</h2>

		<div class="mb-3">
			<h3 class="text-sm font-medium text-gray-600">Friet</h3>
			<ul class="text-sm">
				{#each Object.entries(samenvattingFriet) as [product, aantal]}
					<li>{aantal}x {product}</li>
				{/each}
			</ul>
		</div>

		<div class="mb-3">
			<h3 class="text-sm font-medium text-gray-600">Snacks</h3>
			<ul class="text-sm">
				{#each Object.entries(samenvattingSnacks) as [product, aantal]}
					<li>{aantal}x {product}</li>
				{/each}
			</ul>
		</div>

		<div class="mb-3">
			<h3 class="text-sm font-medium text-gray-600">Broodjes</h3>
			<ul class="text-sm">
				{#each Object.entries(samenvattingBroodjes) as [product, aantal]}
					<li>{aantal}x {product}</li>
				{/each}
			</ul>
		</div>

		<div class="h-fit rounded-lg bg-gray-300 p-5 shadow-sm">
			<p class="mb-2 text-sm text-black">Scan om te bestellen op de telefoon</p>

			<QrCode value={qrUrl} size={150} />

			<p class="mt-2 text-xs break-all text-black">
				{qrUrl}
			</p>
		</div>

		<p class="mt-4 text-xs text-gray-500">{totaal} bestelling(en)</p>
	</div>
</div>
