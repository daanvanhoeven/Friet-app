// export const snacks = [
// 	{
// 		naam: 'Frikandel',
// 		saus: 'speciaal'
// 	}
// ];

/**
 * @type {import('./typedef.js').Snack[]}
 */
export const SNACKS = [
	{ id: 1, naam: 'Bamischijf Pittig' },
	{ id: 2, naam: 'Kroket' },
	{ id: 3, naam: 'Gehaktstaaf' },
	{ id: 4, naam: 'Kipkorn' },
	{ id: 5, naam: 'Frikandel' },
	{ id: 6, naam: 'Kaassouffle' },
	{ id: 7, naam: 'Knakworst' },
	{ id: 8, naam: 'Bami-schijf' },
	{ id: 9, naam: 'Nasi-schijf' },
	{ id: 10, naam: 'Lihanboutje' },
	{ id: 11, naam: 'Ham/kaasouffle' },
	{ id: 12, naam: 'Viandelle' },
	{ id: 13, naam: 'Bal Gehakt (frituur)' },
	{ id: 14, naam: 'Goulashkroket' },
	{ id: 15, naam: 'Satékroket' },
	{ id: 16, naam: 'Groentekroket' },
	{ id: 17, naam: 'Kaaskroket' },
	{ id: 18, naam: 'Kalfs- of Dobben Kroket' },
	{ id: 19, naam: 'Mexicano' },
	{ id: 20, naam: 'Braadworst fijn' },
	{ id: 21, naam: 'Braadworst grof' },
	{ id: 22, naam: 'Satérol' },
	{ id: 23, naam: 'Hamburger' },
	{ id: 24, naam: 'Berenklauw' },
	{ id: 25, naam: 'Sitostick' },
	{ id: 26, naam: 'Shoarmarol' },
	{ id: 27, naam: 'Bal Gehakt (jus)' },
	{ id: 28, naam: 'Frikandel XXL' },
	{ id: 29, naam: 'Loempia' },
	{ id: 30, naam: 'Mexicano XXL' },
	{ id: 31, naam: 'Kipcornwrap' },
	{ id: 32, naam: 'Mexicano wrap' },

];

/**
 * Returns true als de snacknaam bestaat
 *
 * @param {string} snackNaam
 * @returns {boolean} true als de snack naam bestaat
 */
export function snackNaamBestaat(snackNaam) {
	for (const { naam } of SNACKS) {
		if (snackNaam === naam) {
			return true;
		}
	}
	return false;
}

/**
 * Geef een snack terug als deze bestaat
 *
 * @param {number} id
 * @returns {import('./typedef.js').Snack|null}
 */
export function findSnackById(id) {
	for (const snack of SNACKS) {
		if (snack.id === id) {
			return snack;
		}
	}
	return null;
}

/**
 * Geef het id van een snack op basis van naam
 *
 * @param {{ naam: string }} snack
 * @returns {number} id van de snack of -1
 */
export function getSnackId(snack) {
	for (const { id, naam } of SNACKS) {
		if (snack.naam === naam) {
			return /** @type {number} */ (id);
		}
	}
	return -1;
}
