<script>
	import { goto } from '$app/navigation';

	let bestaandeCode = '';
	let error = '';

	// Genereer random code
	function genereerCode() {
		const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
		let code = '';

		for (let i = 0; i < 6; i++) {
			code += chars[Math.floor(Math.random() * chars.length)];
		}

		return code;
	}

	// Ga naar bestaande bestelling
	function gaNaarBestelling() {
		if (!bestaandeCode.trim()) {
			error = 'Vul een code in';
			return;
		}

		error = '';

		goto(`/bestellen?code=${bestaandeCode}`);
	}

	// Maak nieuwe bestelling
	function maakNieuweBestelling() {
		const nieuweCode = genereerCode();

		goto(`/bestellen?code=${nieuweCode}`);
	}
</script>

<div class="flex min-h-screen items-center justify-center bg-gray-100">
	<div class="w-full max-w-md rounded-lg bg-white p-6 shadow-md">
		<h1 class="mb-6 text-center text-2xl font-semibold">Welkom bij de Snackbar bestel app</h1>

		<!-- Bestaande bestelling -->
		<div class="mb-6">
			<h2 class="mb-2 font-semibold">Bestaande bestelling openen</h2>

			<input
				class="mb-2 w-full rounded border p-2"
				placeholder="Voer code in"
				bind:value={bestaandeCode}
			/>

			<button
				class="w-full rounded bg-blue-500 py-2 text-white hover:bg-blue-600"
				on:click={gaNaarBestelling}
			>
				Ga naar bestelling
			</button>

			{#if error}
				<p class="mt-2 text-sm text-red-500">
					{error}
				</p>
			{/if}
		</div>

		<hr class="my-6" />

		<!-- Nieuwe bestelling -->
		<div>
			<h2 class="mb-2 font-semibold">Nieuwe bestelling maken</h2>

			<button
				class="w-full rounded bg-green-500 py-2 text-white hover:bg-green-600"
				on:click={maakNieuweBestelling}
			>
				 Nieuwe bestelling starten
			</button>
		</div>
	</div>
</div>
