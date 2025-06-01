<script lang="ts">
	import { X, Sword, Calendar, Users, MapPin, Upload, Image as ImageIcon } from '@lucide/svelte';
	import { battleService } from '$lib/store/battles.svelte';
	import { authStore } from '$lib/store/auth.svelte';
	import { createEventDispatcher } from 'svelte';
	import type { Planet } from '$lib/types';

	type Props = {
		isOpen: boolean;
		planets: Planet[];
	};

	let { isOpen, planets }: Props = $props();

	let battles = battleService();

	const dispatch = createEventDispatcher();

	let isLoading = $state(false);
	let error = $state('');
	let success = $state('');

	// Form data
	let selectedPlanet = $state('');
	let battleType = $state('Combat Patrol');
	let points = $state(1000);
	let attacker = $state('');
	let defender = $state('');
	let result = $state<'Attacker Victory' | 'Defender Victory' | 'Draw'>('Attacker Victory');
	let description = $state('');
	let battleDate = $state(new Date().toISOString().split('T')[0]);
	let images: File[] = $state([]);

	const battleTypes = [
		'Combat Patrol',
		'Incursion',
		'Strike Force',
		'Onslaught',
		'Siege Warfare',
		'Planetary Assault',
		'Void Battle',
		'Boarding Action'
	];

	const factions = [
		'Astra Militarum',
		'Space Marines',
		'Chaos Space Marines',
		'Orks',
		'Eldar',
		'Dark Eldar',
		'Tau Empire',
		'Necrons',
		'Tyranids'
	];

	async function handleSubmit() {
		if (isLoading) return;

		error = '';
		success = '';
		isLoading = true;

		try {
			if (!$authStore.user) {
				throw new Error('Must be authenticated to submit battles');
			}

			if (!selectedPlanet || !attacker || !defender) {
				throw new Error('Please fill in all required fields');
			}

			// Convert date to Imperial format
			const date = new Date(battleDate);
			const imperialDate = `${date.getFullYear()}.${date.getDate().toString().padStart(3, '0')}.M42`;

			const battleData = {
				date: imperialDate,
				attacker,
				defender,
				result,
				type: battleType,
				points,
				planet_id: selectedPlanet,
				submitted_by: $authStore.user.id,
				description: description.trim() || undefined,
				images: images.length > 0 ? images.map((f) => f.name) : undefined
			};

			await battles.submitBattle(battleData);

			success = 'Battle report submitted successfully!';
			resetForm();

			setTimeout(() => {
				dispatch('close');
				success = '';
			}, 2000);
		} catch (err: any) {
			error = err.message || 'Failed to submit battle report';
		} finally {
			isLoading = false;
		}
	}

	function resetForm() {
		selectedPlanet = '';
		battleType = 'Combat Patrol';
		points = 1000;
		attacker = '';
		defender = '';
		result = 'Attacker Victory';
		description = '';
		battleDate = new Date().toISOString().split('T')[0];
		images = [];
	}

	function handleClose() {
		dispatch('close');
		resetForm();
		error = '';
		success = '';
	}

	function handleImageUpload(event: Event) {
		const input = event.target as HTMLInputElement;
		if (input.files) {
			images = Array.from(input.files).slice(0, 5); // Limit to 5 images
		}
	}

	function removeImage(index: number) {
		images = images.filter((_, i) => i !== index);
	}
</script>

<!-- Backdrop -->
<div
	class="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/80 p-4"
	onclick={handleClose}
	role="dialog"
	aria-modal="true"
>
	<!-- Modal -->
	<div
		class="relative my-8 w-full max-w-2xl rounded-lg border-2 border-red-600 bg-gradient-to-b from-gray-900 to-black shadow-2xl"
		onclick={(e) => e.stopPropagation()}
	>
		<!-- Header -->
		<div
			class="flex items-center justify-between border-b-2 border-red-600 bg-gradient-to-r from-red-900 via-gray-900 to-red-900 p-4"
		>
			<div class="flex items-center gap-3">
				<Sword class="text-red-400" size={24} />
				<h2 class="text-xl font-bold tracking-wider text-red-300">
					++ BATTLE REPORT SUBMISSION ++
				</h2>
			</div>
			<button onclick={handleClose} class="text-red-300 transition-colors hover:text-red-500">
				<X size={20} />
			</button>
		</div>

		<!-- Form Content -->
		<div class="max-h-[70vh] overflow-y-auto p-6">
			<form
				onsubmit={(e) => {
					e.preventDefault();
					handleSubmit();
				}}
				class="space-y-6"
			>
				{#if error}
					<div class="rounded border border-red-500 bg-red-900/20 p-3 text-sm text-red-300">
						{error}
					</div>
				{/if}

				{#if success}
					<div class="rounded border border-green-500 bg-green-900/20 p-3 text-sm text-green-300">
						{success}
					</div>
				{/if}

				<!-- Planet Selection -->
				<div class="grid gap-4 md:grid-cols-2">
					<div>
						<label for="planet" class="mb-2 block text-sm font-bold text-red-300">
							<MapPin class="mr-1 inline" size={16} />
							THEATER OF WAR *
						</label>
						<select
							id="planet"
							bind:value={selectedPlanet}
							class="w-full rounded border border-gray-600 bg-gray-800 px-4 py-2 text-red-100 focus:border-red-500 focus:outline-none"
							required
						>
							<option value="">Select battlefield...</option>
							{#each planets as planet}
								<option value={planet.id}>{planet.name} - {planet.sector}</option>
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
							type="number"
							bind:value={points}
							min="500"
							max="5000"
							step="250"
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
							bind:value={attacker}
							class="w-full rounded border border-gray-600 bg-gray-800 px-4 py-2 text-red-100 focus:border-red-500 focus:outline-none"
							required
						>
							<option value="">Select attacker...</option>
							{#each factions as faction}
								<option value={faction}>{faction}</option>
							{/each}
						</select>
					</div>

					<div>
						<label for="defender" class="mb-2 block text-sm font-bold text-red-300">
							<Users class="mr-1 inline" size={16} />
							DEFENDING FORCE *
						</label>
						<select
							id="defender"
							bind:value={defender}
							class="w-full rounded border border-gray-600 bg-gray-800 px-4 py-2 text-red-100 focus:border-red-500 focus:outline-none"
							required
						>
							<option value="">Select defender...</option>
							{#each factions as faction}
								<option value={faction}>{faction}</option>
							{/each}
						</select>
					</div>
				</div>

				<!-- Battle Result -->
				<div>
					<label class="mb-2 block text-sm font-bold text-red-300"> ENGAGEMENT OUTCOME </label>
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
						bind:value={description}
						placeholder="Provide tactical analysis, notable events, or battlefield conditions..."
						rows="4"
						class="w-full resize-none rounded border border-gray-600 bg-gray-800 px-4 py-2 text-red-100 placeholder-gray-400 focus:border-red-500 focus:outline-none"
					></textarea>
				</div>

				<!-- Image Upload -->
				<div>
					<label class="mb-2 block text-sm font-bold text-red-300">
						<ImageIcon class="mr-1 inline" size={16} />
						BATTLE DOCUMENTATION (Optional)
					</label>
					<div class="space-y-3">
						<input
							type="file"
							accept="image/*"
							multiple
							onchange={handleImageUpload}
							class="w-full rounded border border-gray-600 bg-gray-800 px-4 py-2 text-red-100 file:mr-4 file:rounded file:border-0 file:bg-red-700 file:px-3 file:py-1 file:text-sm file:text-white hover:file:bg-red-600"
						/>

						{#if images.length > 0}
							<div class="grid grid-cols-2 gap-2 md:grid-cols-3">
								{#each images as image, index}
									<div class="relative rounded border border-gray-600 bg-gray-800 p-2">
										<div class="flex items-center gap-2">
											<ImageIcon size={16} class="text-gray-400" />
											<span class="truncate text-xs text-gray-300">{image.name}</span>
										</div>
										<button
											type="button"
											onclick={() => removeImage(index)}
											class="absolute -top-1 -right-1 rounded-full bg-red-600 p-1 text-white hover:bg-red-700"
										>
											<X size={12} />
										</button>
									</div>
								{/each}
							</div>
						{/if}
					</div>
				</div>

				<!-- Submit Button -->
				<div class="border-t border-gray-700 pt-6">
					<button
						type="submit"
						disabled={isLoading}
						class="w-full rounded bg-gradient-to-r from-red-700 to-red-600 px-4 py-3 font-bold text-yellow-100 transition-colors hover:from-red-600 hover:to-red-500 disabled:cursor-not-allowed disabled:opacity-50"
					>
						{#if isLoading}
							<Upload class="mr-2 inline animate-spin" size={18} />
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
</div>
