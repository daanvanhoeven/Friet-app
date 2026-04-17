import { getBroodjeId } from '$lib/data/alles.js';
import { getFrietId } from '$lib/data/alles.js';
import { getSnackId } from '$lib/data/alles.js';

/** @type {import('$lib/data/typedef').BestelItem} */

/** @type {Array} */
let bestellingen = [];

let geldigeCodes = [];

export function getBestellingen() {
	return bestellingen;
}


export function bestaatCode(code) {
	return geldigeCodes.includes(code);
}


export function maakBestellijst(code) {
	if (!geldigeCodes.includes(code)) {
		geldigeCodes.push(code);
	}
}

export function voegBestellingToe({ naam, bestelling, code = 'default' }) {

	if (!bestaatCode(code)) {
		return { error: 'Code bestaat niet' };
	}

	if (!naam) {
		return { error: 'Ongeldige naam' };
	}

	if (!bestelling) {
		return { error: 'Ongeldige bestelling' };
	}

	const { friet, snack, broodje } = bestelling;

	
	if (broodje) {
		const id = getBroodjeId(broodje);
		if (id === -1) return { error: 'Ongeldig broodje' };
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
		bestelling,
		code
	});

	return { ok: true };
}

export function deleteBestelling(id) {
	bestellingen = bestellingen.filter((b) => b.id !== id);
}