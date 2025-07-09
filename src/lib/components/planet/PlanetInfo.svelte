<script lang="ts">
	import { Sword, MapPin, Calendar, Skull, Shield } from '@lucide/svelte';
	// Dynamic import for d3-scale-chromatic to reduce initial bundle size
	let schemeTableau10: readonly string[] = $state([]);

	// Load color scheme dynamically
	$effect(() => {
		import('d3-scale-chromatic')
			.then((module) => {
				schemeTableau10 = module.schemeTableau10;
			})
			.catch((error) => {
				console.error('Failed to load color scheme:', error);
				// Fallback color scheme
				schemeTableau10 = [
					'#1f77b4',
					'#ff7f0e',
					'#2ca02c',
					'#d62728',
					'#9467bd',
					'#8c564b',
					'#e377c2',
					'#7f7f7f',
					'#bcbd22',
					'#17becf'
				] as const;
			});
	});
	import type { Planet } from '$lib/types';

	interface Props {
		planet: Planet;
	}

	let { planet }: Props = $props();

	// Dynamic import for PieChart to reduce initial bundle size
	let PieChart: any = $state();
	let isChartLoading = $state(true);

	// Load PieChart dynamically when component mounts
	$effect(() => {
		import('layerchart')
			.then((module) => {
				PieChart = module.PieChart;
				updateChartLoadingState();
			})
			.catch((error) => {
				console.error('Failed to load PieChart:', error);
				updateChartLoadingState();
			});
	});

	// Update loading state when both chart and colors are ready
	function updateChartLoadingState() {
		isChartLoading = !(PieChart && schemeTableau10.length > 0);
	}

	// Watch for color scheme changes
	$effect(() => {
		if (schemeTableau10.length > 0) {
			updateChartLoadingState();
		}
	});

	const getResultColor = (result: string) => {
		switch (result) {
			case 'Attacker Victory':
				return 'text-red-600 bg-red-50';
			case 'Defender Victory':
				return 'text-green-600 bg-green-50';
			case 'Draw':
				return 'text-yellow-600 bg-yellow-50';
			default:
				return 'text-gray-600 bg-gray-50';
		}
	};
</script>

<div
	class="h-full overflow-y-auto rounded-lg border-l border-gray-700 bg-black/50 backdrop-blur-sm"
>
	<div
		class="flex h-full min-w-80 flex-col rounded-lg bg-gradient-to-b from-gray-900 to-black shadow-2xl transition-all duration-300"
	>
		<!-- {/* Gothic Header */} -->
		<div
			class="flex items-center justify-between rounded-t-lg border-b-2 border-yellow-600 bg-gradient-to-r from-red-900 via-gray-900 to-red-900 p-4 text-yellow-200"
		>
			<div class="flex items-center gap-3">
				<Skull class="text-red-400" size={24} />
				<div>
					<h2 class="text-xl font-bold tracking-wider">{planet.name.toUpperCase()}</h2>
					<div class="flex items-center gap-2 text-sm text-yellow-300">
						<MapPin size={14} />
						<span class="tracking-wide">{planet.sector}</span>
						<span class="mx-1">•</span>
						<span class="tracking-wide">{planet.classification}</span>
					</div>
				</div>
			</div>
		</div>

		<!-- {/* Scrollable Gothic Content */} -->
		<div class="h-full flex-1 space-y-4 overflow-y-auto p-4 text-yellow-100">
			<!-- {/* Planet Information */} -->
			<div class="bg-opacity-50 rounded border border-yellow-600 bg-gray-900 p-4">
				<h3
					class="mb-3 border-b border-yellow-600 pb-2 text-lg font-bold tracking-wider text-yellow-300"
				>
					++ PLANETARY DATA ++
				</h3>

				<p class="mb-4 text-sm leading-relaxed text-yellow-100 italic">
					{planet.description}
				</p>

				<div class="space-y-2 font-mono text-sm">
					{#each [['POPULATION', planet.population], ['TITHE GRADE', planet.tithe], ['CLASSIFICATION', planet.climate], ['GOVERNMENT', planet.government]] as [label, value] (label)}
						<div class="flex justify-between border-b border-gray-700 py-1">
							<span class="font-bold text-yellow-300">{label}:</span>
							<span class="text-yellow-100">{value}</span>
						</div>
					{/each}
				</div>
			</div>

			<!-- {/* Faction Control Chart */} -->
			<div class="bg-opacity-50 rounded border border-red-600 bg-gray-900 p-4">
				<h3 class="mb-3 border-b border-red-600 pb-2 text-lg font-bold tracking-wider text-red-300">
					++ TERRITORIAL CONTROL ++
				</h3>
				<div class="h-[256px] w-auto overflow-auto p-4">
					{#if isChartLoading}
						<div class="flex h-full items-center justify-center">
							<div
								class="h-8 w-8 animate-spin rounded-full border-2 border-red-400 border-t-transparent"
							></div>
							<span class="ml-2 text-sm text-red-300">Loading chart...</span>
						</div>
					{:else if PieChart}
						<PieChart
							data={planet.faction_control}
							key="profile"
							placement="center"
							value="control"
							cRange={schemeTableau10}
							tooltip={false}
						/>
					{:else}
						<div class="flex h-full items-center justify-center text-red-300">
							<span class="text-sm">Failed to load chart</span>
						</div>
					{/if}
				</div>
				<div class="ml-4 flex w-full flex-col">
					{#each planet.faction_control as item, i}
						<div class="mb-2 flex items-center">
							<div
								class="mr-2 h-4 w-4 rounded"
								style="background-color: {schemeTableau10[i % schemeTableau10.length]}"
							></div>
							<span>{item.profile} - {item.control}%</span>
						</div>
					{/each}
				</div>
			</div>

			<!-- {/* Battle History */} -->
			<div class="bg-opacity-50 rounded border border-yellow-600 bg-gray-900 p-4">
				<h3
					class="mb-3 flex items-center gap-2 border-b border-yellow-600 pb-2 text-lg font-bold tracking-wider text-yellow-300"
				>
					<Skull size={18} />
					++ BATTLE RECORDS ++
				</h3>

				<div class="space-y-3">
					{#each planet.battle_history as battle (battle.id)}
						<div
							class="bg-opacity-30 hover:bg-opacity-50 rounded border border-gray-600 bg-black p-3 transition-colors hover:bg-gray-800"
						>
							<div class="mb-2 flex items-start justify-between">
								<div class="flex flex-col gap-1">
									<div class="flex items-center gap-2 text-xs">
										<Calendar size={12} class="text-yellow-400" />
										<span class="font-mono font-bold text-yellow-300"
											>{battle.battle_date.split('T')[0]}</span
										>
									</div>
									<div class="font-mono text-xs text-yellow-200">
										<span class="text-red-300">{battle.battle_type}</span>
										<span class="mx-2">•</span>
										<span>{battle.points} pts</span>
									</div>
								</div>
								<span
									class={`rounded px-2 py-1 text-xs font-bold ${getResultColor(battle.result)}`}
								>
									{battle.result}
								</span>
							</div>

							<div class="flex">
								<div class="flex items-center gap-2 text-xs">
									<Sword size={12} class="text-red-400" />
									<span class="font-bold text-red-400">{battle.attacker}</span>
									<span class="text-gray-400">vs</span>
									<Shield size={12} class="text-blue-400" />
									<span class="font-bold text-blue-400">{battle.defender}</span>
								</div>

								<div class="ml-auto flex items-center gap-2 text-xs">
									<span class="font-bold text-red-400">{battle.attacker_points}</span>
									<span class="text-gray-400">vs</span>
									<span class="font-bold text-blue-400">{battle.defender_points}</span>
								</div>
							</div>
						</div>
					{/each}
				</div>
			</div>
		</div>
	</div>
</div>
