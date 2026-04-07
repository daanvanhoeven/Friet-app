import { json } from '@sveltejs/kit';

import { findBroodjeById } from '$lib/data/alles.js';
import { findFrietById } from '$lib/data/alles.js';
import { findSnackById } from '$lib/data/alles.js';

import { getBestellingen } from '$lib/server/bestellijst.js';
import { voegBestellingToe } from '$lib/server/bestellijst.js';
import { deleteBestelling } from '$lib/server/bestellijst.js';

/**
 * GET alle bestellingen ophalen
 */
export function GET({ url }) {
	// ⭐ HAAL CODE UIT URL
	const code = url.searchParams.get('code') || 'default';

	// ⭐ FILTER OP CODE
	const bestellingen = getBestellingen().filter(
		(b) => b.code === code
	);

	const result = {};

	const aantalBroodjesById = new Map();
	const aantalFrietById = new Map();
	const aantalsnackjeById = new Map();

	for (const { bestelling } of bestellingen) {
		const { friet, snack, broodje } = bestelling;

		if (broodje) {
			const broodjeId = broodje.id;
			aantalBroodjesById.set(
				broodjeId,
				(aantalBroodjesById.get(broodjeId) || 0) + 1
			);
		}

		if (friet) {
			const frietId = friet.id;
			aantalFrietById.set(
				frietId,
				(aantalFrietById.get(frietId) || 0) + 1
			);
		}

		if (snack) {
			const snackId = snack.id;
			aantalsnackjeById.set(
				snackId,
				(aantalsnackjeById.get(snackId) || 0) + 1
			);
		}
	}

	const broodjes = [];

	for (const [id, aantal] of aantalBroodjesById.entries()) {
		const broodje = findBroodjeById(id);

		if (broodje) {
			broodjes.push({ aantal, broodje });
		}
	}

	const frietje = [];

	for (const [id, aantal] of aantalFrietById.entries()) {
		const friet = findFrietById(id);

		if (friet) {
			frietje.push({ aantal, friet });
		}
	}

	const snackje = [];

	for (const [id, aantal] of aantalsnackjeById.entries()) {
		const snack = findSnackById(id);

		if (snack) {
			snackje.push({ aantal, snack });
		}
	}

	// Verrijk bestellingen
	const enrichedBestellingen = bestellingen.map((b) => {
		const bestelling = { ...b.bestelling };

		if (bestelling.broodje?.id) {
			bestelling.broodje =
				findBroodjeById(bestelling.broodje.id) ||
				bestelling.broodje;
		}

		if (bestelling.friet?.id) {
			bestelling.friet =
				findFrietById(bestelling.friet.id) ||
				bestelling.friet;
		}

		if (bestelling.snack?.id) {
			bestelling.snack =
				findSnackById(bestelling.snack.id) ||
				bestelling.snack;
		}

		return {
			...b,
			bestelling
		};
	});

	result.broodjes = broodjes;
	result.friet = frietje;
	result.snacks = snackje;
	result.bestellingen = enrichedBestellingen;

	return json(result);
}

/**
 * POST nieuwe bestelling toevoegen
 */
export async function POST({ request }) {
	const data = await request.json();

	
	const { naam, bestelling, code = 'default' } = data;

	const result = voegBestellingToe({
		naam,
		bestelling,
		code
	});

	if (result.error) {
		return json(
			{ error: result.error },
			{ status: 400 }
		);
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
		return json(
			{ error: 'Geen id opgegeven' },
			{ status: 400 }
		);
	}

	deleteBestelling(id);

	return json({ ok: true });
}