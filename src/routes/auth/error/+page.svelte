<script lang="ts">
	import { X } from '@lucide/svelte';
	import { page } from '$app/state';

	const reason: string | null = page.url.searchParams.get('reason');
	const error: string | null = page.url.searchParams.get('error');

	function getErrorMessage(reason: string | null): string {
		switch (reason) {
			case 'missing_token':
				return 'Email verification link is missing required authentication token.';
			case 'missing_type':
				return 'Email verification link is missing verification type.';
			case 'verification_failed':
				return 'Email verification failed. The link may have expired or already been used.';
			case 'email_client_scanning':
				return 'Your email client may have scanned the verification link automatically. Please try clicking the link again, or request a new verification email.';
			case 'unexpected_error':
				return 'An unexpected error occurred during verification.';
			case 'unexpected_fallback':
				return 'Email verification encountered an unexpected condition.';
			default:
				return 'Transmission failed. Please inform the sector administrator the details of your transmission request.';
		}
	}

	function getHelpText(reason: string | null): string | null {
		switch (reason) {
			case 'email_client_scanning':
				return "Some email clients (Gmail, Outlook) automatically scan links for security. If clicking the link again doesn't work, please request a new verification email.";
			case 'verification_failed':
				return 'Verification links expire after 24 hours and can only be used once. Please request a new verification email if this link has expired.';
			default:
				return null;
		}
	}
</script>

<div
	class="relative top-[50%] left-[50%] my-8 w-full max-w-4xl translate-x-[-50%] translate-y-[-50%] rounded border border-red-500 bg-red-900/20 p-3 text-sm text-red-300"
>
	<h3 class="mb-2 text-lg font-bold text-red-300">Error</h3>
	<a
		href="/auth"
		class="absolute top-1 right-1 text-yellow-200 transition-colors hover:text-red-400"
	>
		<X size={20} />
	</a>
	<p class="text-sm text-gray-400">
		{getErrorMessage(reason)}
	</p>
	{#if getHelpText(reason)}
		<div class="mt-3 rounded border border-yellow-600 bg-yellow-900/20 p-3">
			<p class="text-sm text-yellow-300">
				💡 {getHelpText(reason)}
			</p>
		</div>
	{/if}
	{#if reason === 'email_client_scanning' || reason === 'verification_failed'}
		<div class="mt-3 text-center">
			<a
				href="/auth"
				class="inline-block rounded bg-yellow-700 px-4 py-2 text-sm font-bold text-black transition-colors hover:bg-yellow-600"
			>
				Request New Verification Email
			</a>
		</div>
	{/if}
	{#if error}
		<p class="mt-2 text-xs text-gray-500">
			Technical details: {error}
		</p>
	{/if}
	{#if reason}
		<p class="mt-2 text-xs text-gray-600">
			Error code: {reason}
		</p>
	{/if}
</div>
