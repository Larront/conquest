<script lang="ts">
	import { IsMobile } from '$lib/hooks/is-mobile.svelte';
	import { X, User, Mail, Lock, Shield, LoaderCircle, EyeOff, Eye } from '@lucide/svelte';
	import { superForm } from 'sveltekit-superforms';

	let { data } = $props();
	let { factions } = $derived(data);
	let mode: 'signin' | 'signup' = $state('signin');

	const { form, errors, message, enhance, delayed } = superForm(data.form);

	function toggleMode() {
		mode = mode === 'signin' ? 'signup' : 'signin';
	}

	let showPassword = $state(false);

	function togglePasswordVisibility() {
		showPassword = !showPassword;
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
	{#if data.successMessage}
		<div class="mb-4 rounded border border-green-500 bg-green-900/20 p-3 text-sm text-green-300">
			{data.successMessage}
		</div>
	{/if}
	{#if $message}
		<div class="mb-4 rounded border border-red-500 bg-red-900/20 p-3 text-sm text-red-300">
			{$message}
		</div>
	{/if}
	<form
		class="space-y-4 p-6"
		method="POST"
		action={mode === 'signin' ? '?/login' : '?/signup'}
		use:enhance
	>
		{#if mode === 'signup'}
			<label for="username" class="mb-2 block text-sm font-bold text-yellow-300">
				SERVITOR DESIGNATION
			</label>
			<div class="relative">
				<User class="absolute top-1/2 left-3 -translate-y-1/2 text-gray-400" size={18} />
				<input
					id="username"
					name="username"
					type="text"
					aria-invalid={$errors.username ? 'true' : undefined}
					bind:value={$form.username}
					placeholder="Enter username..."
					class="w-full rounded border border-gray-600 bg-gray-800 py-2 pr-4 pl-10 text-yellow-100 placeholder-gray-400 focus:border-yellow-500 focus:outline-none"
				/>
			</div>
			{#if $errors.username}
				<p class="mt-1 text-sm text-red-400">{$errors.username}</p>
			{/if}
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
					aria-invalid={$errors.email ? 'true' : undefined}
					bind:value={$form.email}
					placeholder="Enter email..."
					class="w-full rounded border border-gray-600 bg-gray-800 py-2 pr-4 pl-10 text-yellow-100 placeholder-gray-400 focus:border-yellow-500 focus:outline-none"
				/>
			</div>
			{#if $errors.email}
				<p class="mt-1 text-sm text-red-400">{$errors.email}</p>
			{/if}
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
					type={showPassword ? 'text' : 'password'}
					aria-invalid={$errors.password ? 'true' : undefined}
					bind:value={$form.password}
					placeholder="Enter password..."
					class="w-full rounded border border-gray-600 bg-gray-800 py-2 pr-4 pl-10 text-yellow-100 placeholder-gray-400 focus:border-yellow-500 focus:outline-none"
				/>
				<button
					type="button"
					onclick={togglePasswordVisibility}
					class="absolute top-1/2 right-3 -translate-y-1/2 text-gray-400 hover:text-green-300"
				>
					{#if showPassword}
						<Eye size={18} />
					{:else}
						<EyeOff size={18} />
					{/if}
				</button>
			</div>
			{#if $errors.password}
				<p class="mt-1 text-sm text-red-400">{$errors.password}</p>
			{/if}
		</div>

		{#if mode === 'signup'}
			<div>
				<label for="faction" class="mb-2 block text-sm font-bold text-yellow-300">
					ALLEGIANCE
				</label>
				<select
					id="faction"
					name="faction"
					aria-invalid={$errors.faction ? 'true' : undefined}
					bind:value={$form.faction}
					class="w-full rounded border border-gray-600 bg-gray-800 px-4 py-2 text-yellow-100 focus:border-yellow-500 focus:outline-none"
				>
					{#each factions as factionOption}
						<option value={factionOption.name}>{factionOption.name}</option>
					{/each}
				</select>
			</div>
			{#if $errors.faction}
				<p class="mt-1 text-sm text-red-400">{$errors.faction}</p>
			{/if}
		{/if}

		<button
			type="submit"
			disabled={$delayed}
			class="flex w-full rounded bg-gradient-to-r from-red-700 to-red-600 px-4 py-2 font-bold text-yellow-100 transition-colors hover:from-red-600 hover:to-red-500 disabled:cursor-not-allowed disabled:opacity-50"
		>
			{#if $delayed}
				<div class="mx-auto flex gap-3">
					<LoaderCircle class="animate-spin" /> PROCESSING…
				</div>
			{:else}
				<div class="mx-auto flex">
					{mode === 'signin' ? 'AUTHENTICATE' : 'ENLIST'}
				</div>
			{/if}
		</button>

		<div class="space-y-3 border-t border-gray-700 pt-4 text-center">
			<button
				type="button"
				onclick={toggleMode}
				class="text-sm text-gray-400 transition-colors hover:text-yellow-300"
			>
				{mode === 'signin'
					? 'New Recruit? Request Enlistment Authorization'
					: 'Already Enlisted? Access Terminal'}
			</button>

			{#if mode === 'signin'}
				<div>
					<a href="/auth/reset" class="text-sm text-gray-400 transition-colors hover:text-red-300">
						Authorization Cipher Compromised? Request Recovery
					</a>
				</div>
			{/if}
		</div>
	</form>
</div>
