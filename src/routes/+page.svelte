<script lang="ts">
	import type { Planet } from '$lib/types';
	import { LogIn, Plus, X } from '@lucide/svelte';
	import { slide } from 'svelte/transition';
	import UserMenu from '$lib/components/auth/UserMenu.svelte';
	import { IsMobile } from '$lib/hooks/is-mobile.svelte.js';
	import PlanetDisplay from '$lib/components/planet/PlanetDisplay.svelte';
	import ErrorBoundary from '$lib/components/ErrorBoundary.svelte';

	// Lazy load PlanetInfo component to reduce initial bundle size
	let PlanetInfo: any = $state();
	let isPlanetInfoLoading = $state(false);

	let selectedPlanet: Planet | undefined = $state();
	let planetInfoOpen = $state(false);

	let { data } = $props();
	let { planets, battles, profiles, control, factions, userFactions, user } = $derived(data);

	let isMobile = new IsMobile();

	const planetData = $derived(
		planets.map((planet) => ({
			angle: Math.floor(Math.random() * (359 - 0 + 1) + 0),
			faction_control: control
				.filter((entry) => entry.planet == planet.id)
				.map((control) => {
					// Try to find user faction first, fallback to profile-based control
					if (control.user_faction_id) {
						const userFaction = userFactions.find((uf) => uf.id == control.user_faction_id);
						return {
							...control,
							profile: userFaction
								? `${userFaction.faction_display_name} (${userFaction.profiles.username})`
								: 'Unknown'
						};
					} else {
						// Fallback for legacy control entries
						return {
							...control,
							profile:
								profiles.find((profile) => profile.id == control.profile)?.faction || 'Contested'
						};
					}
				}),
			battle_history: battles
				.filter((battle) => battle.planet == planet.id)
				.map((battle) => {
					// Try to get user faction names for battles with user_faction_id
					let attackerName = '';
					let defenderName = '';

					if (battle.attacker_user_faction_id) {
						const attackerFaction = userFactions.find(
							(uf) => uf.id == battle.attacker_user_faction_id
						);
						attackerName = attackerFaction
							? `${attackerFaction.profiles.username} (${attackerFaction.faction_display_name})`
							: profiles.find((profile) => profile.id == battle.attacker)?.faction +
								' - ' +
								profiles.find((profile) => profile.id == battle.attacker)?.username;
					} else {
						// Fallback for legacy battles
						attackerName =
							profiles.find((profile) => profile.id == battle.attacker)?.faction +
							' - ' +
							profiles.find((profile) => profile.id == battle.attacker)?.username;
					}

					if (battle.defender_user_faction_id) {
						const defenderFaction = userFactions.find(
							(uf) => uf.id == battle.defender_user_faction_id
						);
						defenderName = defenderFaction
							? `${defenderFaction.profiles.username} (${defenderFaction.faction_display_name})`
							: profiles.find((profile) => profile.id == battle.defender)?.faction +
								' - ' +
								profiles.find((profile) => profile.id == battle.defender)?.username;
					} else {
						// Fallback for legacy battles
						defenderName =
							profiles.find((profile) => profile.id == battle.defender)?.faction +
							' - ' +
							profiles.find((profile) => profile.id == battle.defender)?.username;
					}

					return {
						...battle,
						attacker: attackerName,
						defender: defenderName
					};
				}),
			...planet
		}))
	);

	async function selectPlanet(planet: Planet) {
		selectedPlanet = planet;
		planetInfoOpen = true;

		// Lazy load PlanetInfo component if not already loaded
		if (!PlanetInfo && !isPlanetInfoLoading) {
			isPlanetInfoLoading = true;
			try {
				const module = await import('$lib/components/planet/PlanetInfo.svelte');
				PlanetInfo = module.default;
			} catch (error) {
				console.error('Failed to load PlanetInfo component:', error);
				// Show error state instead of component
				PlanetInfo = null;
			} finally {
				isPlanetInfoLoading = false;
			}
		}
	}

	function getPlanetPosition(distance: string, angle: number) {
		const centerX = 50;
		const centerY = 50;
		const radius = parseFloat(distance) * 0.8;
		const radian = (angle * Math.PI) / 180;

		const x = centerX + radius * Math.cos(radian);
		const y = centerY + radius * Math.sin(radian);

		return { x, y };
	}
</script>

<div
	class="relative h-full w-full overflow-hidden bg-gradient-to-br from-gray-900 via-red-950 to-black"
>
	<!-- Enhanced Stars background with twinkling -->
	<div class="absolute inset-0 opacity-60">
		{#each Array(150) as _, i}
			<div
				class="animate-twinkle absolute rounded-full bg-white"
				class:w-0.5={i % 4 === 0}
				class:h-0.5={i % 4 === 0}
				class:w-1={i % 4 === 1}
				class:h-1={i % 4 === 1}
				class:w-1.5={i % 4 === 2}
				class:h-1.5={i % 4 === 2}
				class:w-px={i % 4 === 3}
				class:h-px={i % 4 === 3}
				style="left: {Math.random() * 100}%; top: {Math.random() *
					100}%; animation-delay: {Math.random() * 4}s; animation-duration: {2 +
					Math.random() * 3}s;"
			></div>
		{/each}
	</div>

	<!-- Nebula effects -->
	<div class="absolute inset-0 opacity-20">
		<div
			class="absolute top-1/4 left-1/4 h-96 w-96 animate-pulse rounded-full bg-purple-600 blur-3xl filter"
		></div>
		<div
			class="absolute right-1/4 bottom-1/3 h-80 w-80 animate-pulse rounded-full bg-blue-600 blur-3xl filter"
			style="animation-delay: 2s;"
		></div>
		<div
			class="absolute top-1/2 right-1/2 h-64 w-64 animate-pulse rounded-full bg-red-600 blur-3xl filter"
			style="animation-delay: 4s;"
		></div>
	</div>

	<div class="relative z-10 flex {isMobile.current ? 'flex-col' : ''} h-screen">
		<!-- Main Solar System View -->
		<div class="relative flex-1">
			<!-- Header -->
			{#if isMobile.current}
				<div
					class="safe-area-top absolute top-0 right-0 left-0 z-50 flex border-b border-yellow-600 bg-gradient-to-b from-black via-gray-900 to-transparent p-4 text-yellow-200"
				>
					<div class="flex items-center justify-between">
						<div>
							<h1 class="{isMobile ? '' : 'text-xl'} font-bold tracking-wider">MALVERNIS SECTOR</h1>
							<p class="text-xs tracking-wide opacity-75">+ IMPERIAL RECONNAISSANCE +</p>
						</div>
					</div>
					<div
						class="ml-auto flex
						{isMobile.current ? 'flex-col' : ''}
						items-center justify-between gap-2"
					>
						{#if user}
							<a
								class="{isMobile ? 'text-xs' : ''}
									flex items-center gap-2 rounded border border-yellow-600 bg-gray-900/80 px-3 py-2 text-yellow-200 transition-colors hover:cursor-pointer hover:bg-gray-800"
								href="/private/upload"
							>
								<Plus size={18} />
								Report Battle</a
							>
							<UserMenu {user} />
						{:else}
							<a
								href="/auth"
								class="flex items-center gap-1 rounded bg-yellow-700 px-3 py-1 text-xs font-bold text-black transition-colors hover:bg-yellow-600"
							>
								<LogIn size={14} />
								ACCESS
							</a>
						{/if}
					</div>
				</div>
			{:else}
				<div
					class="bg-opacity-75 absolute top-4 left-4 z-50 rounded border border-yellow-600 bg-black p-4 text-yellow-200"
				>
					<h1 class="mb-2 text-2xl font-bold tracking-wider">MALVERNIS SECTOR</h1>
					<p class="text-sm tracking-wide opacity-75">+ IMPERIAL RECONNAISSANCE PROTOCOL +</p>
				</div>
				<div class="absolute top-4 right-4 flex gap-2">
					{#if user}
						<a
							class=" flex items-center gap-2 rounded border border-yellow-600 bg-gray-900/80 px-3 py-2 text-yellow-200 transition-colors hover:cursor-pointer hover:bg-gray-800"
							href="/private/upload"
						>
							<Plus size={18} />
							Report Battle</a
						>
						<UserMenu {user} />
					{:else}
						<a
							href="/auth"
							class="flex items-center gap-1 rounded bg-yellow-700 px-3 py-1 text-xs font-bold text-black transition-colors hover:bg-yellow-600"
						>
							<LogIn size={14} />
							ACCESS
						</a>
					{/if}
				</div>
			{/if}
			<!-- Solar System Container -->
			<div class="flex h-full w-full items-center justify-center p-4 md:p-8">
				<div
					class="relative aspect-square w-full {isMobile.current && planetInfoOpen
						? 'mt-auto max-w-32'
						: 'max-w-2xl'} flex-1 transition-all duration-300"
				>
					<!-- Enhanced Orbital paths with glow -->
					{#each planetData as planet}
						<div
							class="border-opacity-30 shadow-orbit absolute rounded-full border border-gray-600"
							style="
								width: {parseFloat(planet.distance) * 1.6}%;
								height: {parseFloat(planet.distance) * 1.6}%;
								left: {50 - parseFloat(planet.distance) * 0.8}%;
								top: {50 - parseFloat(planet.distance) * 0.8}%;
								box-shadow: inset 0 0 10px rgba(156, 163, 175, 0.2);
								"
						></div>
					{/each}

					<!-- Enhanced Sun with corona effect -->
					<div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 transform">
						<!-- Corona layers -->
						<div
							class="animate-spin-slow bg-gradient-radial absolute inset-0 -top-8 -left-8 h-32 w-32 rounded-full from-red-500/20 via-orange-500/10 to-transparent"
						></div>
						<div
							class="animate-spin-reverse bg-gradient-radial absolute inset-0 -top-6 -left-6 h-24 w-24 rounded-full from-yellow-500/30 via-red-500/20 to-transparent"
						></div>

						<!-- Main sun -->
						<div
							class="{isMobile.current && planetInfoOpen
								? 'h-6 w-6'
								: 'h-12 w-12'} shadow-sun animate-pulse rounded-full border-2 border-red-400 bg-gradient-to-r from-red-600 via-orange-500 to-yellow-500"
						></div>

						<!-- Pulsing ring -->
						<div
							class="absolute inset-0 -top-2 -left-2 h-16 w-16 animate-ping rounded-full border border-red-500 opacity-30"
						></div>
					</div>

					<!-- Planets -->
					{#each planetData as planet}
						{@const position = getPlanetPosition(planet.distance, planet.angle)}
						<PlanetDisplay
							{planet}
							{position}
							{factions}
							isCompact={planetInfoOpen && isMobile.current}
							onClick={() => selectPlanet(planet)}
						/>
					{/each}
				</div>
			</div>
		</div>

		<!-- Desktop Sidebar -->
		{#if !isMobile.current && planetInfoOpen}
			<div
				class="relative w-1/3 overflow-y-auto rounded-lg border-2 border-yellow-600 bg-black/50 backdrop-blur-sm"
				transition:slide={{ axis: 'x' }}
			>
				<button
					onclick={() => (planetInfoOpen = false)}
					class="absolute top-1 right-1 z-100 p-1 text-white transition-colors hover:text-gray-300"
					title="Close panel"
				>
					<X size={20} />
				</button>
				{#if isPlanetInfoLoading}
					<div class="flex h-64 items-center justify-center">
						<div
							class="h-8 w-8 animate-spin rounded-full border-2 border-yellow-400 border-t-transparent"
						></div>
						<span class="ml-2 text-yellow-300">Loading planet details...</span>
					</div>
				{:else if PlanetInfo && selectedPlanet}
					<ErrorBoundary>
						<PlanetInfo planet={selectedPlanet} />
					</ErrorBoundary>
				{:else}
					<div class="flex h-64 items-center justify-center text-yellow-300">
						<span>Failed to load planet details</span>
					</div>
				{/if}
			</div>
		{/if}

		<!-- Mobile Drawer -->
		{#if isMobile.current && planetInfoOpen}
			<div
				class="relative h-2/3 rounded-t-lg border-2 border-yellow-600 bg-black/50 backdrop-blur-sm"
				transition:slide={{ axis: 'y' }}
			>
				<button
					onclick={() => (planetInfoOpen = false)}
					class="absolute top-1 right-1 z-100 p-1 text-white transition-colors hover:text-gray-300"
					title="Close panel"
				>
					<X size={20} />
				</button>
				{#if isPlanetInfoLoading}
					<div class="flex h-64 items-center justify-center">
						<div
							class="h-8 w-8 animate-spin rounded-full border-2 border-yellow-400 border-t-transparent"
						></div>
						<span class="ml-2 text-yellow-300">Loading planet details...</span>
					</div>
				{:else if PlanetInfo && selectedPlanet}
					<ErrorBoundary>
						<PlanetInfo planet={selectedPlanet} />
					</ErrorBoundary>
				{:else}
					<div class="flex h-64 items-center justify-center text-yellow-300">
						<span>Failed to load planet details</span>
					</div>
				{/if}
			</div>
		{/if}
	</div>
</div>

<style>
</style>
