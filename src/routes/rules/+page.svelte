<script lang="ts">
	import { LogIn } from '@lucide/svelte';
	import UserMenu from '$lib/components/auth/UserMenu.svelte';

	let { data } = $props();
	let { user } = $derived(data);
</script>

<svelte:head>
	<title>Campaign Rules - Malvernis Sector</title>
	<meta
		name="description"
		content="Official campaign rules for the Malvernis Sector Warhammer 40K campaign"
	/>
</svelte:head>

<div
	class="relative min-h-screen w-full overflow-y-auto bg-gradient-to-br from-gray-900 via-red-950 to-black"
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

	<div class="relative z-10">
		<!-- Header -->
		<header
			class="border-b border-yellow-600 bg-gradient-to-b from-black via-gray-900 to-transparent"
		>
			<div class="container mx-auto px-4 py-6">
				<div class="flex items-center justify-between">
					<div>
						<h1 class="text-2xl font-bold tracking-wider text-yellow-200 md:text-3xl">
							CAMPAIGN RULES
						</h1>
						<p class="text-sm tracking-wide text-yellow-200 opacity-75">
							+ MALVERNIS SECTOR PROTOCOL +
						</p>
					</div>
					<div class="flex items-center gap-4">
						<a
							href="/"
							class="text-sm tracking-wide text-yellow-200 transition-colors hover:text-yellow-100"
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
			<div class="mx-auto max-w-5xl">
				<!-- Campaign Title Section -->
				<section class="mb-12 text-center">
					<div class="relative inline-block">
						<div class="absolute inset-0 bg-yellow-600 opacity-20 blur-md"></div>
						<h2
							class="relative mb-4 text-4xl font-black tracking-widest text-yellow-200 md:text-6xl"
						>
							MALVERNIS SECTOR
						</h2>
					</div>
					<div class="text-lg tracking-wide text-yellow-300">CAMPAIGN RULES</div>
				</section>

				<!-- Campaign Overview -->
				<section
					class="mb-12 rounded-lg border border-yellow-600/30 bg-black/30 p-8 backdrop-blur-sm"
				>
					<h3 class="mb-6 border-b border-yellow-600 pb-2 text-2xl font-bold text-yellow-200">
						Campaign Overview
					</h3>
					<div class="space-y-4 leading-relaxed text-gray-200">
						<p>
							Welcome to the <strong class="text-yellow-100">Malvernis Sector</strong> campaign! Fight
							for control over the Malvernis sector, located in the Veiled Region of Segmentum Tempestus
							in the galactic south of Imperium Sanctus.
						</p>
						<p>
							While scarce, planets in this sector are highly valued for their resources and
							technological artefacts, so factions galaxy-wide have found themselves focusing on
							this narrow corner of space.
						</p>

						<div class="rounded border-l-4 border-yellow-600 bg-gray-900/50 p-6">
							<h4 class="mb-3 font-semibold text-yellow-200">Planets in the Sector:</h4>
							<div class="grid gap-4 text-center md:grid-cols-3">
								<div class="rounded border border-red-600/30 bg-red-900/20 p-3">
									<div class="font-bold text-red-300">SIREPHUS</div>
								</div>
								<div class="rounded border border-blue-600/30 bg-blue-900/20 p-3">
									<div class="font-bold text-blue-300">MYTHARA</div>
								</div>
								<div class="rounded border border-green-600/30 bg-green-900/20 p-3">
									<div class="font-bold text-green-300">VELTRAXIS</div>
								</div>
							</div>
						</div>

						<p>
							As you play games and win, you'll gain more control over these planets, allowing you
							to bring larger forces to the battlefield. Likewise, if your opponents have a high
							level of control over a planet, you can summon a larger fighting force to try and
							wrest control back.
						</p>

						<div class="rounded border border-yellow-600/50 bg-yellow-900/20 p-6">
							<h4 class="mb-3 font-semibold text-yellow-200">Multi-Faction Gameplay</h4>
							<p class="text-gray-200">
								This campaign allows you to play as multiple different factions throughout the
								league! You're not locked into a single army - feel free to experiment with
								different forces as you fight for control of the sector. Whether you want to lead
								the Imperium's finest one week and command xenos forces the next, the choice is
								yours.
							</p>
						</div>
					</div>
				</section>

				<!-- Control Thresholds & Battle Sizes -->
				<section
					class="mb-12 rounded-lg border border-yellow-600/30 bg-black/30 p-8 backdrop-blur-sm"
				>
					<h3 class="mb-6 border-b border-yellow-600 pb-2 text-2xl font-bold text-yellow-200">
						Control Thresholds & Battle Sizes
					</h3>
					<p class="mb-6 text-gray-200">
						The size of the force you can bring to each planet is determined by your faction's
						control level:
					</p>

					<div class="overflow-x-auto">
						<table class="w-full border-collapse rounded bg-gray-900/50">
							<thead>
								<tr class="bg-yellow-900/30">
									<th
										class="border border-yellow-600/50 px-6 py-4 text-left font-bold text-yellow-200"
									>
										Control Threshold
									</th>
									<th
										class="border border-yellow-600/50 px-6 py-4 text-left font-bold text-yellow-200"
									>
										Max Battle Size
									</th>
								</tr>
							</thead>
							<tbody>
								<tr class="transition-colors hover:bg-gray-800/30">
									<td class="border border-yellow-600/50 px-6 py-4 text-gray-200">&lt;20%</td>
									<td class="border border-yellow-600/50 px-6 py-4 font-semibold text-gray-200"
										>500pts</td
									>
								</tr>
								<tr class="bg-gray-800/30 transition-colors hover:bg-gray-800/50">
									<td class="border border-yellow-600/50 px-6 py-4 text-gray-200">≥20%</td>
									<td class="border border-yellow-600/50 px-6 py-4 font-semibold text-gray-200"
										>1000pts</td
									>
								</tr>
								<tr class="transition-colors hover:bg-gray-800/30">
									<td class="border border-yellow-600/50 px-6 py-4 text-gray-200">≥30%</td>
									<td class="border border-yellow-600/50 px-6 py-4 font-semibold text-gray-200"
										>1500pts</td
									>
								</tr>
								<tr class="bg-gray-800/30 transition-colors hover:bg-gray-800/50">
									<td class="border border-yellow-600/50 px-6 py-4 text-gray-200">≥40%</td>
									<td class="border border-yellow-600/50 px-6 py-4 font-semibold text-gray-200"
										>2000pts</td
									>
								</tr>
							</tbody>
						</table>
					</div>

					<p class="mt-4 text-sm text-yellow-300">
						<strong>Note:</strong> Only one force per battle needs to meet the control threshold.
					</p>
				</section>

				<!-- Point Scoring System -->
				<section
					class="mb-12 rounded-lg border border-yellow-600/30 bg-black/30 p-8 backdrop-blur-sm"
				>
					<h3 class="mb-6 border-b border-yellow-600 pb-2 text-2xl font-bold text-yellow-200">
						Point Scoring System
					</h3>

					<div class="mb-8">
						<h4 class="mb-4 text-xl font-semibold text-yellow-300">How to Participate</h4>
						<ol class="list-inside list-decimal space-y-2 pl-4 text-gray-200">
							<li>Make an account on the campaign website</li>
							<li>Play games and paint miniatures!</li>
							<li>Log your games on the website and share your painted models</li>
						</ol>
					</div>

					<div>
						<h4 class="mb-4 text-xl font-semibold text-yellow-300">Point Values</h4>
						<div class="overflow-x-auto">
							<table class="w-full border-collapse rounded bg-gray-900/50">
								<thead>
									<tr class="bg-yellow-900/30">
										<th
											class="border border-yellow-600/50 px-6 py-4 text-left font-bold text-yellow-200"
										>
											Action
										</th>
										<th
											class="border border-yellow-600/50 px-6 py-4 text-center font-bold text-yellow-200"
										>
											Points
										</th>
									</tr>
								</thead>
								<tbody>
									<tr class="transition-colors hover:bg-gray-800/30">
										<td class="border border-yellow-600/50 px-6 py-4 text-gray-200">Win a game</td>
										<td
											class="border border-yellow-600/50 px-6 py-4 text-center font-bold text-green-400"
											>3</td
										>
									</tr>
									<tr class="bg-gray-800/30 transition-colors hover:bg-gray-800/50">
										<td class="border border-yellow-600/50 px-6 py-4 text-gray-200">Draw a game</td>
										<td
											class="border border-yellow-600/50 px-6 py-4 text-center font-bold text-yellow-400"
											>1</td
										>
									</tr>
									<tr class="transition-colors hover:bg-gray-800/30">
										<td class="border border-yellow-600/50 px-6 py-4 text-gray-200"
											>Winning against someone with more territory</td
										>
										<td
											class="border border-yellow-600/50 px-6 py-4 text-center font-bold text-green-400"
											>+1</td
										>
									</tr>
									<tr class="bg-gray-800/30 transition-colors hover:bg-gray-800/50">
										<td class="border border-yellow-600/50 px-6 py-4 text-gray-200"
											>Submit a narrative battle log</td
										>
										<td
											class="border border-yellow-600/50 px-6 py-4 text-center font-bold text-blue-400"
											>1</td
										>
									</tr>
									<tr class="transition-colors hover:bg-gray-800/30">
										<td class="border border-yellow-600/50 px-6 py-4 text-gray-200">Paint a unit</td
										>
										<td
											class="border border-yellow-600/50 px-6 py-4 text-center font-bold text-purple-400"
											>1</td
										>
									</tr>
									<tr class="bg-gray-800/30 transition-colors hover:bg-gray-800/50">
										<td class="border border-yellow-600/50 px-6 py-4 text-gray-200"
											>Paint a character/monster/vehicle</td
										>
										<td
											class="border border-yellow-600/50 px-6 py-4 text-center font-bold text-purple-400"
											>2</td
										>
									</tr>
									<tr class="transition-colors hover:bg-gray-800/30">
										<td class="border border-yellow-600/50 px-6 py-4 text-gray-200"
											>Paint a terrain item / display base</td
										>
										<td
											class="border border-yellow-600/50 px-6 py-4 text-center font-bold text-purple-400"
											>1</td
										>
									</tr>
									<tr class="bg-gray-800/30 transition-colors hover:bg-gray-800/50">
										<td class="border border-yellow-600/50 px-6 py-4 text-gray-200"
											>Reach a 20% control milestone on a planet</td
										>
										<td
											class="border border-yellow-600/50 px-6 py-4 text-center font-bold text-orange-400"
											>1 (per 20%)</td
										>
									</tr>
								</tbody>
							</table>
						</div>
					</div>
				</section>

				<!-- Planetary Effects -->
				<section
					class="mb-12 rounded-lg border border-yellow-600/30 bg-black/30 p-8 backdrop-blur-sm"
				>
					<h3 class="mb-6 border-b border-yellow-600 pb-2 text-2xl font-bold text-yellow-200">
						Planetary Effects
					</h3>

					<p class="mb-6 text-gray-200">
						Every week, planets will have random effects applied to them that can dramatically
						change the nature of battles fought there.
					</p>

					<div class="mb-6 rounded border border-red-600/50 bg-red-900/20 p-6">
						<h4 class="mb-3 font-bold text-red-300">Example Effect - Bloodlust:</h4>
						<p class="text-gray-200">
							You are eligible to charge within 18" instead of 12". When you charge, roll 3d6
							instead of 2d6.
						</p>
					</div>

					<div>
						<h4 class="mb-4 text-xl font-semibold text-yellow-300">Using Planetary Effects</h4>
						<ul class="list-inside list-disc space-y-2 pl-4 text-gray-200">
							<li>Effects are optional - you and your opponent must agree to use them</li>
							<li>
								Effects work best when known before army building, as they can significantly
								influence force composition
							</li>
							<li>If an effect would make the game less enjoyable, feel free to ignore it</li>
						</ul>
					</div>
				</section>
			</div>
		</main>

		<!-- Footer -->
		<footer class="mt-12 border-t border-yellow-600/30 bg-black/50 py-8">
			<div class="container mx-auto px-4 text-center">
				<div class="mb-4">
					<div class="inline-block border-2 border-yellow-600 bg-black/50 px-6 py-2">
						<p class="text-lg font-bold tracking-wider text-yellow-200">
							IN THE GRIM DARKNESS OF THE FAR FUTURE
						</p>
						<p class="text-sm tracking-widest text-yellow-300">
							THERE IS ONLY WAR... AND COMPHREHENSIVE BATTLE TRACKING
						</p>
					</div>
				</div>
			</div>
		</footer>
	</div>
</div>
