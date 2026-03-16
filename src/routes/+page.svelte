<script>
	import './+layout.svelte';

	/**
	 * Importeert de functie addBestelling uit bestellingen.js
	 * Deze functie voegt een bestelling toe of verhoogt het aantal
	 * als dezelfde snack en friet al bestaan.
	 */
	import { addBestelling } from './lib/bestellingen.js';

	/** @type {object[]} lijst met alle bestellingen */
	let bestellingen = [];

	/** @type {Object} samenvatting van alle producten */
	let samenvatting = {};

	/** @type {string} gekozen snack */
	let snackInput = '';

	/** @type {string} naam van de persoon die bestelt */
	let naamInput = '';

	/** @type {string} gekozen friet */
	let frietInput = '';

	/**
	 * Lijst met beschikbare snacks
	 * @type {string[]}
	 */
	let snacks = [
		'Bamischijf Pittig',
		'Gehaktstaaf',
		'Kipkorn',
		'Viandelle',
		'Bal Gehakt (frituur)',
		'Goulash- of Satékroket',
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

	/**
	 * Lijst met friet opties
	 * @type {string[]}
	 */
	let friet = ['Friet', 'Friet met mayonaise', 'Friet speciaal', 'Friet oorlog'];

	/**
	 * Voegt een bestelling toe aan de lijst
	 */
	function toevoegen() {
		bestellingen = addBestelling(bestellingen, naamInput, snackInput, frietInput);

		// invoervelden leeg maken
		naamInput = '';
		snackInput = '';
		frietInput = '';
	}

	/**
	 * Verwijdert een bestelling uit de lijst
	 * @param {number} index - positie van de bestelling
	 */
	function verwijderBestelling(index) {
		bestellingen.splice(index, 1);
		bestellingen = bestellingen;
	}

	/**
	 * Reactieve variabele in Svelte
	 * telt automatisch het aantal bestellingen
	 */
	$: totaal = bestellingen.length;

	/**
	 * Reactieve samenvatting van alle producten
	 * snacks en friet worden bij elkaar opgeteld
	 */
	$: {
		samenvatting = {};

		for (let bestelling of bestellingen) {
			// snack optellen
			if (bestelling.snack) {
				if (!samenvatting[bestelling.snack]) {
					samenvatting[bestelling.snack] = 0;
				}

				samenvatting[bestelling.snack] += bestelling.aantal;
			}

			// friet optellen
			if (bestelling.friet) {
				if (!samenvatting[bestelling.friet]) {
					samenvatting[bestelling.friet] = 0;
				}

				samenvatting[bestelling.friet] += bestelling.aantal;
			}
		}
	}
</script>

<div class="Title">
	<h1>Wat wil je bestellen?</h1>
</div>

<div class="snacktext">
	<input bind:value={naamInput} placeholder="naam" />

	<select bind:value={snackInput}>
		<option value="">Kies een snack</option>

		{#each snacks as snack}
			<option value={snack}>{snack}</option>
		{/each}
	</select>

	<select bind:value={frietInput}>
		<option value="">Kies friet</option>

		{#each friet as friets}
			<option value={friets}>{friets}</option>
		{/each}
	</select>

	<button on:click={toevoegen}>toevoegen</button>

	<h2>Bestellingen</h2>

	{#each bestellingen as bestelling, index}
		<p>
			{bestelling.naam.join(' en ')} - {bestelling.aantal}x {bestelling.snack} en {bestelling.friet}

			<button on:click={() => verwijderBestelling(index)}>verwijder</button>
		</p>
	{/each}

	<p>je hebt {totaal} bestelling(en)</p>

	<h2>Totale bestelling</h2>

	<ul>
		{#each Object.entries(samenvatting).sort() as [product, aantal]}
			<li>{aantal}x {product}</li>
		{/each}
	</ul>
</div>
