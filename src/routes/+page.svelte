<script>
	import { goto } from '$app/navigation';

	let bestaandeCode = '';
	let error = '';

	// Genereer een random 6-letter code voor een bestelling
	function genereerCode() {
		const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
		let code = '';
		for (let i = 0; i < 6; i++) {
			code += chars[Math.floor(Math.random() * chars.length)];
		}
		return code;
	}

	async function gaNaarBestelling() {
		if (!bestaandeCode.trim()) {
			error = 'Vul eerst een code in';
			return;
		}

		const code = bestaandeCode.toLowerCase().trim();

		const res = await fetch(`/api/bestel-overzicht?code=${code}`);
		const data = await res.json();

		if (!data.error) {
			goto(`/bestellen?code=${code}`);
		} else {
			error = 'Deze code bestaat niet';
		}
	}
	// Maak een nieuwe lijst aan en stuur de gebruiker door
	async function maakNieuweBestelling() {
		const nieuweCode = genereerCode();

		await fetch('/api/bestel-overzicht', {
			method: 'PUT',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ code: nieuweCode })
		});

		goto(`/bestellen?code=${nieuweCode}`);
	}
</script>

<div class="flex min-h-screen flex-col items-center justify-start bg-gray-50 p-6 pt-12 md:pt-24">
	<div class="w-full max-w-sm">
		<div class="mb-10 text-center">
			<div>
				<span class="text-3xl"></span>
			</div>

			<h1 class="text-2xl font-extrabold text-gray-900">Snackbar Groep</h1>
		</div>

		<div class="mb-8 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
			<h2 class="mb-4 text-center text-sm font-bold tracking-wider text-gray-700 uppercase">
				Meedoen met een bestelling
			</h2>

			<div class="space-y-4">
				<input
					class="w-full rounded-xl border-2 border-gray-200 bg-gray-50 p-4 text-center text-xl font-bold text-gray-900
					uppercase transition-all focus:border-blue-500 focus:bg-white focus:outline-none"
					placeholder="CODE"
					bind:value={bestaandeCode}
				/>

				<button
					class="w-full rounded-xl bg-blue-600 py-4 font-bold text-white shadow-md transition-all hover:bg-blue-700 active:scale-[0.98]"
					on:click={gaNaarBestelling}
				>
					Ga naaar bestelling
				</button>

				{#if error}
					<p class="text-center text-sm font-bold text-red-600">
						{error}
					</p>
				{/if}
			</div>
		</div>

		<div class="mb-8 flex items-center gap-4">
			<div class="h-px flex-1 bg-gray-300"></div>

			<span class="text-xs font-bold text-gray-600 uppercase"> Of </span>

			<div class="h-px flex-1 bg-gray-300"></div>
		</div>

		<div class="text-center">
			<button
				class="w-full rounded-xl border-2 border-gray-200 bg-white font-semibold text-gray-900 transition-all hover:bg-green-50 active:scale-[0.98]"
				on:click={maakNieuweBestelling}
			>
				Nieuwe bestelling starten
			</button>

			<p class="mt-4 px-4 text-[11px] leading-relaxed text-gray-600">
				Maak een lijst aan, voeg snacks toe en laat anderen meebestellen via een QR-code.
			</p>
		</div>
	</div>
</div>
