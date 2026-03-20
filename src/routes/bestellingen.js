/**
 * Voegt een bestelling toe aan de lijst met bestellingen.
 * 
 * Als een bestelling met dezelfde snack en friet al bestaat:
 * - wordt de naam toegevoegd aan de namenlijst
 * - wordt het aantal met 1 verhoogd dus 1 > 2
 * 
 * Anders wordt er een nieuwe bestelling gemaakt.
 *
 * @param {Array} bestellingen - De lijst met bestellingen.
 * @param {string} naamInput - De naam van de persoon die bestelt.
 * @param {string} snackInput - De gekozen snack.
 * @param {string} frietInput - De gekozen friet.
 * 
 * @returns {Array} De bijgewerkte lijst met bestellingen.
 */
export function addBestelling(bestellingen, naamInput, snackInput, frietInput) {
	if (naamInput.trim() === '') return bestellingen;

	let gevondenIndex = -1;

	for (let i = 0; i < bestellingen.length; i += 1) {
		if (bestellingen[i].snack === snackInput && bestellingen[i].friet === frietInput) {
			gevondenIndex = i;
		}
	}

	if (gevondenIndex !== -1) {
		bestellingen[gevondenIndex].naam.push(naamInput);
		bestellingen[gevondenIndex].aantal++;
	} else {
		let bestelling = {
			naam: [naamInput],
			snack: snackInput,
			friet: frietInput,
			aantal: 1
		};

		bestellingen.push(bestelling);
	}

	return bestellingen;
}