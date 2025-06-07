<script lang="ts">
	import { supabase } from '$lib/supabaseClient';
	import type { Faction, User } from '$lib/types.js';
	import { X, Shield, UserIcon, Sword, Trophy, Calendar, Save } from '@lucide/svelte';
	import { onMount } from 'svelte';

	let { data } = $props();
	let { user, factions }: { user: User; factions: Faction[] | null } = $derived(data);

	let activeTab = $state<'profile' | 'stats' | 'security'>('profile');
	let isLoading = $state(false);
	let message = $state('');
	let messageType = $state<'success' | 'error'>('success');

	// Form data
	let username = $state('');
	let id = $state('');
	let faction = $state('');
	let currentPassword = $state('');
	let newPassword = $state('');
	let confirmPassword = $state('');
	let battles_won = $state(0);
	let battles_lost = $state(0);
	let battles_drawn = $state(0);
	let total_points = $state(0);
	let created_at = $state('');

	let matching_passwords = $derived(confirmPassword == newPassword);

	onMount(() => {
		getProfile();
	});

	const getProfile = async () => {
		try {
			isLoading = true;
			const { data, error, status } = await supabase
				.from('profiles')
				.select(
					'username, faction, battles_won, battles_lost, battles_drawn, total_points, created_at'
				)
				.eq('id', user.id)
				.single();

			if (error && status !== 406) throw error;

			if (data) {
				username = data.username;
				faction = data.faction;
				id = user.id;
				battles_won = parseInt(data.battles_won);
				battles_lost = parseInt(data.battles_lost);
				battles_drawn = parseInt(data.battles_drawn);
				total_points = parseInt(data.total_points);
				created_at = data.created_at;
			}
		} catch (error) {
			if (error instanceof Error) {
				alert(error.message);
			}
		} finally {
			isLoading = false;
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
			<div>
				<h2 class="text-xl font-bold tracking-wider text-yellow-200">++ SERVITOR RECORDS ++</h2>
				<p class="text-sm text-yellow-300">{username} • {faction}</p>
			</div>
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
				message = '';
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
				activeTab = 'stats';
				message = '';
			}}
			class="flex items-center gap-2 px-6 py-3 text-sm font-bold transition-colors {activeTab ===
			'stats'
				? 'border-b-2 border-yellow-500 text-yellow-300'
				: 'text-gray-400 hover:text-yellow-200'}"
		>
			<Trophy size={16} />
			Statistics
		</button>
		<button
			onclick={() => {
				activeTab = 'security';
				message = '';
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
		{#if message}
			<div
				class="mb-4 rounded border {messageType === 'success'
					? 'border-green-500 bg-green-900/20 text-green-300'
					: 'border-red-500 bg-red-900/20 text-red-300'} p-3 text-sm"
			>
				{message}
			</div>
		{/if}

		{#if activeTab === 'profile'}
			<form class="space-y-6">
				<div class="grid gap-6 md:grid-cols-2">
					<div>
						<label for="edit-username" class="mb-2 block text-sm font-bold text-yellow-300">
							SERVITOR DESIGNATION
						</label>
						<input
							id="edit-username"
							type="text"
							bind:value={username}
							class="w-full rounded border border-gray-600 bg-gray-800 px-4 py-2 text-yellow-100 focus:border-yellow-500 focus:outline-none"
							required
						/>
					</div>

					<div>
						<label for="edit-email" class="mb-2 block text-sm font-bold text-yellow-300">
							VOX TRANSMISSION CODE
						</label>
						<input
							id="edit-email"
							type="email"
							class="w-full rounded border border-gray-600 bg-gray-800 px-4 py-2 text-yellow-100 focus:border-yellow-500 focus:outline-none"
							required
						/>
					</div>
				</div>

				<div>
					<label for="edit-faction" class="mb-2 block text-sm font-bold text-yellow-300">
						ALLEGIANCE
					</label>
					<select
						id="edit-faction"
						bind:value={faction}
						class="w-full rounded border border-gray-600 bg-gray-800 px-4 py-2 text-yellow-100 focus:border-yellow-500 focus:outline-none"
					>
						{#each factions! as factionOption}
							<option value={factionOption.name}>{factionOption.name}</option>
						{/each}
					</select>
				</div>

				<button
					type="submit"
					disabled={isLoading}
					class="flex items-center gap-2 rounded bg-gradient-to-r from-yellow-700 to-yellow-600 px-4 py-2 font-bold text-black transition-colors hover:from-yellow-600 hover:to-yellow-500 disabled:opacity-50"
				>
					<Save size={18} />
					{isLoading ? 'UPDATING...' : 'UPDATE PROFILE'}
				</button>
			</form>
		{:else if activeTab === 'stats'}
			<div class="space-y-6">
				<!-- Battle Statistics -->
				<div class="rounded border border-yellow-600 bg-gray-900/50 p-6">
					<h3 class="mb-4 flex items-center gap-2 text-lg font-bold text-yellow-300">
						<Sword size={20} />
						COMBAT RECORD
					</h3>

					<div class="mb-6 grid grid-cols-2 gap-4 md:grid-cols-4">
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
							<div class="text-2xl font-bold text-blue-400">{getBattleRatio()}</div>
							<div class="text-sm text-gray-400">Win Rate</div>
						</div>
					</div>

					<div class="grid gap-4 md:grid-cols-2">
						<div class="space-y-2">
							<div class="flex justify-between">
								<span class="text-gray-400">Total Points Earned:</span>
								<span class="font-bold text-yellow-300">{total_points}</span>
							</div>
							<div class="flex justify-between">
								<span class="text-gray-400">Account Age:</span>
								<span class="font-bold text-yellow-300">{getAccountAge()}</span>
							</div>
						</div>

						<div class="space-y-2">
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

				<!-- Account Info -->
				<div class="rounded border border-yellow-600 bg-gray-900/50 p-6">
					<h3 class="mb-4 flex items-center gap-2 text-lg font-bold text-yellow-300">
						<Calendar size={20} />
						ACCOUNT INFORMATION
					</h3>

					<div class="space-y-3">
						<div class="flex justify-between">
							<span class="text-gray-400">Enlisted:</span>
							<span class="font-bold text-yellow-300"> {new Date(created_at)} </span>
						</div>
						<div class="flex justify-between">
							<span class="text-gray-400">Servitor ID:</span>
							<span class="font-mono font-bold text-yellow-300">{id}</span>
						</div>
						<div class="flex justify-between">
							<span class="text-gray-400">Security Clearance:</span>
							<span class="font-bold text-green-400">ACTIVE</span>
						</div>
					</div>
				</div>
			</div>
		{:else if activeTab === 'security'}
			<form class="space-y-6">
				<div class="rounded border border-red-600 bg-red-900/10 p-4">
					<h3 class="mb-2 text-lg font-bold text-red-300">Change Authorization Cipher</h3>
					<p class="text-sm text-gray-400">
						Update your access credentials. Ensure your new cipher is secure and memorable.
					</p>
				</div>

				<div class="space-y-4">
					<div>
						<label for="current-password" class="mb-2 block text-sm font-bold text-yellow-300">
							CURRENT CIPHER
						</label>
						<input
							id="current-password"
							name="current-password"
							type="password"
							bind:value={currentPassword}
							placeholder="Enter current password..."
							class="w-full rounded border border-gray-600 bg-gray-800 px-4 py-2 text-yellow-100 placeholder-gray-400 focus:border-yellow-500 focus:outline-none"
							required
						/>
					</div>

					<div>
						<label for="new-password" class="mb-2 block text-sm font-bold text-yellow-300">
							NEW CIPHER
						</label>
						<input
							id="new-password"
							name="new-password"
							type="password"
							bind:value={newPassword}
							placeholder="Enter new password..."
							class="w-full rounded border border-gray-600 bg-gray-800 px-4 py-2 text-yellow-100 placeholder-gray-400 focus:border-yellow-500 focus:outline-none"
							required
						/>
					</div>

					<div>
						<label for="confirm-password" class="mb-2 block text-sm font-bold text-yellow-300">
							CONFIRM NEW CIPHER
						</label>
						<input
							id="confirm-password"
							name="confirm-password"
							type="password"
							bind:value={confirmPassword}
							placeholder="Confirm new password..."
							class="w-full rounded border border-gray-600 bg-gray-800 px-4 py-2 text-yellow-100 placeholder-gray-400 focus:border-yellow-500 focus:outline-none"
							required
						/>
					</div>
					{#if !matching_passwords}
						<div class="rounded border border-red-600 bg-red-900/10 p-4">
							<p class="text-sm text-gray-400">Error: Ciphers do not match.</p>
						</div>
					{/if}
				</div>

				<button
					type="submit"
					disabled={isLoading || !matching_passwords}
					class="flex items-center gap-2 rounded bg-gradient-to-r from-red-700 to-red-600 px-4 py-2 font-bold text-yellow-100 transition-colors hover:from-red-600 hover:to-red-500 disabled:opacity-50"
				>
					<Shield size={18} />
					{isLoading && confirmPassword != newPassword ? 'UPDATING...' : 'UPDATE CIPHER'}
				</button>
			</form>
		{/if}
	</div>
</div>
