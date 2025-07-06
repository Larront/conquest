<script lang="ts">
	import { IsMobile } from '$lib/hooks/is-mobile.svelte.js';
	import { Shield, Eye, EyeOff, Lock, ArrowLeft, X } from '@lucide/svelte';
	import { superForm } from 'sveltekit-superforms';

	let { data } = $props();

	const { form, errors, message, enhance, delayed } = superForm(data.form);

	let showPassword = $state(false);
	let showConfirmPassword = $state(false);

	function togglePasswordVisibility() {
		showPassword = !showPassword;
	}

	function toggleConfirmPasswordVisibility() {
		showConfirmPassword = !showConfirmPassword;
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
			<Shield class="text-green-400" size={24} />
			<h2
				class="{mobile.current
					? 'text-sm'
					: 'text-xl'} mx-auto font-bold tracking-wider text-green-300"
			>
				++ Establish New Cipher ++
			</h2>
		</div>
		<a href="/" class="text-yellow-200 transition-colors hover:text-red-400">
			<X size={20} />
		</a>
	</div>

	{#if !data.hasValidSession}
		<!-- Invalid Session Message -->
		<div class="rounded border border-red-500 bg-red-900/20 p-6 text-center">
			<h2 class="mb-3 text-lg font-bold text-red-300">INVALID AUTHORIZATION TOKEN</h2>
			<p class="mb-4 text-red-200">
				The password reset link is invalid, expired, or has already been used.
			</p>
			<a
				href="/auth/reset"
				class="inline-block rounded bg-gradient-to-r from-red-700 to-red-600 px-4 py-2 font-bold text-yellow-100 transition-colors hover:from-red-600 hover:to-red-500"
			>
				Request New Recovery Link
			</a>
		</div>
	{:else}
		<!-- General Error Message -->
		{#if $message}
			<div class="rounded border border-red-500 bg-red-900/20 p-3 text-sm text-red-300">
				{$message}
			</div>
		{/if}

		<div class="space-y-3 p-6">
			<!-- Password Reset Form -->
			<form method="POST" class="space-y-6" use:enhance>
				<div>
					<label for="newPassword" class="mb-2 block text-sm font-bold text-green-300">
						NEW AUTHORIZATION CIPHER
					</label>
					<div class="relative">
						<input
							id="newPassword"
							name="newPassword"
							type={showPassword ? 'text' : 'password'}
							aria-invalid={$errors.newPassword ? 'true' : undefined}
							bind:value={$form.newPassword}
							placeholder="Enter new secure cipher..."
							class="w-full rounded border {$errors.newPassword
								? 'border-red-500 bg-red-900/10'
								: 'border-gray-600'} bg-gray-800 px-4 py-2 pr-12 text-green-100 placeholder-gray-400 focus:border-green-500 focus:outline-none"
							required
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
					{#if $errors.newPassword}
						<p class="mt-1 text-sm text-red-400">{$errors.newPassword}</p>
					{/if}
				</div>

				<div>
					<label for="confirmPassword" class="mb-2 block text-sm font-bold text-green-300">
						CONFIRM AUTHORIZATION CIPHER
					</label>
					<div class="relative">
						<input
							id="confirmPassword"
							name="confirmPassword"
							type={showConfirmPassword ? 'text' : 'password'}
							aria-invalid={$errors.confirmPassword ? 'true' : undefined}
							bind:value={$form.confirmPassword}
							placeholder="Confirm new cipher..."
							class="w-full rounded border {$errors.confirmPassword
								? 'border-red-500 bg-red-900/10'
								: 'border-gray-600'} bg-gray-800 px-4 py-2 pr-12 text-green-100 placeholder-gray-400 focus:border-green-500 focus:outline-none"
							required
						/>
						<button
							type="button"
							onclick={toggleConfirmPasswordVisibility}
							class="absolute top-1/2 right-3 -translate-y-1/2 text-gray-400 hover:text-green-300"
						>
							{#if showConfirmPassword}
								<Eye size={18} />
							{:else}
								<EyeOff size={18} />
							{/if}
						</button>
					</div>
					{#if $errors.confirmPassword}
						<p class="mt-1 text-sm text-red-400">{$errors.confirmPassword}</p>
					{/if}
				</div>

				<button
					type="submit"
					disabled={$delayed}
					class="w-full rounded bg-gradient-to-r from-green-700 to-green-600 px-4 py-3 font-bold text-black transition-colors hover:from-green-600 hover:to-green-500 disabled:cursor-not-allowed disabled:opacity-50"
				>
					{#if $delayed}
						<Lock class="mr-2 inline animate-pulse" size={18} />
						ESTABLISHING NEW CIPHER...
					{:else}
						<Lock class="mr-2 inline" size={18} />
						ESTABLISH NEW CIPHER
					{/if}
				</button>
			</form>

			<!-- Security Requirements -->
			<div class="rounded border border-yellow-600 bg-yellow-900/10 p-4 text-sm">
				<h3 class="mb-2 font-bold text-yellow-300">CIPHER SECURITY REQUIREMENTS</h3>
				<ul class="space-y-1 text-yellow-200">
					<li>• Minimum 8 characters in length</li>
					<li>• At least one lowercase letter (a-z)</li>
					<li>• At least one uppercase letter (A-Z)</li>
					<li>• At least one numeric digit (0-9)</li>
				</ul>
			</div>

			<!-- Back to Login -->
			<div class="space-y-3 border-t border-gray-700 pt-4 text-center">
				<a
					href="/auth"
					class="inline-flex items-center text-sm text-gray-400 transition-colors hover:text-red-300"
				>
					Return to Authorization Terminal
				</a>
			</div>
		</div>
	{/if}
</div>
