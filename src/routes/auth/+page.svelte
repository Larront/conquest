<script lang="ts">
	import { IsMobile } from '$lib/hooks/is-mobile.svelte';
	import { X, User, Mail, Lock, Shield, LogIn, LoaderCircle } from '@lucide/svelte';

	let { data } = $props();
	let { factions } = $derived(data);
	let mode: 'signin' | 'signup' = $state('signin');

	// Form data
	let email = $state('');
	let password = $state('');
	let username = $state('');
	let faction = $state('Astra Militarum');

	let isLoading = $state(false);

	function toggleMode() {
		mode = mode === 'signin' ? 'signup' : 'signin';
	}

	const mobile = new IsMobile();
</script>

<div
	class="rounded-card-lg bg-background shadow-popover data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 relative top-[50%] left-[50%] z-50 w-full max-w-[calc(100%-2rem)] translate-x-[-50%] translate-y-[-50%] rounded-lg border-2 border-yellow-600 bg-gradient-to-b from-gray-900 to-black outline-hidden sm:max-w-[490px] md:w-full"
>
	<div
		class="flex items-center justify-between rounded-t-lg border-b-2 border-yellow-600 bg-gradient-to-r from-red-900 via-gray-900 to-red-900 p-4"
	>
		<div class="flex flex-1 items-center gap-3">
			<Shield class="text-yellow-400" size={24} />
			<h2
				class="{mobile.current
					? 'text-sm'
					: 'text-xl'} mx-auto font-bold tracking-wider text-yellow-200"
			>
				{mode === 'signin' ? '++ ACCESS TERMINAL ++' : '++ RECRUITMENT PROTOCOL ++'}
			</h2>
		</div>
		<a href="/" class="text-yellow-200 transition-colors hover:text-red-400">
			<X size={20} />
		</a>
	</div>
	<form
		class="space-y-4 p-6"
		method="POST"
		action={mode === 'signin' ? '?/login' : '?/signup'}
		onsubmit={() => {
			isLoading = true;
		}}
	>
		{#if mode === 'signup'}
			<div>
				<label for="username" class="mb-2 block text-sm font-bold text-yellow-300">
					SERVITOR DESIGNATION
				</label>
				<div class="relative">
					<User class="absolute top-1/2 left-3 -translate-y-1/2 text-gray-400" size={18} />
					<input
						id="username"
						name="username"
						type="text"
						bind:value={username}
						placeholder="Enter username..."
						class="w-full rounded border border-gray-600 bg-gray-800 py-2 pr-4 pl-10 text-yellow-100 placeholder-gray-400 focus:border-yellow-500 focus:outline-none"
						required
					/>
				</div>
			</div>
		{/if}

		<div>
			<label for="email" class="mb-2 block text-sm font-bold text-yellow-300">
				VOX TRANSMISSION CODE
			</label>
			<div class="relative">
				<Mail class="absolute top-1/2 left-3 -translate-y-1/2 text-gray-400" size={18} />
				<input
					id="email"
					name="email"
					type="email"
					bind:value={email}
					placeholder="Enter email..."
					class="w-full rounded border border-gray-600 bg-gray-800 py-2 pr-4 pl-10 text-yellow-100 placeholder-gray-400 focus:border-yellow-500 focus:outline-none"
					required
				/>
			</div>
		</div>

		<div>
			<label for="password" class="mb-2 block text-sm font-bold text-yellow-300">
				AUTHORIZATION CIPHER
			</label>
			<div class="relative">
				<Lock class="absolute top-1/2 left-3 -translate-y-1/2 text-gray-400" size={18} />
				<input
					id="password"
					name="password"
					type="password"
					bind:value={password}
					placeholder="Enter password..."
					class="w-full rounded border border-gray-600 bg-gray-800 py-2 pr-4 pl-10 text-yellow-100 placeholder-gray-400 focus:border-yellow-500 focus:outline-none"
					required
				/>
			</div>
		</div>

		{#if mode === 'signup'}
			<div>
				<label for="faction" class="mb-2 block text-sm font-bold text-yellow-300">
					ALLEGIANCE
				</label>
				<select
					id="faction"
					name="faction"
					bind:value={faction}
					class="w-full rounded border border-gray-600 bg-gray-800 px-4 py-2 text-yellow-100 focus:border-yellow-500 focus:outline-none"
				>
					{#each factions as factionOption}
						<option value={factionOption.name}>{factionOption.name}</option>
					{/each}
				</select>
			</div>
		{/if}

		<button
			type="submit"
			disabled={isLoading}
			class="flex w-full rounded bg-gradient-to-r from-red-700 to-red-600 px-4 py-2 font-bold text-yellow-100 transition-colors hover:from-red-600 hover:to-red-500 disabled:cursor-not-allowed disabled:opacity-50"
		>
			{#if isLoading}
				<div class="mx-auto flex gap-3">
					<LoaderCircle class="animate-spin" /> PROCESSING…
				</div>
			{:else}
				<div class="mx-auto flex">
					{mode === 'signin' ? 'AUTHENTICATE' : 'ENLIST'}
				</div>
			{/if}
		</button>

		<div class="border-t border-gray-700 pt-4 text-center">
			<button
				type="button"
				onclick={toggleMode}
				class="text-sm text-gray-400 transition-colors hover:text-yellow-300"
			>
				{mode === 'signin'
					? 'New Recruit? Request Enlistment Authorization'
					: 'Already Enlisted? Access Terminal'}
			</button>
		</div>
	</form>
</div>
