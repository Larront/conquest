<script lang="ts">
	import type { Faction, Planet } from '$lib/types';
	import { useIntersectionObserver } from '$lib/hooks/use-intersection-observer.svelte.js';
	import { IsMobile } from '$lib/hooks/is-mobile.svelte';

	interface Props {
		planet: Planet;
		position: { x: number; y: number };
		factions: Faction[];
		isCompact: boolean;
		onClick: () => void;
	}

	let { planet, position, factions, isCompact, onClick }: Props = $props();

	// Performance optimization: only render detailed planet if likely to be visible
	// For very distant planets or on small screens, show simplified version initially
	let planetElement: HTMLElement;

	const mobile = new IsMobile();

	// Planet type configurations for visual variety
	const planetTypes = {
		'Hive World': {
			baseColor: '#4a5568',
			accentColor: '#f6ad55',
			pattern: 'city-lights',
			glow: '#f6ad55'
		},
		'Mineral World': {
			baseColor: '#742a2a',
			accentColor: '#fc8181',
			pattern: 'industrial',
			glow: '#fc8181'
		},
		'Death World': {
			baseColor: '#2d3748',
			accentColor: '#68d391',
			pattern: 'toxic',
			glow: '#68d391'
		},
		'Garden World': {
			baseColor: '#2b6cb0',
			accentColor: '#68d391',
			pattern: 'continents',
			glow: '#68d391'
		},
		'Desert World': {
			baseColor: '#c05621',
			accentColor: '#fbd38d',
			pattern: 'desert',
			glow: '#fbd38d'
		},
		'Psy-World': {
			baseColor: '#e2e8f0',
			accentColor: '#90cdf4',
			pattern: 'ice',
			glow: '#90cdf4'
		},
		'Relic World': {
			baseColor: '#38a169',
			accentColor: '#68d391',
			pattern: 'jungle',
			glow: '#68d391'
		},
		'Feudal World': {
			baseColor: '#8b5cf6',
			accentColor: '#c4b5fd',
			pattern: 'medieval',
			glow: '#c4b5fd'
		}
	};

	// Get planet visual config based on classification
	const planetConfig =
		planetTypes[planet.classification as keyof typeof planetTypes] || planetTypes['Garden World'];

	// Size based on importance or population
	let planetSize = $derived(isCompact ? 'h-2 w-2' : 'h-6 w-6 md:h-8 md:w-8');
	let glowSize = $derived(isCompact ? 'h-4 w-4' : 'h-10 w-10 md:h-12 md:w-12');

	// Animation delays for atmospheric effects
	const animationDelay = Math.random() * 3;
</script>

<button
	bind:this={planetElement}
	class="group absolute -translate-x-1/2 -translate-y-1/2 transform cursor-pointer rounded-full transition-all duration-300 hover:scale-125 focus:ring-2 focus:ring-white focus:outline-none"
	style="left: {position.x}%; top: {position.y}%;"
	onclick={onClick}
	aria-label="View details for {planet.name}"
>
	<!-- Outer glow effect -->
	<div
		class="absolute -translate-x-1/2 -translate-y-1/2 transform animate-pulse rounded-full opacity-40 blur-sm {glowSize}"
		style="background: radial-gradient(circle, {planetConfig.glow}40, transparent 70%); animation-delay: {animationDelay}s;"
	></div>

	<!-- Planet body -->
	<div
		class="relative rounded-full {planetSize} shadow-lg transition-shadow duration-300 group-hover:shadow-xl"
		style="background: radial-gradient(circle at 30% 30%, {planetConfig.accentColor}60, {planetConfig.baseColor} 70%);"
	>
		<!-- Surface pattern overlay -->
		<div class="absolute inset-0 rounded-full opacity-60">
			{#if planetConfig.pattern === 'city-lights'}
				<!-- Hive World - City lights pattern -->
				<div
					class="absolute inset-0 rounded-full"
					style="background: radial-gradient(circle at 20% 80%, #ffd70040 0%, transparent 30%), radial-gradient(circle at 70% 20%, #ffd70040 0%, transparent 30%), radial-gradient(circle at 80% 70%, #ffd70040 0%, transparent 30%);"
				></div>
			{:else if planetConfig.pattern === 'industrial'}
				<!-- Forge World - Industrial smog -->
				<div
					class="absolute inset-0 rounded-full"
					style="background: linear-gradient(45deg, #ff000020 0%, transparent 50%), linear-gradient(-45deg, #ff000020 0%, transparent 50%);"
				></div>
			{:else if planetConfig.pattern === 'toxic'}
				<!-- Death World - Toxic atmosphere -->
				<div
					class="absolute inset-0 animate-pulse rounded-full"
					style="background: radial-gradient(circle at 50% 50%, #00ff0030 0%, transparent 60%); animation-duration: 2s;"
				></div>
			{:else if planetConfig.pattern === 'continents'}
				<!-- Garden World - Continental patterns -->
				<div
					class="absolute inset-0 rounded-full"
					style="background: radial-gradient(ellipse at 30% 40%, #22c55e40 0%, transparent 40%), radial-gradient(ellipse at 70% 60%, #22c55e40 0%, transparent 40%);"
				></div>
			{:else if planetConfig.pattern === 'desert'}
				<!-- Desert World - Sand storm patterns -->
				<div
					class="absolute inset-0 rounded-full"
					style="background: linear-gradient(30deg, #f59e0b30 0%, transparent 50%), linear-gradient(-30deg, #f59e0b30 0%, transparent 50%);"
				></div>
			{:else if planetConfig.pattern === 'ice'}
				<!-- Ice World - Polar caps -->
				<div
					class="absolute inset-0 rounded-full"
					style="background: linear-gradient(to bottom, #ffffff60 0%, transparent 30%), linear-gradient(to top, #ffffff60 0%, transparent 30%);"
				></div>
			{:else if planetConfig.pattern === 'jungle'}
				<!-- Feral World - Dense vegetation -->
				<div
					class="absolute inset-0 rounded-full"
					style="background: repeating-conic-gradient(from 0deg, #16a34a40 0deg, transparent 60deg, #16a34a40 120deg);"
				></div>
			{:else if planetConfig.pattern === 'medieval'}
				<!-- Feudal World - Patchy civilization -->
				<div
					class="absolute inset-0 rounded-full"
					style="background: radial-gradient(circle at 40% 30%, #8b5cf640 0%, transparent 25%), radial-gradient(circle at 60% 70%, #8b5cf640 0%, transparent 25%);"
				></div>
			{/if}
		</div>

		<!-- Atmospheric highlight -->
		<div
			class="absolute inset-0 rounded-full"
			style="background: linear-gradient(135deg, {planetConfig.accentColor}80 0%, transparent 40%, transparent 60%, {planetConfig.baseColor}40 100%);"
		></div>

		<!-- Surface shine -->
		<div
			class="absolute top-0 left-0 h-1/3 w-1/3 rounded-full opacity-40"
			style="background: radial-gradient(circle, white, transparent 70%);"
		></div>
	</div>

	<!-- Faction control ring -->
	{#if planet.faction_control && planet.faction_control.length > 0}
		{@const factionColors = {
			Imperial: '#fbbf24',
			Chaos: '#dc2626',
			Xenos: '#7c3aed',
			Contested: '#ffffff'
		}}
		{@const ringColor =
			factionColors[
				(factions.find(
					(faction) =>
						faction.name ==
						planet.faction_control.reduce((prev, current) =>
							prev.control > current.control ? prev : current
						).profile
				)?.allegiance || 'Contested') as keyof typeof factionColors
			]}

		<div
			class="animate-spin-slow absolute -translate-x-[4px] -translate-y-[calc(100%-4px)] rounded-full border-2"
			style="width: calc(100% + 8px); height: calc(100% + 8px); border-color: {ringColor}60; animation-duration: 8s;"
		></div>
	{/if}
</button>

<style>
	@keyframes spin-slow {
		from {
			transform: rotate(0deg);
		}
		to {
			transform: rotate(360deg);
		}
	}

	.animate-spin-slow {
		animation: spin-slow 8s linear infinite;
	}
</style>
