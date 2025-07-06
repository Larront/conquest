<script lang="ts">
	import { IsMobile } from '$lib/hooks/is-mobile.svelte.js';
	import { Mail, ArrowLeft, X } from '@lucide/svelte';
	import { superForm } from 'sveltekit-superforms';

	let { data } = $props();

	const { form, errors, message, enhance, delayed } = superForm(data.form);

	const mobile = new IsMobile();
</script>

<div
	class="rounded-card-lg bg-background shadow-popover data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 relative top-[50%] left-[50%] z-50 w-full max-w-[calc(100%-2rem)] translate-x-[-50%] translate-y-[-50%] rounded-lg border-2 border-yellow-600 bg-gradient-to-b from-gray-900 to-black outline-hidden sm:max-w-[490px] md:w-full"
>
	<div
		class="flex items-center justify-between rounded-t-lg border-b-2 border-yellow-600 bg-gradient-to-r from-red-900 via-gray-900 to-red-900 p-4"
	>
		<div class="flex flex-1 items-center gap-3">
			<Mail class="text-red-400" size={24} />
			<h2
				class="{mobile.current
					? 'text-sm'
					: 'text-xl'} mx-auto font-bold tracking-wider text-red-300"
			>
				++ AUTHORIZATION RECOVERY ++
			</h2>
		</div>
		<a href="/" class="text-yellow-200 transition-colors hover:text-red-400">
			<X size={20} />
		</a>
	</div>

	<!-- General Error Message -->
	{#if $message}
		<div class="rounded border border-red-500 bg-red-900/20 p-3 text-sm text-red-300">
			{$message}
		</div>
	{/if}

	<!-- Password Reset Form -->
	<form method="POST" class="space-y-4 p-6" use:enhance>
		<div>
			<label for="email" class="mb-2 block text-sm font-bold text-red-300">
				REGISTERED EMAIL DESIGNATION
			</label>
			<input
				id="email"
				name="email"
				type="email"
				aria-invalid={$errors.email ? 'true' : undefined}
				bind:value={$form.email}
				placeholder="Enter your registered email address..."
				class="w-full rounded border {$errors.email
					? 'border-red-500 bg-red-900/10'
					: 'border-gray-600'} bg-gray-800 px-4 py-2 text-red-100 placeholder-gray-400 focus:border-red-500 focus:outline-none"
				required
			/>
			{#if $errors.email}
				<p class="mt-1 text-sm text-red-400">{$errors.email}</p>
			{/if}
		</div>

		<button
			type="submit"
			disabled={$delayed}
			class="w-full rounded bg-gradient-to-r from-red-700 to-red-600 px-4 py-3 font-bold text-yellow-100 transition-colors hover:from-red-600 hover:to-red-500 disabled:cursor-not-allowed disabled:opacity-50"
		>
			{#if $delayed}
				<Mail class="mr-2 inline animate-pulse" size={18} />
				TRANSMITTING RECOVERY REQUEST...
			{:else}
				<Mail class="mr-2 inline" size={18} />
				REQUEST AUTHORIZATION RESET
			{/if}
		</button>

		<!-- Back to Login -->
		<div class="space-y-3 border-t border-gray-700 pt-4 text-center">
			<a href="/auth" class="text-sm text-gray-400 transition-colors hover:text-red-300">
				Return to Authorization Terminal
			</a>
		</div>
	</form>
</div>
