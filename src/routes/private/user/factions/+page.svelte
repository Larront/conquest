<script lang="ts">
	import { Plus, Edit, Trash2, Sword, Shield, Users } from '@lucide/svelte';
	import { superForm } from 'sveltekit-superforms';

	let { data } = $props();
	let { userFactions, factions, form } = $derived(data);

	const { form: formData, errors, message, enhance, delayed } = superForm(form);

	let editingFaction: any = $state(null);
	let showAddForm = $state(false);

	function startEdit(faction: any) {
		editingFaction = faction;
		$formData.factionName = faction.faction_name;
		$formData.factionDisplayName = faction.faction_display_name;
		$formData.userFactionId = faction.id;
		showAddForm = false;
	}

	function startAdd() {
		editingFaction = null;
		$formData.factionName = '';
		$formData.factionDisplayName = '';
		$formData.userFactionId = '';
		showAddForm = true;
	}

	function cancelEdit() {
		editingFaction = null;
		showAddForm = false;
		$formData.factionName = '';
		$formData.factionDisplayName = '';
		$formData.userFactionId = '';
	}
</script>

<div class="min-h-screen bg-gradient-to-b from-gray-900 to-black p-6">
	<!-- Header -->
	<div class="mb-8">
		<div class="flex items-center justify-between">
			<div class="flex items-center gap-3">
				<Users class="text-red-400" size={32} />
				<div>
					<h1 class="text-3xl font-bold tracking-wider text-red-300">++ FACTION MANAGEMENT ++</h1>
					<p class="text-yellow-300">Manage your faction allegiances and battle records</p>
				</div>
			</div>
			<a
				href="/private/user"
				class="rounded border border-yellow-600 bg-gradient-to-r from-yellow-700 to-yellow-600 px-4 py-2 font-bold text-black transition-colors hover:from-yellow-600 hover:to-yellow-500"
			>
				← Back to Profile
			</a>
		</div>
	</div>

	<!-- General Error Message -->
	{#if $message}
		<div class="mb-6 rounded border border-red-500 bg-red-900/20 p-4 text-red-300">
			{$message}
		</div>
	{/if}

	<!-- Add New Faction Button -->
	<div class="mb-6">
		<button
			type="button"
			onclick={startAdd}
			class="flex items-center gap-2 rounded bg-gradient-to-r from-green-700 to-green-600 px-4 py-2 font-bold text-white transition-colors hover:from-green-600 hover:to-green-500"
		>
			<Plus size={18} />
			Add New Faction
		</button>
	</div>

	<!-- Add/Edit Form -->
	{#if showAddForm || editingFaction}
		<div class="mb-8 rounded-lg border-2 border-yellow-600 bg-gradient-to-b from-gray-900 to-black p-6">
			<h2 class="mb-4 text-xl font-bold text-yellow-300">
				{editingFaction ? '++ EDIT FACTION ++' : '++ ADD NEW FACTION ++'}
			</h2>

			<form method="POST" action="?/save" use:enhance class="space-y-4">
				{#if editingFaction}
					<input type="hidden" name="userFactionId" bind:value={$formData.userFactionId} />
				{/if}

				<div class="grid gap-4 md:grid-cols-2">
					<div>
						<label for="factionName" class="mb-2 block text-sm font-bold text-yellow-300">
							FACTION TYPE
						</label>
						<select
							id="factionName"
							name="factionName"
							bind:value={$formData.factionName}
							class="w-full rounded border border-gray-600 bg-gray-800 px-4 py-2 text-yellow-100 focus:border-yellow-500 focus:outline-none"
							required
						>
							<option value="">Select faction...</option>
							{#each factions as faction}
								<option value={faction.name}>{faction.name} ({faction.allegiance})</option>
							{/each}
						</select>
						{#if $errors.factionName}
							<p class="mt-1 text-sm text-red-400">{$errors.factionName}</p>
						{/if}
					</div>

					<div>
						<label for="factionDisplayName" class="mb-2 block text-sm font-bold text-yellow-300">
							DISPLAY NAME
						</label>
						<input
							id="factionDisplayName"
							name="factionDisplayName"
							type="text"
							bind:value={$formData.factionDisplayName}
							placeholder="e.g., Aaron's Thousand Sons, My Space Marines"
							class="w-full rounded border border-gray-600 bg-gray-800 px-4 py-2 text-yellow-100 placeholder-gray-400 focus:border-yellow-500 focus:outline-none"
							required
						/>
						{#if $errors.factionDisplayName}
							<p class="mt-1 text-sm text-red-400">{$errors.factionDisplayName}</p>
						{/if}
					</div>
				</div>

				<div class="flex gap-3">
					<button
						type="submit"
						disabled={$delayed}
						class="rounded bg-gradient-to-r from-yellow-700 to-yellow-600 px-4 py-2 font-bold text-black transition-colors hover:from-yellow-600 hover:to-yellow-500 disabled:opacity-50"
					>
						{editingFaction ? 'Update Faction' : 'Add Faction'}
					</button>
					<button
						type="button"
						onclick={cancelEdit}
						class="rounded border border-gray-600 bg-gray-800 px-4 py-2 text-gray-300 transition-colors hover:bg-gray-700"
					>
						Cancel
					</button>
				</div>
			</form>
		</div>
	{/if}

	<!-- User Factions List -->
	<div class="space-y-4">
		<h2 class="text-2xl font-bold tracking-wider text-yellow-300">++ YOUR FACTIONS ++</h2>

		{#if userFactions.length === 0}
			<div class="rounded border border-gray-600 bg-gray-900/50 p-8 text-center">
				<p class="text-gray-400">No factions added yet. Add your first faction to start tracking battles!</p>
			</div>
		{:else}
			<div class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
				{#each userFactions as userFaction}
					<div class="rounded-lg border-2 border-red-600 bg-gradient-to-b from-gray-900 to-black p-4">
						<div class="mb-3 flex items-center justify-between">
							<div class="flex items-center gap-2">
								<Sword class="text-red-400" size={20} />
								<h3 class="font-bold text-red-300">{userFaction.faction_display_name}</h3>
							</div>
							<div class="flex gap-2">
								<button
									type="button"
									onclick={() => startEdit(userFaction)}
									class="rounded bg-blue-600 p-1 text-white transition-colors hover:bg-blue-500"
									title="Edit faction"
								>
									<Edit size={14} />
								</button>
								<form method="POST" action="?/delete" use:enhance class="inline">
									<input type="hidden" name="userFactionId" value={userFaction.id} />
									<button
										type="submit"
										class="rounded bg-red-600 p-1 text-white transition-colors hover:bg-red-500"
										title="Delete faction"
										onclick={() => confirm('Are you sure you want to delete this faction?')}
									>
										<Trash2 size={14} />
									</button>
								</form>
							</div>
						</div>

						<div class="mb-3 text-sm text-gray-400">
							<span class="font-bold text-yellow-300">{userFaction.faction_name}</span>
						</div>

						<div class="space-y-2 text-sm">
							<div class="flex justify-between">
								<span class="text-green-400">Victories:</span>
								<span class="font-bold text-white">{userFaction.battles_won}</span>
							</div>
							<div class="flex justify-between">
								<span class="text-red-400">Defeats:</span>
								<span class="font-bold text-white">{userFaction.battles_lost}</span>
							</div>
							<div class="flex justify-between">
								<span class="text-yellow-400">Draws:</span>
								<span class="font-bold text-white">{userFaction.battles_drawn}</span>
							</div>
							<div class="flex justify-between border-t border-gray-600 pt-2">
								<span class="text-blue-400">Total Points:</span>
								<span class="font-bold text-white">{userFaction.total_points}</span>
							</div>
						</div>
					</div>
				{/each}
			</div>
		{/if}
	</div>
</div>