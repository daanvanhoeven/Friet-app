// import { json } from '@sveltejs/kit';

// import { findBroodjeById } from '$lib/data/alles.js';
// import { findFrietById } from '$lib/data/alles.js';
// import { findSnackById } from '$lib/data/alles.js';

// import { getBestellingen } from '$lib/server/bestellijst.js';

// /**
//  * GET  alle bestellingen ophalend
//  */
// export function GET() {
// 	const bestellingen = getBestellingen();

// 	const result = {};

// 	/**
// 	 *  @type {Map<number,number>}
// 	 */
// 	const aantalBroodjesById = new Map();
// 	const aantalFrietById = new Map();
// 	const aantalSnacksById = new Map();

// 	for (const { naam, bestelling } of bestellingen) {
// 		const { friet, snack, broodje } = bestelling;

// 		console.log('checkpoint 1', broodje);

// 		//  BROODJES
// 		if (broodje) {
// 			const broodjeId = /** @type {number} */ (broodje.id);
// 			if (!aantalBroodjesById.has(broodjeId)) {
// 				aantalBroodjesById.set(broodjeId, 1);
// 			} else {
// 				const aantal = /** @type {number} */ (aantalBroodjesById.get(broodjeId));
// 				aantalBroodjesById.set(broodjeId, aantal + 1);
// 			}
// 		}

// 		//  FRIET
// 		if (friet) {
// 			const frietId = /** @type {number} */ (friet.id);
// 			if (!aantalFrietById.has(frietId)) {
// 				aantalFrietById.set(frietId, 1);
// 			} else {
// 				const aantal = /** @type {number} */ (aantalFrietById.get(frietId));
// 				aantalFrietById.set(frietId, aantal + 1);
// 			}
// 		}

// 		//  SNACKS
// 		if (snack) {
// 			const snackId = /** @type {number} */ (snack.id);
// 			if (!aantalSnacksById.has(snackId)) {
// 				aantalSnacksById.set(snackId, 1);
// 			} else {
// 				const aantal = /** @type {number} */ (aantalSnacksById.get(snackId));
// 				aantalSnacksById.set(snackId, aantal + 1);
// 			}
// 		}
// 	}

// 	console.log('checkpoint 2', aantalBroodjesById);

// 	//  BROODJES RESULT
// 	const broodjes = [];
// 	for (const [id, aantal] of aantalBroodjesById.entries()) {
// 		const broodje = findBroodjeById(id);

// 		if (broodje) {
// 			broodjes.push({ aantal, broodje });
// 		} else {
// 			throw new Error(`Broodje [${id}] bestaat niet`);
// 		}
// 	}

// 	//  FRIET RESULT
// 	const frieten = [];
// 	for (const [id, aantal] of aantalFrietById.entries()) {
// 		const friet = findFrietById(id);

// 		if (friet) {
// 			frieten.push({ aantal, friet });
// 		} else {
// 			throw new Error(`Friet [${id}] bestaat niet`);
// 		}
// 	}

// 	//  SNACKS RESULT
// 	const snacks = [];
// 	for (const [id, aantal] of aantalSnacksById.entries()) {
// 		const snack = findSnackById(id);

// 		if (snack) {
// 			snacks.push({ aantal, snack });
// 		} else {
// 			throw new Error(`Snack [${id}] bestaat niet`);
// 		}
// 	}

// 	result.broodjes = broodjes;
// 	result.friet = frieten;
// 	result.snacks = snacks;

// 	return json(result);
// }