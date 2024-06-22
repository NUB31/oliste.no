<script lang="ts">
	import { onMount } from 'svelte';
	import { getTabsContext } from './context';
	import { twMerge } from 'tailwind-merge';

	export let label: string;

	const id: string = `tab-${
		crypto.randomUUID
			? crypto.randomUUID()
			: Math.floor(Date.now() * Math.random() * 100).toString()
	}`;

	const context = getTabsContext();
	const { selectedTab } = context;

	onMount(() => {
		context.register({
			id: id,
			label: label
		});

		return () => {
			context.unregister(id);
		};
	});
</script>

{#if $selectedTab === id}
	<div
		{...$$restProps}
		class={twMerge('rounded-md bg-light-200 p-4 shadow-inner', $$restProps['class'])}
		role="tabpanel"
		aria-labelledby={id}
	>
		<slot />
	</div>
{/if}
