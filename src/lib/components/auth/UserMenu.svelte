<script lang="ts">
	import { User as UserIcon, LogOut, Settings, Sword, Crown } from '@lucide/svelte';
	import { onMount } from 'svelte';
	import type { User } from '@supabase/supabase-js';
	import { supabase } from '$lib/supabaseClient';
	import { Popover } from 'bits-ui';
	import type { SubmitFunction } from '@sveltejs/kit';
	import { enhance } from '$app/forms';
	import { IsMobile } from '$lib/hooks/is-mobile.svelte';

	interface Props {
		user: User;
	}

	let { user }: Props = $props();

	let loading = $state(false);
	let username: string | null = $state(null);
	let faction: string | null = $state(null);
	let battles_won: number | null = $state(null);
	let battles_lost: number | null = $state(null);
	let battles_drawn: number | null = $state(null);

	onMount(() => {
		getProfile();
	});

	const getProfile = async () => {
		try {
			loading = true;
			const { data, error, status } = await supabase
				.from('profiles')
				.select('username, faction, battles_won, battles_lost, battles_drawn, total_points')
				.eq('id', user.id)
				.single();

			if (error && status !== 406) throw error;

			if (data) {
				username = data.username;
				faction = data.faction;
				battles_won = data.battles_won;
				battles_lost = data.battles_lost;
				battles_drawn = data.battles_drawn;
			}
		} catch (error) {
			if (error instanceof Error) {
				alert(error.message);
			}
		} finally {
			loading = false;
		}
	};

	let isMobile = new IsMobile();

	const handleSignOut: SubmitFunction = () => {
		loading = true;
		return async ({ update }) => {
			loading = false;
			update();
		};
	};
</script>

<Popover.Root>
	<Popover.Trigger
		class=" flex items-center gap-2 rounded border border-yellow-600 bg-gray-900/80 px-3 py-2 text-yellow-200 transition-colors hover:cursor-pointer hover:bg-gray-800"
	>
		<UserIcon size={18} />
		<span class="font-bold">{username}</span>
	</Popover.Trigger>
	<Popover.Portal>
		<Popover.Content side={isMobile ? 'bottom' : 'left'} class="z-50">
			<div class="mt-4 mr-2 w-64 rounded border border-yellow-600 bg-gray-900 shadow-2xl">
				<!-- User Info -->
				<div class="border-b border-gray-700 p-4">
					<div class="flex items-center gap-3">
						<div class="rounded-full bg-gradient-to-r from-red-600 to-purple-600 p-2">
							<UserIcon class="text-white" size={18} />
						</div>
						<div>
							<p class="font-bold text-yellow-200">{username}</p>
							<p class="text-sm text-gray-400">{faction}</p>
						</div>
					</div>

					<div class="mt-3 grid grid-cols-3 gap-2 text-xs">
						<div class="text-center">
							<div class="font-bold text-green-400">{battles_won}</div>
							<div class="text-gray-400">Victories</div>
						</div>
						<div class="text-center">
							<div class="font-bold text-red-400">{battles_lost}</div>
							<div class="text-gray-400">Defeats</div>
						</div>
						<div class="text-center">
							<div class="font-bold text-yellow-400">{battles_drawn}</div>
							<div class="text-gray-400">Draws</div>
						</div>
					</div>
				</div>

				<!-- Menu Items -->
				<div class="p-2">
					<a
						href="/private/user"
						class="flex w-full items-center gap-3 rounded px-3 py-2 text-left text-gray-300 transition-colors hover:bg-gray-800 hover:text-yellow-200"
					>
						<Settings size={16} />
						Account Settings
					</a>

					<form method="post" action="?/signout" use:enhance={handleSignOut}>
						<div>
							<button
								class="flex w-full items-center gap-3 rounded px-3 py-2 text-left text-gray-300 transition-colors hover:cursor-pointer hover:bg-gray-800 hover:text-red-400"
								disabled={loading}
							>
								<LogOut size={16} />
								Sign Out
							</button>
						</div>
					</form>
				</div>
			</div>
		</Popover.Content>
	</Popover.Portal>
</Popover.Root>
