<script>
	import { X } from '@lucide/svelte';
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
		Transmission failed. Please inform the sector administrator the details of your transmission
		request.
	</p>
</div>
