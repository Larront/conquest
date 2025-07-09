<script lang="ts">
	import { supabase } from '$lib/supabaseClient';
	import type { Faction, User, UserFaction } from '$lib/types.js';
	import {
		X,
		Shield,
		UserIcon,
		Sword,
		Trophy,
		Calendar,
		Save,
		EyeOff,
		Eye,
		Plus,
		Edit,
		Trash2
	} from '@lucide/svelte';
	import { onMount } from 'svelte';
	import { superForm } from 'sveltekit-superforms';
	import { invalidateAll } from '$app/navigation';

	let { data } = $props();
	let {
		user,
		factions,
		userFactions
	}: { user: User; factions: Faction[] | null; userFactions: UserFaction[] } = $derived(data);
	const {
		form: passwordForm,
		errors: passwordErrors,
		message: passwordMessage,
		enhance: passwordEnhance,
		delayed: passwordDelayed
	} = superForm(data.passwordForm);
	const {
		form: userForm,
		errors: userErrors,
		message: userMessage,
		enhance: userEnhance,
		delayed: userDelayed
	} = superForm(data.userForm);
	const {
		form: factionForm,
		errors: factionErrors,
		message: factionMessage,
		enhance: factionEnhance,
		delayed: factionDelayed
	} = superForm(data.factionForm, {
		onResult: async ({ result }) => {
			if (result.type === 'success') {
				// Reset form state on successful submission
				cancelFactionEdit();
				// Manually invalidate all data to refresh the faction list
				await invalidateAll();
			}
		}
	});

	let activeTab = $state<'profile' | 'factions' | 'security'>('profile');
	// Form data
	let id = $state('');
	let battles_won = $state(0);
	let battles_lost = $state(0);
	let battles_drawn = $state(0);
	let total_points = $state(0);
	let created_at = $state('');

	let showPassword = $state(false);
	let showNewPassword = $state(false);
	let showConfirmPassword = $state(false);

	// Faction management state
	let editingFaction: UserFaction | null = $state(null);
	let showAddFactionForm = $state(false);

	function togglePasswordVisibility() {
		showPassword = !showPassword;
	}

	function toggleNewPasswordVisibility() {
		showNewPassword = !showNewPassword;
	}

	function toggleConfirmPasswordVisibility() {
		showConfirmPassword = !showConfirmPassword;
	}

	// Faction management functions
	function startEditFaction(faction: UserFaction) {
		editingFaction = faction;
		$factionForm.factionName = faction.faction_name;
		$factionForm.factionDisplayName = faction.faction_display_name;
		$factionForm.userFactionId = faction.id.toString();
		showAddFactionForm = false;
	}

	function startAddFaction() {
		editingFaction = null;
		$factionForm.factionName = '';
		$factionForm.factionDisplayName = '';
		$factionForm.userFactionId = '';
		showAddFactionForm = true;
	}

	function cancelFactionEdit() {
		editingFaction = null;
		showAddFactionForm = false;
		$factionForm.factionName = '';
		$factionForm.factionDisplayName = '';
		$factionForm.userFactionId = '';
	}

	onMount(() => {
		getProfile();
	});

	const getProfile = async () => {
		try {
			const { data, error, status } = await supabase
				.from('profiles')
				.select('username, battles_won, battles_lost, battles_drawn, total_points, created_at')
				.eq('id', user.id)
				.single();

			if (error && status !== 406) throw error;

			if (data) {
				id = user.id;
				battles_won = parseInt(data.battles_won);
				battles_lost = parseInt(data.battles_lost);
				battles_drawn = parseInt(data.battles_drawn);
				total_points = parseInt(data.total_points);
				created_at = data.created_at;

				// Auto-fill the form field with current username
				$userForm.username = data.username;
			}
		} catch (error) {
			if (error instanceof Error) {
				alert(error.message);
			}
		}
	};

	function getBattleRatio() {
		const total = battles_won + battles_lost + battles_drawn;
		return total > 0 ? ((battles_won / total) * 100).toFixed(1) : '0.0';
	}

	function getAccountAge() {
		const created = new Date(created_at);
		const now = new Date();
		const diffTime = Math.abs(now.getTime() - created.getTime());
		const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

		if (diffDays < 30) return `${diffDays} days`;
		if (diffDays < 365) return `${Math.floor(diffDays / 30)} months`;
		return `${Math.floor(diffDays / 365)} years`;
	}
</script>

<!-- Modal -->
<div
	class="relative top-[50%] left-[50%] my-8 w-full max-w-4xl translate-x-[-50%] translate-y-[-50%] rounded-lg border-2 border-yellow-600 bg-gradient-to-b from-gray-900 to-black shadow-2xl"
>
	<!-- Header -->
	<div
		class="flex items-center justify-between rounded-t-lg border-b-2 border-yellow-600 bg-gradient-to-r from-red-900 via-gray-900 to-red-900 p-4"
	>
		<div class="flex items-center gap-3">
			<UserIcon class="text-yellow-400" size={24} />
			<h2 class="text-xl font-bold tracking-wider text-yellow-200">++ SERVITOR RECORDS ++</h2>
		</div>
		<a href="/" class="text-yellow-200 transition-colors hover:text-red-400">
			<X size={20} />
		</a>
	</div>

	<!-- Tabs -->
	<div class="flex border-b border-gray-700">
		<button
			onclick={() => {
				activeTab = 'profile';
			}}
			class="flex items-center gap-2 px-6 py-3 text-sm font-bold transition-colors {activeTab ===
			'profile'
				? 'border-b-2 border-yellow-500 text-yellow-300'
				: 'text-gray-400 hover:text-yellow-200'}"
		>
			<UserIcon size={16} />
			Profile
		</button>
		<button
			onclick={() => {
				activeTab = 'factions';
			}}
			class="flex items-center gap-2 px-6 py-3 text-sm font-bold transition-colors {activeTab ===
			'factions'
				? 'border-b-2 border-yellow-500 text-yellow-300'
				: 'text-gray-400 hover:text-yellow-200'}"
		>
			<Sword size={16} />
			Factions
		</button>
		<button
			onclick={() => {
				activeTab = 'security';
			}}
			class="flex items-center gap-2 px-6 py-3 text-sm font-bold transition-colors {activeTab ===
			'security'
				? 'border-b-2 border-yellow-500 text-yellow-300'
				: 'text-gray-400 hover:text-yellow-200'}"
		>
			<Shield size={16} />
			Security
		</button>
	</div>

	<!-- Content -->
	<div class="max-h-[60vh] overflow-y-auto p-6">
		{#if activeTab === 'profile'}
			{#if $userMessage}
				<div class="mb-4 rounded border border-red-500 bg-red-900/20 p-3 text-sm text-red-300">
					{$userMessage}
				</div>
			{/if}

			<div class="grid gap-6 lg:grid-cols-2">
				<!-- Profile Information -->
				<div class="space-y-6">
					<div class="rounded border border-yellow-600 bg-gray-900/50 p-6">
						<h3 class="mb-4 flex items-center gap-2 text-lg font-bold text-yellow-300">
							<UserIcon size={20} />
							PROFILE INFORMATION
						</h3>

						<form class="space-y-4" method="POST" action="?/updateuser" use:userEnhance>
							<div>
								<label for="edit-username" class="mb-2 block text-sm font-bold text-yellow-300">
									SERVITOR DESIGNATION
								</label>
								<input
									id="edit-username"
									name="username"
									type="text"
									aria-invalid={$userErrors.username ? 'true' : undefined}
									bind:value={$userForm.username}
									class="w-full rounded border border-gray-600 bg-gray-800 px-4 py-2 text-yellow-100 focus:border-yellow-500 focus:outline-none"
								/>
								{#if $userErrors.username}
									<p class="mt-1 text-sm text-red-400">{$userErrors.username}</p>
								{/if}
							</div>

							<button
								type="submit"
								disabled={$userDelayed}
								class="flex items-center gap-2 rounded bg-gradient-to-r from-yellow-700 to-yellow-600 px-4 py-2 font-bold text-black transition-colors hover:from-yellow-600 hover:to-yellow-500 disabled:opacity-50"
							>
								<Save size={18} />
								{$userDelayed ? 'UPDATING...' : 'UPDATE PROFILE'}
							</button>
						</form>
					</div>

					<!-- Account Information -->
					<div class="rounded border border-yellow-600 bg-gray-900/50 p-6">
						<h3 class="mb-4 flex items-center gap-2 text-lg font-bold text-yellow-300">
							<Calendar size={20} />
							ACCOUNT INFORMATION
						</h3>

						<div class="space-y-3">
							<div class="flex justify-between">
								<span class="text-gray-400">Enlisted:</span>
								<span class="font-bold text-yellow-300"
									>{new Date(created_at).toLocaleDateString()}</span
								>
							</div>
							<div class="flex justify-between">
								<span class="text-gray-400">Servitor ID:</span>
								<span class="font-mono font-bold text-yellow-300">{id}</span>
							</div>
							<div class="flex justify-between">
								<span class="text-gray-400">Security Clearance:</span>
								<span class="font-bold text-green-400">ACTIVE</span>
							</div>
							<div class="flex justify-between">
								<span class="text-gray-400">Account Age:</span>
								<span class="font-bold text-yellow-300">{getAccountAge()}</span>
							</div>
						</div>
					</div>
				</div>

				<!-- Battle Statistics -->
				<div class="space-y-6">
					<div class="rounded border border-yellow-600 bg-gray-900/50 p-6">
						<h3 class="mb-4 flex items-center gap-2 text-lg font-bold text-yellow-300">
							<Sword size={20} />
							COMBAT RECORD
						</h3>

						<div class="mb-6 grid grid-cols-2 gap-4">
							<div class="text-center">
								<div class="text-2xl font-bold text-green-400">{battles_won}</div>
								<div class="text-sm text-gray-400">Victories</div>
							</div>
							<div class="text-center">
								<div class="text-2xl font-bold text-red-400">{battles_lost}</div>
								<div class="text-sm text-gray-400">Defeats</div>
							</div>
							<div class="text-center">
								<div class="text-2xl font-bold text-yellow-400">{battles_drawn}</div>
								<div class="text-sm text-gray-400">Draws</div>
							</div>
							<div class="text-center">
								<div class="text-2xl font-bold text-blue-400">{getBattleRatio()}%</div>
								<div class="text-sm text-gray-400">Win Rate</div>
							</div>
						</div>

						<div class="space-y-2">
							<div class="flex justify-between">
								<span class="text-gray-400">Total Points Earned:</span>
								<span class="font-bold text-yellow-300">{total_points}</span>
							</div>
							<div class="flex justify-between">
								<span class="text-gray-400">Battles Reported:</span>
								<span class="font-bold text-yellow-300">
									{battles_won + battles_lost + battles_drawn}
								</span>
							</div>
							<div class="flex justify-between">
								<span class="text-gray-400">Avg Points per Battle:</span>
								<span class="font-bold text-yellow-300">
									{(total_points / Math.max(1, battles_won + battles_lost + battles_drawn)).toFixed(
										0
									)}
								</span>
							</div>
						</div>
					</div>
				</div>
			</div>
		{:else if activeTab === 'factions'}
			<div class="space-y-6">
				<!-- Faction Management Header -->
				<div class="rounded border border-red-600 bg-red-900/10 p-4">
					<h3 class="mb-2 text-lg font-bold text-red-300">Faction Management</h3>
					<p class="text-sm text-gray-400">
						Manage your faction allegiances. You can control multiple factions and track separate
						battle statistics for each.
					</p>
				</div>

				<!-- General Error Message -->
				{#if $factionMessage}
					<div class="rounded border border-red-500 bg-red-900/20 p-4 text-red-300">
						{$factionMessage}
					</div>
				{/if}

				<!-- Add New Faction Button -->
				<div class="mb-6">
					<button
						type="button"
						onclick={startAddFaction}
						class="flex items-center gap-2 rounded bg-gradient-to-r from-green-700 to-green-600 px-4 py-2 font-bold text-white transition-colors hover:from-green-600 hover:to-green-500"
					>
						<Plus size={18} />
						Add New Faction
					</button>
				</div>

				<!-- Add/Edit Form -->
				{#if showAddFactionForm || editingFaction}
					<div
						class="rounded-lg border-2 border-yellow-600 bg-gradient-to-b from-gray-900 to-black p-6"
					>
						<h3 class="mb-4 text-xl font-bold text-yellow-300">
							{editingFaction ? '++ EDIT FACTION ++' : '++ ADD NEW FACTION ++'}
						</h3>

						<form method="POST" action="?/savefaction" use:factionEnhance class="space-y-4">
							{#if editingFaction}
								<input type="hidden" name="userFactionId" bind:value={$factionForm.userFactionId} />
							{/if}

							<div class="grid gap-4 md:grid-cols-2">
								<div>
									<label for="factionName" class="mb-2 block text-sm font-bold text-yellow-300">
										FACTION TYPE
									</label>
									<select
										id="factionName"
										name="factionName"
										bind:value={$factionForm.factionName}
										class="w-full rounded border border-gray-600 bg-gray-800 px-4 py-2 text-yellow-100 focus:border-yellow-500 focus:outline-none"
										required
									>
										<option value="">Select faction...</option>
										{#each factions! as faction (faction.name)}
											<option value={faction.name}>{faction.name} ({faction.allegiance})</option>
										{/each}
									</select>
									{#if $factionErrors.factionName}
										<p class="mt-1 text-sm text-red-400">{$factionErrors.factionName}</p>
									{/if}
								</div>

								<div>
									<label
										for="factionDisplayName"
										class="mb-2 block text-sm font-bold text-yellow-300"
									>
										DISPLAY NAME
									</label>
									<input
										id="factionDisplayName"
										name="factionDisplayName"
										type="text"
										bind:value={$factionForm.factionDisplayName}
										placeholder="e.g., Aaron's Thousand Sons, My Space Marines"
										class="w-full rounded border border-gray-600 bg-gray-800 px-4 py-2 text-yellow-100 placeholder-gray-400 focus:border-yellow-500 focus:outline-none"
										required
									/>
									{#if $factionErrors.factionDisplayName}
										<p class="mt-1 text-sm text-red-400">{$factionErrors.factionDisplayName}</p>
									{/if}
								</div>
							</div>

							<div class="flex gap-3">
								<button
									type="submit"
									disabled={$factionDelayed}
									class="rounded bg-gradient-to-r from-yellow-700 to-yellow-600 px-4 py-2 font-bold text-black transition-colors hover:from-yellow-600 hover:to-yellow-500 disabled:opacity-50"
								>
									{editingFaction ? 'Update Faction' : 'Add Faction'}
								</button>
								<button
									type="button"
									onclick={cancelFactionEdit}
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
					<h3 class="text-xl font-bold tracking-wider text-yellow-300">++ YOUR FACTIONS ++</h3>

					{#if userFactions.length === 0}
						<div class="rounded border border-gray-600 bg-gray-900/50 p-8 text-center">
							<p class="text-gray-400">
								No factions added yet. Add your first faction to start tracking battles!
							</p>
						</div>
					{:else}
						<div class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
							{#each userFactions as userFaction (userFaction.id)}
								<div
									class="rounded-lg border-2 border-red-600 bg-gradient-to-b from-gray-900 to-black p-4"
								>
									<div class="mb-3 flex items-center justify-between">
										<div class="flex items-center gap-2">
											<Sword class="text-red-400" size={20} />
											<h4 class="font-bold text-red-300">{userFaction.faction_display_name}</h4>
										</div>
										<div class="flex gap-2">
											<button
												type="button"
												onclick={() => startEditFaction(userFaction)}
												class="rounded bg-blue-600 p-1 text-white transition-colors hover:bg-blue-500"
												title="Edit faction"
											>
												<Edit size={14} />
											</button>
											<form
												method="POST"
												action="?/deletefaction"
												use:factionEnhance
												class="inline"
											>
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
		{:else if activeTab === 'security'}
			<form class="space-y-6" method="POST" action="?/updatepassword" use:passwordEnhance>
				<div class="rounded border border-red-600 bg-red-900/10 p-4">
					<h3 class="mb-2 text-lg font-bold text-red-300">Change Authorization Cipher</h3>
					<p class="text-sm text-gray-400">
						Update your access credentials. Ensure your new cipher is secure and memorable.
					</p>
				</div>
				{#if $passwordMessage}
					<div class="mb-4 rounded border border-red-500 bg-red-900/20 p-3 text-sm text-red-300">
						{$passwordMessage}
					</div>
				{/if}

				<div class="space-y-4">
					<div>
						<label for="current-password" class="mb-2 block text-sm font-bold text-yellow-300">
							CURRENT CIPHER
						</label>
						<input
							id="current-password"
							name="current-password"
							type={showPassword ? 'text' : 'password'}
							aria-invalid={$passwordErrors.currentPassword ? 'true' : undefined}
							bind:value={$passwordForm.currentPassword}
							placeholder="Enter current password..."
							class="w-full rounded border border-gray-600 bg-gray-800 px-4 py-2 text-yellow-100 placeholder-gray-400 focus:border-yellow-500 focus:outline-none"
						/>
						<button
							type="button"
							onclick={togglePasswordVisibility}
							class="absolute top-1/2 right-3 -translate-y-1/2 text-gray-400 hover:text-green-300"
						>
							{#if showPassword}
								<EyeOff size={18} />
							{:else}
								<Eye size={18} />
							{/if}
						</button>
					</div>

					<div>
						<label for="new-password" class="mb-2 block text-sm font-bold text-yellow-300">
							NEW CIPHER
						</label>
						<input
							id="new-password"
							name="new-password"
							type={showNewPassword ? 'text' : 'password'}
							aria-invalid={$passwordErrors.newPassword ? 'true' : undefined}
							bind:value={$passwordForm.newPassword}
							placeholder="Enter new password..."
							class="w-full rounded border border-gray-600 bg-gray-800 px-4 py-2 text-yellow-100 placeholder-gray-400 focus:border-yellow-500 focus:outline-none"
						/>
						<button
							type="button"
							onclick={toggleNewPasswordVisibility}
							class="absolute top-1/2 right-3 -translate-y-1/2 text-gray-400 hover:text-green-300"
						>
							{#if showNewPassword}
								<EyeOff size={18} />
							{:else}
								<Eye size={18} />
							{/if}
						</button>
					</div>

					<div>
						<label for="confirm-password" class="mb-2 block text-sm font-bold text-yellow-300">
							CONFIRM NEW CIPHER
						</label>
						<input
							id="confirm-password"
							name="confirm-password"
							type={showConfirmPassword ? 'text' : 'password'}
							aria-invalid={$passwordErrors.confirmPassword ? 'true' : undefined}
							bind:value={$passwordForm.confirmPassword}
							placeholder="Confirm new password..."
							class="w-full rounded border border-gray-600 bg-gray-800 px-4 py-2 text-yellow-100 placeholder-gray-400 focus:border-yellow-500 focus:outline-none"
						/>
						<button
							type="button"
							onclick={toggleConfirmPasswordVisibility}
							class="absolute top-1/2 right-3 -translate-y-1/2 text-gray-400 hover:text-green-300"
						>
							{#if showConfirmPassword}
								<EyeOff size={18} />
							{:else}
								<Eye size={18} />
							{/if}
						</button>
					</div>
				</div>

				<button
					type="submit"
					disabled={$passwordDelayed}
					class="flex items-center gap-2 rounded bg-gradient-to-r from-red-700 to-red-600 px-4 py-2 font-bold text-yellow-100 transition-colors hover:from-red-600 hover:to-red-500 disabled:opacity-50"
				>
					<Shield size={18} />
					{$passwordDelayed ? 'UPDATING...' : 'UPDATE CIPHER'}
				</button>
			</form>
		{/if}
	</div>
</div>
