import { json } from '@sveltejs/kit';

import { findBroodjeById } from '$lib/data/alles.js';
import { findFrietById } from '$lib/data/alles.js';
import { findSnackById } from '$lib/data/alles.js';
import { bestaatCode } from '$lib/server/bestellijst.js';

import { getBestellingen, voegBestellingToe, deleteBestelling } from '$lib/server/bestellijst.js';
import { bestaatCode, maakBestellijst } from '$lib/server/bestellijst.js';
/**
 * GET bestellingen per code
 */
export function GET({ url }) {
	const code = url.searchParams.get('code');

	if (!code) {
		return json({ bestellingen: [] });
	}

	
	if (!bestaatCode(code)) {
		return json({ error: 'Code bestaat niet' }, { status: 404 });
	}

	const bestellingen = getBestellingen().filter((b) => b.code === code);

	return json({ bestellingen });
}

import { bestaatCode, maakBestellijst } from '$lib/server/bestellijst.js';

export async function POST({ request }) {
	const data = await request.json();

	//  als lijst nog niet bestaat , maak hem aan

	const result = voegBestellingToe({
		naam: data.naam,
		bestelling: data.bestelling,
		code: data.code
	});

	if (result.error) {
		return json({ error: result.error }, { status: 400 });
	}

	return json({ ok: true });
}

export async function DELETE({ request }) {
	const data = await request.json();

	deleteBestelling(data.id);

	return json({ ok: true });
}

export async function PUT({ request }) {
	const data = await request.json();

	if (!data.code) {
		return json({ error: 'Geen code' }, { status: 400 });
	}

	// Maak lijst aan zonder bestelling
	maakBestellijst(data.code);

	return json({ ok: true });
}
