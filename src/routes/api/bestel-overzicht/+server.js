import { json } from '@sveltejs/kit';

import { findBroodjeById } from '$lib/data/alles.js';
import { findFrietById } from '$lib/data/alles.js';
import { findSnackById } from '$lib/data/alles.js';

import { getBestellingen } from '$lib/server/bestellijst.js';
import { voegBestellingToe } from '$lib/server/bestellijst.js';
import { deleteBestelling } from '$lib/server/bestellijst.js';
/**
 * GET  alle bestellingen ophalend
 */
export function GET() {
	const bestellingen = getBestellingen();

	const result = {};

	/**
	 *  @type {Map<number,number>}
	 */
	const aantalBroodjesById = new Map();
	const aantalFrietById = new Map();
	const aantalsnackjeById = new Map();

	for (const { naam, bestelling } of bestellingen) {
		const { friet, snack, broodje } = bestelling;

		//console.log('checkpoint 1', broodje);

		if (broodje) {
			const broodjeId = /** @type {number} */ (broodje.id);
			if (!aantalBroodjesById.has(broodjeId)) {
				aantalBroodjesById.set(broodjeId, 1);
			} else {
				const aantal = /** @type {number} */ (aantalBroodjesById.get(broodjeId));
				aantalBroodjesById.set(broodjeId, aantal + 1);
			}
		}

		if (friet) {
			const frietId = /** @type {number} */ (friet.id);
			if (!aantalFrietById.has(frietId)) {
				aantalFrietById.set(frietId, 1);
			} else {
				const aantal = /** @type {number} */ (aantalFrietById.get(frietId));
				aantalFrietById.set(frietId, aantal + 1);
			}
		}

		if (snack) {
			const snackId = /** @type {number} */ (snack.id);
			if (!aantalsnackjeById.has(snackId)) {
				aantalsnackjeById.set(snackId, 1);
			} else {
				const aantal = /** @type {number} */ (aantalsnackjeById.get(snackId));
				aantalsnackjeById.set(snackId, aantal + 1);
			}
		}
	}

	//console.log('checkpoint 2', aantalBroodjesById,  aantalFrietById, aantalsnackjeById);
	
	const broodjes = [];

	for (const [id, aantal] of aantalBroodjesById.entries()) {
		const broodje = findBroodjeById(id);

		if (broodje) {
			broodjes.push({ aantal, broodje });
		} else {
			throw new Error(`Broodje [${id}] bestaat niet`);
		}
	}
	
	const frietje = [];
	for (const [id, aantal] of aantalFrietById.entries()) {
		const friet = findFrietById(id);

		if (friet) {
			frietje.push({ aantal, friet });
		} else {
			throw new Error(`Friet [${id}] bestaat niet`);
		}
	}

	const snackje = [];
	for (const [id, aantal] of aantalsnackjeById.entries()) {
		const snack = findSnackById(id);

		if (snack) {
			snackje.push({ aantal, snack });
		} else {
			throw new Error(`Snack [${id}] bestaat niet`);
		}
	}

	result.broodjes = broodjes;
	result.friet = frietje;
	result.snacks = snackje;
	result.bestellingen = bestellingen;
	return json(result);
}


/**
 * POST nieuwe bestelling toevoegen
 */
export async function POST({ request }) {
	const data = await request.json();

	const { naam, bestelling } = data;

	const result = voegBestellingToe({ naam, bestelling });

	if (result.error) {
		return json({ error: result.error }, { status: 400 });
	}

	return json({ ok: true });
}



/**
 * DELETE een bestelling verwijderen
 */
export async function DELETE({ request }) {
  const data = await request.json();
  const { id } = data;

  if (!id) {
    return json({ error: 'Geen id opgegeven' }, { status: 400 });
  }

  // Gebruik de deleteBestelling functie uit bestellijst.js
  deleteBestelling(id);

  return json({ ok: true });
}					