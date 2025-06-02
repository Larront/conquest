<script lang="ts">
	import { IsMobile } from '$lib/hooks/is-mobile.svelte';

	let { children } = $props();

	const mobile = new IsMobile();
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
