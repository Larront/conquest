<script>
	import { CheckCircle, Mail } from '@lucide/svelte';
</script>

<div
	class="rounded-card-lg bg-background shadow-popover data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 relative top-[50%] left-[50%] z-50 w-full max-w-[calc(100%-2rem)] translate-x-[-50%] translate-y-[-50%] rounded-lg border-2 border-yellow-600 bg-gradient-to-b from-gray-900 to-black outline-hidden sm:max-w-[490px] md:w-full"
>
	<div
		class="flex items-center justify-center border-b-2 border-yellow-600 bg-gradient-to-r from-red-900 via-gray-900 to-red-900 p-6"
	>
		<div class="flex flex-col gap-1 text-center">
			<h2 class="text-xl font-bold tracking-wider text-yellow-200">++ VOXCAST TRANSMITTED ++</h2>
			<p class="text-xs tracking-wide text-yellow-300 opacity-75">
				AUTHENTICATION PROTOCOL INITIATED
			</p>
		</div>
	</div>

	<div class="p-6 text-center">
		<div
			class="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full border-2 border-green-500 bg-green-900/20"
		>
			<CheckCircle class="animate-pulse text-green-400" size={24} />
		</div>

		<div class="mb-3 space-y-3">
			<h3 class="text-lg font-bold tracking-wide text-yellow-200">REGISTRATION ACKNOWLEDGED</h3>
			<p class="text-sm leading-relaxed text-yellow-100">
				Your credentials have been logged in system archives. A verification vox has been
				transmitted to your communication array.
			</p>
		</div>

		<div class="mb-6 text-sm text-yellow-100">
			<p class="text-center">
				Check your email and activate the verification link to complete authorization. Acknowledge
				once completed to sign in.
			</p>
		</div>

		<a
			href="/auth"
			class="m-6 w-full rounded border border-yellow-600 bg-yellow-700 px-6 py-3 font-bold text-black transition-colors hover:bg-yellow-600 focus:ring-2 focus:ring-yellow-400 focus:outline-none"
		>
			ACKNOWLEDGE & SIGN IN
		</a>
	</div>
</div>
