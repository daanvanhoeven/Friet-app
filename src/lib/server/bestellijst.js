import { getBroodjeId } from '$lib/data/alles.js';
import { getFrietId } from '$lib/data/alles';
import { getSnackId } from '$lib/data/alles';

/**
 * @typedef {import('$lib/data/typedef').BestelItem} BestelItem
 */

/**
 * @typedef {Object} BestellingMetId
 * @property {number} id
 * @property {string} naam
 * @property {BestelItem} bestelling
 */

/** @type {BestellingMetId[]} */
let bestellingen = [];

export function getBestellingen() {
	return bestellingen;
}

/**
 * Voeg een bestelling toe aan de lijst met bestellingen
 *
 * @param {{ naam: string, bestelling: BestelItem}} bestelItem
 *
 * @returns {{ ok?: true, error?: string }}
 */
export function voegBestellingToe({ naam, bestelling }) {
	if (!naam) {
		return { error: 'Ongeldige naam' };
	}

	if (!bestelling) {
		return { error: 'Ongeldige bestelling' };
	}

	const { friet, snack, broodje } = bestelling;


	if (broodje) {
		const id = getBroodjeId(broodje);

		if (id === -1) {
			return { error: 'Ongeldig broodje' };
		}

		broodje.id = id;
	}

	
	if (friet) {
		const id = getFrietId(friet);
		if (id === -1) return { error: 'Ongeldige friet' };
		friet.id = id;
	}


	if (snack) {
		const id = getSnackId(snack);
		if (id === -1) return { error: 'Ongeldige snack' };
		snack.id = id;
	}

	bestellingen.push({
		id: Date.now(),
		naam,
		bestelling
	});

	console.log('bestellingen', bestellingen);

	return { ok: true };
}

export function deleteBestelling(id) {
	bestellingen = bestellingen.filter((b) => b.id !== id);
}