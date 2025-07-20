<script lang="ts">
	import { LogIn } from '@lucide/svelte';
	import UserMenu from '$lib/components/auth/UserMenu.svelte';
	import { IsMobile } from '$lib/hooks/is-mobile.svelte.js';

	let { data } = $props();
	let { htmlContent, lastUpdated, user } = $derived(data);

	let isMobile = new IsMobile();

	// Format the last updated date
	const formattedDate = $derived(() => {
		const date = new Date(lastUpdated);
		return date.toLocaleDateString('en-US', {
			year: 'numeric',
			month: 'long', 
			day: 'numeric'
		});
	});
</script>

<svelte:head>
	<title>Campaign Rules - Malvernis Sector</title>
	<meta name="description" content="Official campaign rules for the Malvernis Sector Warhammer 40K campaign" />
</svelte:head>

<div class="relative min-h-screen w-full overflow-hidden bg-gradient-to-br from-gray-900 via-red-950 to-black">
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

	<div class="relative z-10">
		<!-- Header -->
		<header class="border-b border-yellow-600 bg-gradient-to-b from-black via-gray-900 to-transparent">
			<div class="container mx-auto px-4 py-6">
				<div class="flex items-center justify-between">
					<div>
						<h1 class="text-2xl md:text-3xl font-bold tracking-wider text-yellow-200">
							CAMPAIGN RULES
						</h1>
						<p class="text-sm tracking-wide opacity-75 text-yellow-200">
							+ MALVERNIS SECTOR PROTOCOL +
						</p>
					</div>
					<div class="flex items-center gap-4">
						<a 
							href="/"
							class="text-yellow-200 hover:text-yellow-100 transition-colors text-sm tracking-wide"
						>
							← RETURN TO SECTOR MAP
						</a>
						{#if user}
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
			</div>
		</header>

		<!-- Main Content -->
		<main class="container mx-auto px-4 py-8">
			<div class="mx-auto max-w-4xl">
				<!-- Last Updated -->
				<div class="mb-6 text-center">
					<p class="text-sm text-yellow-300/75">
						Last updated: {formattedDate()}
					</p>
				</div>

				<!-- Rules Content -->
				<article 
					class="prose prose-invert prose-yellow max-w-none 
						   prose-headings:text-yellow-200 prose-headings:font-bold prose-headings:tracking-wide
						   prose-h1:text-3xl prose-h1:mb-6 prose-h1:border-b prose-h1:border-yellow-600 prose-h1:pb-2
						   prose-h2:text-2xl prose-h2:mb-4 prose-h2:text-yellow-300
						   prose-h3:text-xl prose-h3:mb-3 prose-h3:text-yellow-300
						   prose-p:text-gray-200 prose-p:leading-relaxed
						   prose-strong:text-yellow-100 prose-strong:font-semibold
						   prose-em:text-yellow-200
						   prose-ul:text-gray-200 prose-ol:text-gray-200
						   prose-li:mb-1
						   prose-blockquote:text-yellow-200 prose-blockquote:border-yellow-600
						   prose-code:text-yellow-100 prose-code:bg-gray-800 prose-code:px-1 prose-code:rounded
						   prose-pre:bg-gray-900 prose-pre:border prose-pre:border-gray-700
						   prose-a:text-yellow-400 prose-a:no-underline hover:prose-a:text-yellow-300
						   bg-black/30 backdrop-blur-sm rounded-lg border border-yellow-600/30 p-8"
				>
					{@html htmlContent}
				</article>
			</div>
		</main>

		<!-- Footer -->
		<footer class="border-t border-yellow-600/30 bg-black/50 py-6 mt-12">
			<div class="container mx-auto px-4 text-center">
				<p class="text-yellow-300/75 text-sm">
					<em>In the grim darkness of the far future, there is only war.</em>
				</p>
			</div>
		</footer>
	</div>
</div>

<style>
	/* Custom table styling for rules tables */
	:global(.prose table) {
		width: 100%;
		border-collapse: collapse;
		border: 1px solid rgb(202 138 4 / 0.5);
		background-color: rgb(17 24 39 / 0.5);
	}
	
	:global(.prose th) {
		padding: 0.5rem 1rem;
		color: rgb(254 240 138);
		font-weight: bold;
		text-align: left;
		border: 1px solid rgb(202 138 4 / 0.5);
		background-color: rgb(113 63 18 / 0.3);
	}
	
	:global(.prose td) {
		padding: 0.5rem 1rem;
		color: rgb(229 231 235);
		border: 1px solid rgb(202 138 4 / 0.5);
	}
	
	:global(.prose tr:nth-child(even)) {
		background-color: rgb(31 41 55 / 0.3);
	}
	
	:global(.prose hr) {
		margin: 2rem 0;
		border-color: rgb(202 138 4 / 0.5);
	}
</style>