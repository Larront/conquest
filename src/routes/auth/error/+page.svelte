<script>
	import { X } from '@lucide/svelte';
</script>

<div
	class="relative top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] rounded border border-red-500 bg-red-900/20 p-3 text-sm text-red-300"
>
	Error
	<a href="/auth" class="text-yellow-200 transition-colors hover:text-red-400">
		<X size={20} />
	</a>
</div>
