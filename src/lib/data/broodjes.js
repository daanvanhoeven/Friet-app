// export const broodjes = ['hard wit', 'hard bruin', 'zacht wit', 'zacht bruin'];

/**
 * @type {import('./typedef.js').Broodje[]}
 */
export const BROODJES = [
	{
		id: 1,
		naam: 'Hard bruin broodje gezond Vega',
		beleg: 'gezond',
		hardOfZacht: 'hard',
		witOfBruin: 'bruin',
		vega: true
	},
	{
		id: 2,
		naam: 'Hard wit broodje gezond Vega',
		beleg: 'gezond',
		hardOfZacht: 'hard',
		witOfBruin: 'wit',
		vega: true
	},
	
	{
		id: 3,
		naam: 'Wit broodje kroket',
		beleg: 'kroket',
		hardOfZacht: 'zacht',
		witOfBruin: 'wit',
		vega: false
	},
	{
		id: 4,
		naam: 'Bruin broodje kroket',
		beleg: 'kroket',
		hardOfZacht: 'zacht',
		witOfBruin: 'bruin',
		vega: false
	},
	{
		id: 5,
		naam: 'Bruin broodje Frikandel',
		beleg: 'frikandel',
		hardOfZacht: 'zacht',
		witOfBruin: 'bruin',
		vega: false
	},
	{
		id: 6,
		naam: 'Wit broodje Frikandel',
		beleg: 'frikandel',
		hardOfZacht: 'zacht',
		witOfBruin: 'wit',
		vega: false
	}
];

/**
 * Returns het id of het broodje of -1 als het niet bestaat
 *
 * @param {import('./typedef.js').Broodje} broodje
 *
 * @returns {number} broodje id of -1
 */
export function getBroodjeId(broodje) {
	for (const { id, beleg, hardOfZacht, witOfBruin, vega } of BROODJES) {
		if (
			broodje.beleg === beleg &&
			broodje.hardOfZacht === hardOfZacht &&
			broodje.witOfBruin === witOfBruin &&
			broodje.vega === vega
		) {
			return /** @type {number} */ (id);
		}
	}

	return -1;
}

/**
 * Geef een broodje terug als deze bestaat
 *
 * @param {number} id
 *
 * @returns {import('./typedef.js').Broodje|null}
 */
export function findBroodjeById(id) {
	for (const broodje of BROODJES) {
		if (broodje.id === id) {
			return broodje;
		}
	}

	return null;
}
