<script lang="ts">
	import { Skull, RefreshCw } from '@lucide/svelte';

	interface Props {
		children: any;
		fallback?: any;
	}

	let { children, fallback }: Props = $props();

	let hasError = $state(false);
	let errorMessage = $state('');

	// Basic error boundary implementation for Svelte
	function handleError(error: Error) {
		console.error('Error caught by boundary:', error);
		hasError = true;
		errorMessage = error.message || 'An unexpected error occurred';
	}

	function retry() {
		hasError = false;
		errorMessage = '';
	}

	// Handle promise rejections and uncaught errors
	$effect(() => {
		if (typeof window !== 'undefined') {
			const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
				handleError(new Error(event.reason?.message || 'Promise rejection'));
			};

			const handleGlobalError = (event: ErrorEvent) => {
				handleError(new Error(event.message || 'Global error'));
			};

			window.addEventListener('unhandledrejection', handleUnhandledRejection);
			window.addEventListener('error', handleGlobalError);

			return () => {
				window.removeEventListener('unhandledrejection', handleUnhandledRejection);
				window.removeEventListener('error', handleGlobalError);
			};
		}
	});
</script>

{#if hasError}
	{#if fallback}
		{@render fallback()}
	{:else}
		<div
			class="flex min-h-64 items-center justify-center rounded border border-red-600 bg-red-900/20 p-8"
		>
			<div class="text-center">
				<div class="mb-4 flex justify-center">
					<Skull class="text-red-400" size={48} />
				</div>
				<h3 class="mb-2 text-lg font-bold text-red-300">Something went wrong</h3>
				<p class="mb-4 text-sm text-red-200">{errorMessage}</p>
				<button
					onclick={retry}
					class="flex items-center gap-2 rounded bg-red-700 px-4 py-2 text-white transition-colors hover:bg-red-600"
				>
					<RefreshCw size={16} />
					Try Again
				</button>
			</div>
		</div>
	{/if}
{:else}
	{@render children()}
{/if}
