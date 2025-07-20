<script lang="ts">
	import { IsMobile } from '$lib/hooks/is-mobile.svelte';

	let { children } = $props();

	const mobile = new IsMobile();
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

	<div class="relative z-10 flex {mobile.current ? 'flex-col' : ''} h-screen">
		<!-- Main Solar System View -->
		<div class="relative flex-1">
			{#if mobile.current}
				<div
					class="safe-area-top absolute top-0 right-0 left-0 z-50 flex border-b border-yellow-600 bg-gradient-to-b from-black via-gray-900 to-transparent p-4 text-yellow-200"
				>
					<div class="flex items-center justify-between">
						<div>
							<h1 class="text-xl font-bold tracking-wider">MALVERNIS SECTOR</h1>
							<p class="text-xs tracking-wide opacity-75">+ IMPERIAL RECONNAISSANCE +</p>
						</div>
					</div>
				</div>
			{:else}
				<div
					class="bg-opacity-75 absolute top-4 left-4 z-50 rounded border border-yellow-600 bg-black p-4 text-yellow-200"
				>
					<h1 class="mb-2 text-2xl font-bold tracking-wider">MALVERNIS SECTOR</h1>
					<p class="text-sm tracking-wide opacity-75">+ IMPERIAL RECONNAISSANCE PROTOCOL +</p>
				</div>
			{/if}

			{@render children()}
		</div>
	</div>
</div>
