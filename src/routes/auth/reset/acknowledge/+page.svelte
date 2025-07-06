<script lang="ts">
	import { IsMobile } from '$lib/hooks/is-mobile.svelte';
	import { Mail, ArrowLeft, Clock, X } from '@lucide/svelte';

	const mobile = new IsMobile();
</script>

<svelte:head>
	<title>Recovery Request Transmitted - Conquest</title>
</svelte:head>

<div
	class="rounded-card-lg bg-background shadow-popover data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 relative top-[50%] left-[50%] z-50 w-full max-w-[calc(100%-2rem)] translate-x-[-50%] translate-y-[-50%] rounded-lg border-2 border-yellow-600 bg-gradient-to-b from-gray-900 to-black outline-hidden sm:max-w-[490px] md:w-full"
>
	<div
		class="flex items-center justify-between rounded-t-lg border-b-2 border-yellow-600 bg-gradient-to-r from-red-900 via-gray-900 to-red-900 p-4"
	>
		<div class="flex flex-1 items-center gap-3">
			<Mail class="text-green-400" size={24} />
			<h2
				class="{mobile.current
					? 'text-sm'
					: 'text-xl'} mx-auto font-bold tracking-wider text-green-300"
			>
				++ RECOVERY SENT ++
			</h2>
		</div>
		<a href="/" class="text-yellow-200 transition-colors hover:text-red-400">
			<X size={20} />
		</a>
	</div>

	<div class="space-y-3 p-6">
		<!-- Success Message -->
		<div class="rounded border border-green-500 bg-green-900/20 p-6 text-sm">
			<h2 class="mb-3 text-center text-lg font-bold text-green-300">
				Authorization Recovery Protocol Initiated
			</h2>
			<p class="mb-4 text-green-200">
				Your request for authorization restoration has been processed and transmitted to the
				Imperial communication network.
			</p>
			<div class="space-y-2 text-left text-green-200">
				<div class="flex items-center">
					<Clock class="mr-2 flex-shrink-0" size={16} />
					<span>Transmission may take up to 10 minutes to arrive</span>
				</div>
				<div class="flex items-center">
					<Mail class="mr-2 flex-shrink-0" size={16} />
					<span>Check your message archives if not received</span>
				</div>
			</div>
		</div>

		<!-- Instructions -->
		<div class="rounded border border-yellow-600 bg-yellow-900/10 p-4 text-sm">
			<h3 class="mb-2 text-center font-bold text-yellow-300">NEXT STEPS</h3>
			<ol class="space-y-1 text-left text-yellow-200">
				<li>1. Monitor your registered email designation</li>
				<li>2. Locate the secure restoration transmission</li>
				<li>3. Follow the embedded authorization link</li>
				<li>4. Establish new access credentials</li>
			</ol>
		</div>

		<!-- Troubleshooting -->
		<div class="rounded border border-red-600 bg-red-900/10 p-4 text-sm">
			<h3 class="mb-2 text-center font-bold text-red-300">TRANSMISSION NOT RECEIVED?</h3>
			<ul class="space-y-1 text-left text-red-200">
				<li>• Verify the email designation is correct</li>
				<li>• Check spam/quarantine archives</li>
				<li>• Wait 10-15 minutes before retry</li>
				<li>• Contact system administrators if issues persist</li>
			</ul>
		</div>

		<div class="space-y-3 border-t border-gray-700 pt-4 text-center">
			<a href="/auth/reset" class="text-sm text-gray-400 transition-colors hover:text-red-300">
				Request Another Recovery Transmission
			</a>
			<a
				href="/auth"
				class="inline-flex items-center text-sm text-gray-400 transition-colors hover:text-red-300"
			>
				Return to Authorization Terminal
			</a>
		</div>
	</div>
</div>
