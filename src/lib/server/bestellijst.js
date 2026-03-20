let bestellingen = [];

/**
 * Haal alle bestellingen op
 */
export function getBestellingen() {
	return bestellingen;
}

/**
 *
 */
export function addBestelling(data) {
	const naamInput = data.naam;

	let gevondenIndex = -1;

	for (let i = 0; i < bestellingen.length; i++) {
		if (
			bestellingen[i].snack === data.snack &&
			bestellingen[i].friet === data.friet &&
			bestellingen[i].broodje === data.broodje &&
			bestellingen[i].saus === data.saus
		) {
			gevondenIndex = i;
		}
	}

	if (gevondenIndex !== -1) {
		bestellingen[gevondenIndex].naam.push(naamInput);
		bestellingen[gevondenIndex].aantal++;
	} else {
		bestellingen.push({
			id: Date.now(),
			naam: [data.naam],
			snack: data.snack,
			friet: data.friet,
			broodje: data.broodje,
			saus: data.saus,
			aantal: 1
		});
	}
}

/**
 * Verwijderen
 */
export function deleteBestelling(id) {
	bestellingen = bestellingen.filter((b) => b.id !== id);
}
