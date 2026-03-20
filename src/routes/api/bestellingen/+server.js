import { getBestellingen, addBestelling, deleteBestelling } from '$lib/server/bestellijst.js';

/**
 * GET  alle bestellingen ophalend
 */
export function GET() {
	return new Response(JSON.stringify(getBestellingen()), {
		headers: { 'Content-Type': 'application/json' }
	});
}

/**
 * POST  nieuwe bestelling toevoegen
 */
export async function POST({ request }) {
	const data = await request.json();

	const nieuweBestelling = addBestelling(data);

	return new Response(JSON.stringify(nieuweBestelling), {
		headers: { 'Content-Type': 'application/json' }
	});
}

/**
 * DELETE  bestelling verwijderen
 */
export async function DELETE({ request }) {
	const data = await request.json();

	deleteBestelling(data.id);

	return new Response(JSON.stringify({ success: true }), {
		headers: { 'Content-Type': 'application/json' }
	});
}
