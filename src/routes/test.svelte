<script setup>
	import { onMount, onDestroy } from 'svelte';
	import QrCode from 'svelte-qrcode';

	let bestellingen = [];
	let naamInput = '';
	let errorNaam = '';

	let snackInput = '';
	let frietInput = '';
	let sausInput = '';

	let broodjeHardOfZacht = '';
	let broodjeWitOfBruin = '';
	let broodjeBeleg = '';
	let broodjeVega = false;

	let geopendeBestelling = null;

	let snacks = [
		'Bamischijf Pittig',
		'Kroket',
		'Gehaktstaaf',
		'Kipkorn',
		'Frikandel',
		'Kaassouffle',
		'Knakworst',
		'Bami-schijf',
		'Nasi-schijf',
		'Lihanboutje',
		'Ham/kaasouffle',
		'Viandelle',
		'Bal Gehakt (frituur)',
		'Goulashkroket ',
		'Satékroket',
		'Groentekroket',
		'Kaaskroket',
		'Kalfs- of Dobben Kroket',
		'Mexicano',
		'Braadworst fijn',
		'Braadworst grof',
		'Satérol',
		'Hamburger',
		'Berenklauw',
		'Sitostick',
		'Shoarmarol',
		'Bal Gehakt (jus)',
		'Frikandel XXL',
		'Loempia',
		'Mexicano XXL',
		'Kipcornwrap',
		'Mexicano wrap'
	];

	let frietOpties = ['Friet', 'Friet speciaal', 'Friet oorlog', 'Friet met mayonaise'];
	let sauzen = ['Mayonaise', 'Ketchup', 'Curry', 'Speciaal'];

	let interval;
	onMount(() => {
		refresh();
		interval = setInterval(refresh, 3000);
	});
	onDestroy(() => clearInterval(interval));

	async function refresh() {
		const res = await fetch('/api/bestel-overzicht');
		const data = await res.json();
		bestellingen = data.bestellingen ?? [];
	}

	async function toevoegen() {
		if (!naamInput.trim()) {
			errorNaam = 'Vul je naam in!';
			return;
		}
		errorNaam = '';
		if (!snackInput && !frietInput && !(broodjeHardOfZacht && broodjeWitOfBruin && broodjeBeleg))
			return;

		const bestelling = {};
		if (snackInput) bestelling.snack = { naam: snackInput, saus: sausInput || null };
		if (frietInput) bestelling.friet = { naam: frietInput };
		if (broodjeHardOfZacht && broodjeWitOfBruin && broodjeBeleg)
			bestelling.broodje = {
				hardOfZacht: broodjeHardOfZacht,
				witOfBruin: broodjeWitOfBruin,
				beleg: broodjeBeleg,
				vega: broodjeVega
			};

		await fetch('/api/bestel-overzicht', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ naam: naamInput, bestelling })
		});

		naamInput = '';
		snackInput = '';
		frietInput = '';
		sausInput = '';
		broodjeHardOfZacht = '';
		broodjeWitOfBruin = '';
		broodjeBeleg = '';
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
				let key = snack.naam + (snack.saus ? ` ${snack.saus}` : '');
				samenvattingSnacks[key] = (samenvattingSnacks[key] || 0) + 1;
			}
			if (broodje) {
				let key = `${broodje.hardOfZacht} ${broodje.witOfBruin} broodje ${broodje.beleg}${broodje.vega ? ' vega' : ''}`;
				samenvattingBroodjes[key] = (samenvattingBroodjes[key] || 0) + 1;
			}
		}
	}
</script>

<h1 class="title my-6 text-center">Wat wil je bestellen?</h1>

<div class="mx-auto grid max-w-6xl gap-6 p-4 md:grid-cols-3">
	<!-- Bestel formulier -->
	<div class="space-y-5 card p-5 shadow-md md:col-span-2">
		<h2 class="text-lg font-semibold">Bestellen</h2>

		<!-- Naam -->
		<div class="field">
			<label class="field-label">Naam</label>
			<input class="input w-full" placeholder="Vul je naam in" bind:value={naamInput} />
		</div>

		<!-- Snack -->
		<div class="card bg-gray-50 p-3">
			<h3 class="font-semibold">Kies een snack</h3>
			<div class="mt-2 grid gap-2 md:grid-cols-2">
				<select class="input" bind:value={snackInput}>
					<option value="">Kies een snack</option>
					{#each snacks as s}<option value={s}>{s}</option>{/each}
				</select>
				<select class="input" bind:value={sausInput}>
					<option value="">Saus</option>
					{#each sauzen as s}<option value={s}>{s}</option>{/each}
				</select>
			</div>
		</div>

		<!-- Friet -->
		<div class="card bg-gray-50 p-3">
			<h3 class="font-semibold">Kies een friet</h3>
			<select class="mt-2 input w-full" bind:value={frietInput}>
				<option value="">Kies een frietje</option>
				{#each frietOpties as f}<option value={f}>{f}</option>{/each}
			</select>
		</div>

		<!-- Broodje -->
		<div class="card bg-gray-50 p-3">
			<h3 class="font-semibold">Kies een broodje</h3>
			<div class="mt-2 grid gap-2 md:grid-cols-2">
				<select class="input" bind:value={broodjeHardOfZacht}>
					<option value="">Hard of zacht</option>
					<option value="hard">Hard</option>
					<option value="zacht">Zacht</option>
				</select>
				<select class="input" bind:value={broodjeWitOfBruin}>
					<option value="">Wit of bruin</option>
					<option value="wit">Wit</option>
					<option value="bruin">Bruin</option>
				</select>
				<select class="input" bind:value={broodjeBeleg}>
					<option value="">Beleg</option>
					<option value="gezond">Gezond</option>
					<option value="kroket">Kroket</option>
					<option value="frikandel">Frikandel</option>
				</select>
				<label class="flex items-center gap-2">
					<input type="checkbox" bind:checked={broodjeVega} /> Vega
				</label>
			</div>
		</div>

		<button class="variant-filled-primary mt-4 btn w-full" on:click={toevoegen}>
			{errorNaam ? errorNaam : 'Toevoegen'}
		</button>

		<!-- Bestellingen -->
		<h2 class="mt-6 text-lg font-semibold">Bestellingen</h2>
		{#each bestellingen as b}
			<div class="mt-2 card bg-gray-50 p-3">
				<div class="flex items-center justify-between">
					<button class="text-left font-semibold" on:click={() => toggleBestelling(b.id)}>
						{b.naam}
					</button>
					<button class="btn-danger btn btn-sm" on:click={() => verwijderBestelling(b.id)}>X</button
					>
				</div>

				{#if geopendeBestelling === b.id}
					<div class="mt-2 space-y-1 text-sm">
						{#if b.bestelling?.snack}<p>
								Snack: {b.bestelling.snack.naam}{b.bestelling.snack.saus
									? ` (${b.bestelling.snack.saus})`
									: ''}
							</p>{/if}
						{#if b.bestelling?.friet}<p>Friet: {b.bestelling.friet.naam}</p>{/if}
						{#if b.bestelling?.broodje}<p>
								Broodje: {b.bestelling.broodje.hardOfZacht}
								{b.bestelling.broodje.witOfBruin}
								{b.bestelling.broodje.beleg}{b.bestelling.broodje.vega ? ' (vega)' : ''}
							</p>{/if}
					</div>
				{/if}
			</div>
		{/each}
	</div>

	<!-- Samenvatting & QR -->
	<div class="space-y-4 card p-5 shadow-md">
		<h2 class="text-lg font-semibold">Totale bestelling ({totaal} personen)</h2>

		<div>
			<h3 class="font-medium text-gray-600">Friet</h3>
			<ul class="space-y-1">
				{#each Object.entries(samenvattingFriet) as [product, aantal]}<li>
						{aantal}x {product}
					</li>{/each}
			</ul>
		</div>

		<div>
			<h3 class="font-medium text-gray-600">Snacks</h3>
			<ul class="space-y-1">
				{#each Object.entries(samenvattingSnacks) as [product, aantal]}<li>
						{aantal}x {product}
					</li>{/each}
			</ul>
		</div>

		<div>
			<h3 class="font-medium text-gray-600">Broodjes</h3>
			<ul class="space-y-1">
				{#each Object.entries(samenvattingBroodjes) as [product, aantal]}<li>
						{aantal}x {product}
					</li>{/each}
			</ul>
		</div>

		<div class="card bg-gray-200 p-4 text-center">
			<p class="mb-2 text-sm">Scan om te bestellen op de telefoon</p>
			<QrCode value="http://192.168.255.216:5173/" size={150} />
		</div>

		<p class="text-xs text-gray-500">Totaal: {totaal} bestelling(en)</p>
	</div>
</div>
