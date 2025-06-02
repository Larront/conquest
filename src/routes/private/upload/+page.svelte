<script lang="ts">
	import { X, Sword, Calendar, MapPin, Upload, Shield, LoaderCircle } from '@lucide/svelte';

	let { data } = $props();
	let { planets, profiles } = $derived(data);

	let isLoading = $state(false);

	// Form data
	let selectedPlanet = $state('');
	let battleType = $state('Combat Patrol');
	let points = $state(1000);
	let attacker = $state('');
	let attackerPoints = $state(0);
	let defender = $state('');
	let defenderPoints = $state(0);
	let result = $state<'Attacker Victory' | 'Defender Victory' | 'Draw'>('Attacker Victory');
	let description = $state('');
	let battleDate = $state(new Date().toISOString().split('T')[0]);

	const battleTypes = ['Combat Patrol', 'Incursion', 'Strike Force', 'Onslaught'];
</script>

<div
	class="relative top-[50%] left-[50%] my-8 w-full max-w-2xl translate-x-[-50%] translate-y-[-50%] rounded-lg border-2 border-red-600 bg-gradient-to-b from-gray-900 to-black shadow-2xl"
>
	<!-- Header -->
	<div
		class="flex items-center justify-between rounded-t-lg border-b-2 border-red-600 bg-gradient-to-r from-red-900 via-gray-900 to-red-900 p-4"
	>
		<div class="flex items-center gap-3">
			<Sword class="text-red-400" size={24} />
			<h2 class="text-xl font-bold tracking-wider text-red-300">++ BATTLE REPORT SUBMISSION ++</h2>
		</div>
		<a href="/" class="text-red-300 transition-colors hover:text-red-500">
			<X size={20} />
		</a>
	</div>

	<!-- Form Content -->
	<div class="max-h-[70vh] overflow-y-auto p-6">
		<form method="POST" action={'?/update'} onsubmit={() => (isLoading = true)} class="space-y-6">
			<!-- Planet Selection -->
			<div class="grid gap-4 md:grid-cols-2">
				<div>
					<label for="selectedPlanet" class="mb-2 block text-sm font-bold text-red-300">
						<MapPin class="mr-1 inline" size={16} />
						THEATER OF WAR *
					</label>
					<select
						id="selectedPlanet"
						name="selectedPlanet"
						bind:value={selectedPlanet}
						class="w-full rounded border border-gray-600 bg-gray-800 px-4 py-2 text-red-100 focus:border-red-500 focus:outline-none"
						required
					>
						<option value="">Select battlefield...</option>
						{#each planets as planet}
							<option value={planet.id}>{planet.name}</option>
						{/each}
					</select>
				</div>

				<div>
					<label for="battleDate" class="mb-2 block text-sm font-bold text-red-300">
						<Calendar class="mr-1 inline" size={16} />
						DATE OF ENGAGEMENT
					</label>
					<input
						id="battleDate"
						name="battleDate"
						type="date"
						bind:value={battleDate}
						class="w-full rounded border border-gray-600 bg-gray-800 px-4 py-2 text-red-100 focus:border-red-500 focus:outline-none"
					/>
				</div>
			</div>

			<!-- Battle Details -->
			<div class="grid gap-4 md:grid-cols-2">
				<div>
					<label for="battleType" class="mb-2 block text-sm font-bold text-red-300">
						ENGAGEMENT TYPE
					</label>
					<select
						id="battleType"
						name="battleType"
						bind:value={battleType}
						class="w-full rounded border border-gray-600 bg-gray-800 px-4 py-2 text-red-100 focus:border-red-500 focus:outline-none"
					>
						{#each battleTypes as type}
							<option value={type}>{type}</option>
						{/each}
					</select>
				</div>

				<div>
					<label for="points" class="mb-2 block text-sm font-bold text-red-300">
						FORCE STRENGTH (POINTS)
					</label>
					<input
						id="points"
						name="points"
						type="number"
						bind:value={points}
						min="500"
						max="2000"
						step="500"
						class="w-full rounded border border-gray-600 bg-gray-800 px-4 py-2 text-red-100 focus:border-red-500 focus:outline-none"
					/>
				</div>
			</div>

			<!-- Combatants -->
			<div class="grid gap-4 md:grid-cols-2">
				<div>
					<label for="attacker" class="mb-2 block text-sm font-bold text-red-300">
						<Sword class="mr-1 inline" size={16} />
						ATTACKING FORCE *
					</label>
					<select
						id="attacker"
						name="attacker"
						bind:value={attacker}
						class="w-full rounded border border-gray-600 bg-gray-800 px-4 py-2 text-red-100 focus:border-red-500 focus:outline-none"
						required
					>
						<option value="">Select attacker...</option>
						{#each profiles as profile}
							<option value={profile.id}>{profile.username} - {profile.faction}</option>
						{/each}
					</select>
				</div>

				<div>
					<label for="defender" class="mb-2 block text-sm font-bold text-red-300">
						<Shield class="mr-1 inline" size={16} />
						DEFENDING FORCE *
					</label>
					<select
						id="defender"
						name="defender"
						bind:value={defender}
						class="w-full rounded border border-gray-600 bg-gray-800 px-4 py-2 text-red-100 focus:border-red-500 focus:outline-none"
						required
					>
						<option value="">Select defender...</option>
						{#each profiles as profile}
							<option value={profile.id}>{profile.username} - {profile.faction}</option>
						{/each}
					</select>
				</div>
			</div>

			<div class="grid gap-4 md:grid-cols-2">
				<div>
					<label for="attackerPoints" class="mb-2 block text-sm font-bold text-red-300">
						<Sword class="mr-1 inline" size={16} />
						ATTACKER POINTS *
					</label>
					<input
						id="attackerPoints"
						name="attackerPoints"
						bind:value={attackerPoints}
						type="number"
						min="0"
						max="100"
						class="w-full rounded border border-gray-600 bg-gray-800 px-4 py-2 text-red-100 focus:border-red-500 focus:outline-none"
					/>
				</div>

				<div>
					<label for="defenderPoints" class="mb-2 block text-sm font-bold text-red-300">
						<Shield class="mr-1 inline" size={16} />
						DEFENDER POINTS *
					</label>
					<input
						id="defenderPoints"
						name="defenderPoints"
						bind:value={defenderPoints}
						type="number"
						min="0"
						max="100"
						class="w-full rounded border border-gray-600 bg-gray-800 px-4 py-2 text-red-100 focus:border-red-500 focus:outline-none"
					/>
				</div>
			</div>

			<!-- Battle Result -->
			<div>
				<legend class="mb-2 block text-sm font-bold text-red-300"> ENGAGEMENT OUTCOME </legend>
				<div class="grid grid-cols-3 gap-2">
					<label class="cursor-pointer">
						<input
							type="radio"
							name="result"
							value="Attacker Victory"
							bind:group={result}
							class="sr-only"
						/>
						<div
							class="rounded border border-gray-600 bg-gray-800 p-3 text-center transition-colors {result ===
							'Attacker Victory'
								? 'border-red-500 bg-red-900/20 text-red-300'
								: 'text-gray-300 hover:bg-gray-700'}"
						>
							Attacker Victory
						</div>
					</label>

					<label class="cursor-pointer">
						<input
							type="radio"
							name="result"
							value="Defender Victory"
							bind:group={result}
							class="sr-only"
						/>
						<div
							class="rounded border border-gray-600 bg-gray-800 p-3 text-center transition-colors {result ===
							'Defender Victory'
								? 'border-green-500 bg-green-900/20 text-green-300'
								: 'text-gray-300 hover:bg-gray-700'}"
						>
							Defender Victory
						</div>
					</label>

					<label class="cursor-pointer">
						<input type="radio" name="result" value="Draw" bind:group={result} class="sr-only" />
						<div
							class="rounded border border-gray-600 bg-gray-800 p-3 text-center transition-colors {result ===
							'Draw'
								? 'border-yellow-500 bg-yellow-900/20 text-yellow-300'
								: 'text-gray-300 hover:bg-gray-700'}"
						>
							Draw
						</div>
					</label>
				</div>
			</div>

			<!-- Battle Description -->
			<div>
				<label for="description" class="mb-2 block text-sm font-bold text-red-300">
					ENGAGEMENT REPORT (Optional)
				</label>
				<textarea
					id="description"
					name="description"
					bind:value={description}
					placeholder="Provide tactical analysis, notable events, or battlefield conditions..."
					rows="4"
					class="w-full resize-none rounded border border-gray-600 bg-gray-800 px-4 py-2 text-red-100 placeholder-gray-400 focus:border-red-500 focus:outline-none"
				></textarea>
			</div>

			<!-- Submit Button -->
			<div class="border-t border-gray-700 pt-6">
				<button
					type="submit"
					disabled={isLoading}
					class="w-full rounded bg-gradient-to-r from-red-700 to-red-600 px-4 py-3 font-bold text-yellow-100 transition-colors hover:from-red-600 hover:to-red-500 disabled:cursor-not-allowed disabled:opacity-50"
				>
					{#if isLoading}
						<LoaderCircle class="mr-2 inline animate-spin" size={18} />
						TRANSMITTING REPORT...
					{:else}
						<Upload class="mr-2 inline" size={18} />
						SUBMIT BATTLE REPORT
					{/if}
				</button>
			</div>
		</form>
	</div>
</div>
