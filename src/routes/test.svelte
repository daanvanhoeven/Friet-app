<script>
	import { onMount } from 'svelte';
	import QrCode from 'svelte-qrcode';

	let bestellingen = [];

	let naamInput = '';
	let snackInput = '';
	let frietInput = '';
	let broodjeInput = '';
	let sausInput = '';

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
	let friet = ['Friet', 'Friet met mayonaise', 'Friet speciaal', 'Friet oorlog'];
	let broodjes = ['hard bruin broodje gezond vega','hard wit broodje gezond','Broodje kroket','Broodje frikandel'];
	let sauzen = ['Mayonaise', 'Ketchup', 'Curry'];

	async function refresh() {
		const res = await fetch('/api/bestel-overzicht');
		const data = await res.json();
		bestellingen = data.bestellingen ?? [];
	}

	async function toevoegen() {
		if (naamInput.trim() === '') return;
		if (!snackInput && !frietInput && !broodjeInput) return;

		const bestelling = {};

		if (snackInput) bestelling.snack = { naam: snackInput, saus: sausInput || null };
		if (frietInput) bestelling.friet = { naam: frietInput, saus: sausInput || null };

		if (broodjeInput === 'hard bruin broodje gezond vega') {
			bestelling.broodje = { beleg: 'gezond', hardOfZacht: 'hard', witOfBruin: 'bruin', vega: true };
		}
		if (broodjeInput === 'hard wit broodje gezond') {
			bestelling.broodje = { beleg: 'gezond', hardOfZacht: 'hard', witOfBruin: 'wit', vega: true };
		}
		if (broodjeInput === 'Broodje kroket') {
			bestelling.broodje = { beleg: 'kroket', hardOfZacht: 'zacht', witOfBruin: 'wit', vega: false };
		}
		if (broodjeInput === 'Broodje frikandel') {
			bestelling.broodje = { beleg: 'frikandel', hardOfZacht: 'zacht', witOfBruin: 'wit', vega: false };
		}

		await fetch('/api/bestel-overzicht', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ naam: naamInput, bestelling })
		});

		naamInput = '';
		snackInput = '';
		frietInput = '';
		broodjeInput = '';
		sausInput = '';

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

	onMount(() => {
		refresh();
		setInterval(refresh, 1000);
	});

	$: totaal = bestellingen.length;

	let samenvattingFriet = {};
	let samenvattingSnacks = {};
	let samenvattingBroodjes = {};

	$: {
		samenvattingFriet = {};
		samenvattingSnacks = {};
		samenvattingBroodjes = {};

		for (let b of bestellingen) {
			const { friet, snack, broodje } = b.bestelling;

			if (friet) {
				let key = friet.naam;
				if (friet.saus) key += ' met ' + friet.saus;
				if (!samenvattingFriet[key]) samenvattingFriet[key] = 0;
				samenvattingFriet[key]++;
			}

			if (snack) {
				let key = snack.naam;
				if (snack.saus) key +=  ' met ' + snack.saus;
				if (!samenvattingSnacks[key]) samenvattingSnacks[key] = 0;
				samenvattingSnacks[key]++;
			}

			if (broodje) {
				const key = broodje.beleg;
				if (!samenvattingBroodjes[key]) samenvattingBroodjes[key] = 0;
				samenvattingBroodjes[key]++;
			}
		}
	}
</script>

<h1 class="my-6 text-center text-2xl font-semibold">Wat wil je bestellen?</h1>

<div class="mx-auto grid max-w-5xl gap-5 p-4 md:grid-cols-3">
	<div class="rounded-lg bg-white p-5 shadow-sm md:col-span-2">
		<h2 class="mb-3 font-semibold">Bestellen</h2>

		<input class="mb-3 w-full" bind:value={naamInput} placeholder="Naam" />

		<div class="grid gap-2 md:grid-cols-2">
			<select bind:value={snackInput}>
				<option value="">Kies een snack</option>
				{#each snacks as s}<option value={s}>{s}</option>{/each}
			</select>

			<select bind:value={sausInput}>
				<option value="">Saus</option>
				{#each sauzen as s}<option value={s}>{s}</option>{/each}
			</select>

			<select bind:value={frietInput}>
				<option value="">Kies een frietje</option>
				{#each friet as f}<option value={f}>{f}</option>{/each}
			</select>

			<select bind:value={broodjeInput}>
				<option value="">Kies een broodje</option>
				{#each broodjes as b}<option value={b}>{b}</option>{/each}
			</select>
		</div>

		<button class="mt-4 w-full rounded bg-gray-800 py-2 text-white hover:bg-gray-700" on:click={toevoegen}>
			Toevoegen
		</button>

		<h2 class="mt-6 font-semibold">Bestellingen</h2>

		{#each bestellingen as b}
			<div class="mt-2 flex items-center justify-between rounded bg-gray-100 p-3">
				<span class="text-sm">
					<p>
						{b.naam}
						{#if b.bestelling.snack} - {b.bestelling.snack.naam}{#if b.bestelling.snack.saus} met {b.bestelling.snack.saus}{/if}{/if}
						{#if b.bestelling.friet} - {b.bestelling.friet.naam}{#if b.bestelling.friet.saus} met {b.bestelling.friet.saus}{/if}{/if}
						{#if b.bestelling.broodje} - {b.bestelling.broodje.beleg}{/if}
					</p>
				</span>

				<button class="rounded bg-red-400 px-2 py-1 text-sm text-white hover:bg-red-500"
					on:click={() => verwijderBestelling(b.id)}>
					X
				</button>
			</div>
		{/each}
	</div>

	<div class="h-fit rounded-lg bg-white p-5 shadow-sm">
		<h2 class="mb-3 font-semibold">Totale bestelling</h2>

		<div class="mb-3">
			<h3 class="text-sm font-medium text-gray-600">Friet</h3>
			<ul class="text-sm">{#each Object.entries(samenvattingFriet) as [product, aantal]}<li>{aantal}x {product}</li>{/each}</ul>
		</div>

		<div class="mb-3">
			<h3 class="text-sm font-medium text-gray-600">Snacks</h3>
			<ul class="text-sm">{#each Object.entries(samenvattingSnacks) as [product, aantal]}<li>{aantal}x {product}</li>{/each}</ul>
		</div>

		<div class="mb-3">
			<h3 class="text-sm font-medium text-gray-600">Broodjes</h3>
			<ul class="text-sm">{#each Object.entries(samenvattingBroodjes) as [product, aantal]}<li>{aantal}x {product}</li>{/each}</ul>
		</div>

		<div class="h-fit rounded-lg bg-gray-300 p-5 shadow-sm">
			<p class="mb-2 text-sm text-black">Scan om te bestellen op de telefoon</p>
			<QrCode value="http://192.168.255.216:5173/" size={150} />
		</div>

		<p class="mt-4 text-xs text-gray-500">{totaal} bestelling(en)</p>
	</div>
</div>