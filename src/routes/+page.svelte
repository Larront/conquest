<script lang="ts">
	import type { Planet } from '$lib/types';
	import PlanetInfo from '$lib/components/planetInfo/PlanetInfo.svelte';
	import { LogIn, Plus, X } from '@lucide/svelte';
	import { slide } from 'svelte/transition';
	import UserMenu from '$lib/components/auth/UserMenu.svelte';
	import { IsMobile } from '$lib/hooks/is-mobile.svelte.js';

	let selectedPlanet: Planet | undefined = $state();
	let planetInfoOpen = $state(false);

	let { data } = $props();
	let { planets, battles, profiles, control, user } = $derived(data);

	let isMobile = new IsMobile();

	const planetData = $derived(
		planets.map((planet) => ({
			distance: Math.floor(Math.random() * (60 - 15 + 1) + 15) + '%',
			angle: Math.floor(Math.random() * (359 - 0 + 1) + 0),
			color: 'bg-yellow-300',
			faction_control: control
				.filter((entry) => entry.planet == planet.id)
				.map((control) => ({
					...control,
					profile: profiles.find((profile) => profile.id == control.profile)?.faction || 'Contested'
				})),
			battle_history: battles
				.filter((battle) => battle.planet == planet.id)
				.map((battle) => ({
					...battle,
					attacker:
						profiles.find((profile) => profile.id == battle.attacker).faction +
						' - ' +
						profiles.find((profile) => profile.id == battle.attacker).username,
					defender:
						profiles.find((profile) => profile.id == battle.defender).faction +
						' - ' +
						profiles.find((profile) => profile.id == battle.defender).username
				})),
			...planet
		}))
	);

	function selectPlanet(planet: Planet) {
		selectedPlanet = planet;
		planetInfoOpen = true;
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
	<!-- Stars background -->
	<div class="absolute inset-0 opacity-60">
		{#each Array(100) as _, i}
			<div
				class="absolute h-1 w-1 animate-pulse rounded-full bg-white"
				style="left: {Math.random() * 100}%; top: {Math.random() *
					100}%; animation-delay: {Math.random() * 3}s;"
			></div>
		{/each}
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
							<h1 class="text-xl font-bold tracking-wider">MALVERNIS SECTOR</h1>
							<p class="text-xs tracking-wide opacity-75">+ IMPERIAL RECONNAISSANCE +</p>
						</div>
					</div>
					<div class="ml-auto flex items-center justify-between gap-2">
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
					<!-- Orbital paths -->
					{#each planetData as planet}
						<div
							class="border-opacity-30 absolute rounded-full border border-gray-600"
							style="
								width: {parseFloat(planet.distance) * 1.6}%;
								height: {parseFloat(planet.distance) * 1.6}%;
								left: {50 - parseFloat(planet.distance) * 0.8}%;
								top: {50 - parseFloat(planet.distance) * 0.8}%;
								"
						></div>
					{/each}

					<!-- Sun -->
					<div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 transform">
						<div
							class="{isMobile.current && planetInfoOpen
								? 'h-6 w-6'
								: 'h-12 w-12'} animate-pulse rounded-full border-2 border-red-400 bg-gradient-to-r from-red-600 to-purple-600 shadow-2xl"
						></div>
						<div
							class="absolute inset-0 -top-2 -left-2 h-16 w-16 animate-ping rounded-full border border-red-500 opacity-30"
						></div>
					</div>

					<!-- Planets -->
					{#each planetData as planet}
						{@const position = getPlanetPosition(planet.distance, planet.angle)}
						<button
							class="absolute {isMobile.current && planetInfoOpen
								? 'h-1 w-1'
								: 'h-4 w-4 md:h-5 md:w-5'} {planet.color} focus:ring-opacity-50 -translate-x-1/2 -translate-y-1/2 transform cursor-pointer rounded-full shadow-lg transition-all duration-500 hover:scale-110 focus:ring-2 focus:ring-white focus:outline-none"
							style="left: {position.x}%; top: {position.y}%;"
							onclick={() => selectPlanet(planet)}
							aria-label="View details for {planet.name}"
						>
							<div
								class="bg-gradient-radial h-full w-full rounded-full from-white/20 to-transparent"
							></div>
						</button>
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
				<PlanetInfo planet={selectedPlanet!} />
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
				<PlanetInfo planet={selectedPlanet!} />
			</div>
		{/if}
	</div>
</div>

<!-- <UserMenu /> -->

<!-- <BattleUpload isOpen={battleUploadOpen} planets={planetData} /> -->

<style>
	.bg-gradient-radial {
		background: radial-gradient(circle, var(--tw-gradient-stops));
	}
</style>
