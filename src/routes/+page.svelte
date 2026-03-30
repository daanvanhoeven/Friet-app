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

		if (snackInput) {
			bestelling.snack = {
				naam: snackInput,
				saus: sausInput || null
			};
		}

		if (frietInput) {
			bestelling.friet = {
				naam: frietInput
			};
		}

		if (broodjeHardOfZacht && broodjeWitOfBruin && broodjeBeleg) {
			bestelling.broodje = {
				hardOfZacht: broodjeHardOfZacht,
				witOfBruin: broodjeWitOfBruin,
				beleg: broodjeBeleg,
				vega: broodjeVega
			};
		}

		await fetch('/api/bestel-overzicht', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				naam: naamInput,
				bestelling
			})
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
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ id })
		});

		refresh();
	}

	function toggleBestelling(id) {
		if (geopendeBestelling === id) {
			geopendeBestelling = null;
		} else {
			geopendeBestelling = id;
		}
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

			if (friet) {
				samenvattingFriet[friet.naam] = (samenvattingFriet[friet.naam] || 0) + 1;
			}

			if (snack) {
				let key = snack.naam;

				if (snack.saus) {
					key += ' ' + snack.saus;
				}

				samenvattingSnacks[key] = (samenvattingSnacks[key] || 0) + 1;
			}

			if (broodje) {
				let key =
					`${broodje.hardOfZacht} ` + `${broodje.witOfBruin} ` + `broodje ` + `${broodje.beleg}`;

				if (broodje.vega) {
					key += ' vega';
				}

				samenvattingBroodjes[key] = (samenvattingBroodjes[key] || 0) + 1;
			}
		}
	}
</script>

<h1 class="my-6 text-center text-2xl font-semibold">Wat wil je bestellen?</h1>

<div class="mx-auto grid max-w-5xl gap-5 p-4 md:grid-cols-3">
	<div class="rounded-lg bg-white p-5 shadow-sm md:col-span-2">
		<h2 class="mb-3 font-semibold">Bestellen</h2>

		<br />
		<p>Vul je naam in</p>
		<input class="mb-3 w-full" bind:value={naamInput} placeholder="Naam" />

		<!-- SNACK DIV -->
		<div class="mt-4 rounded border p-3">
			<h3 class="font-semibold">Kies een snack</h3>

			<div class="grid gap-2 md:grid-cols-2">
				<select bind:value={snackInput}>
					<option value=""> Kies een snack </option>

					{#each snacks as s}
						<option value={s}>
							{s}
						</option>
					{/each}
				</select>

				<select bind:value={sausInput}>
					<option value=""> Saus </option>

					{#each sauzen as s}
						<option value={s}>
							{s}
						</option>
					{/each}
				</select>
			</div>
		</div>

		<!-- FRIET DIV -->
		<div class="mt-4 rounded border p-3">
			<h3 class="font-semibold">Kies friet</h3>

			<select bind:value={frietInput}>
				<option value=""> Kies een frietje </option>

				{#each frietOpties as f}
					<option value={f}>
						{f}
					</option>
				{/each}
			</select>
		</div>

		<!-- BROODJE DIV -->
		<div class="mt-4 rounded border p-3">
			<h3 class="font-semibold">Kies een broodje</h3>

			<div class="grid gap-2 md:grid-cols-2">
				<select bind:value={broodjeHardOfZacht}>
					<option value="">Hard of zacht</option>
					<option value="hard">Hard</option>
					<option value="zacht">Zacht</option>
				</select>

				<select bind:value={broodjeWitOfBruin}>
					<option value="">Wit of bruin</option>
					<option value="wit">Wit</option>
					<option value="bruin">Bruin</option>
				</select>

				<select bind:value={broodjeBeleg}>
					<option value="">Beleg</option>
					<option value="gezond">Gezond</option>
					<option value="kroket">Kroket</option>
					<option value="frikandel">Frikandel</option>
				</select>

				<label class="flex items-center gap-2">
					<input type="checkbox" bind:checked={broodjeVega} />
					Vega
				</label>
			</div>
		</div>

		<button
			class="mt-4 w-full rounded bg-gray-800 py-2 text-white hover:bg-gray-700"
			on:click={toevoegen}
		>
			{errorNaam ? errorNaam : 'Toevoegen'}
		</button>

		<h2 class="mt-6 font-semibold">Bestellingen</h2>

		{#each bestellingen as b}
			<div class="mt-2 rounded bg-gray-100 p-3">
				<div class="flex items-center justify-between">
					<button class="text-left font-semibold" on:click={() => toggleBestelling(b.id)}>
						{b.naam}
					</button>

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
							<p>
								{b.bestelling.snack.naam}

								{#if b.bestelling.snack.saus}
									{` ${b.bestelling.snack.saus}`}
								{/if}
							</p>
						{/if}

						{#if b.bestelling?.friet}
							<p>{b.bestelling.friet.naam}</p>
						{/if}

						{#if b.bestelling?.broodje}
							<p>
								{b.bestelling.broodje.hardOfZacht}
								{b.bestelling.broodje.witOfBruin}
								broodje
								{b.bestelling.broodje.beleg}

								{#if b.bestelling.broodje.vega}
									vega
								{/if}
							</p>
						{/if}
					</div>
				{/if}
			</div>
		{/each}
	</div>

	<div class="h-fit rounded-lg bg-white p-5 shadow-sm">
		<h2 class="mb-3 font-semibold">
			Totale bestelling ({totaal} personen)
		</h2>

		<div class="mb-3">
			<h3 class="text-sm font-medium text-gray-600">Friet</h3>

			<ul class="text-sm">
				{#each Object.entries(samenvattingFriet) as [product, aantal]}
					<li>
						{aantal}x {product}
					</li>
				{/each}
			</ul>
		</div>

		<div class="mb-3">
			<h3 class="text-sm font-medium text-gray-600">Snacks</h3>

			<ul class="text-sm">
				{#each Object.entries(samenvattingSnacks) as [product, aantal]}
					<li>
						{aantal}x {product}
					</li>
				{/each}
			</ul>
		</div>

		<div class="mb-3">
			<h3 class="text-sm font-medium text-gray-600">Broodjes</h3>

			<ul class="text-sm">
				{#each Object.entries(samenvattingBroodjes) as [product, aantal]}
					<li>
						{aantal}x {product}
					</li>
				{/each}
			</ul>
		</div>

		<div class="h-fit rounded-lg bg-gray-300 p-5 shadow-sm">
			<p class="mb-2 text-sm text-black">Scan om te bestellen op de telefoon</p>

			<QrCode value="http://192.168.255.216:5173/" size={150} />
		</div>

		<p class="mt-4 text-xs text-gray-500">
			{totaal} bestelling(en)
		</p>
	</div>
</div>
