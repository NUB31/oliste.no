<script lang="ts">
	import { twMerge } from 'tailwind-merge';
	import { setTabsContext, type TabAbstract } from './context';
	import { writable, type Writable } from 'svelte/store';

	export let buttonClass = '';

	let tabs: TabAbstract[] = [];
	let selectedTab: Writable<string | null> = writable(null);

	function setTab(id: string): void {
		const tab = tabs.find((x) => x.id == id);
		if (tab) {
			$selectedTab = tab.id;
		}
	}

	function registerTab(tab: TabAbstract): void {
		tabs.push(tab);
		tabs = tabs;

		if (tabs.length === 1) {
			$selectedTab = tabs[0].id;
		}
	}

	function unregisterTab(id: string): void {
		tabs = tabs.filter((x) => x.id !== id);
	}

	function setFocus(tab: TabAbstract) {
		const tabEl = document.getElementById(tab.id);
		tabEl?.focus();
	}

	function onKeyDown(e: KeyboardEvent, tab: TabAbstract) {
		const index = tabs.findIndex((x) => x.id === tab.id);
		if (index === -1) return;

		switch (e.key) {
			case 'ArrowRight':
				e.preventDefault();
				if (tabs.length - 1 === index) {
					setFocus(tabs[0]);
				} else {
					setFocus(tabs[index + 1]);
				}
				break;
			case 'ArrowLeft':
				e.preventDefault();
				if (index === 0) {
					setFocus(tabs[tabs.length - 1]);
				} else {
					setFocus(tabs[index - 1]);
				}
				break;
			case 'Home':
				e.preventDefault();
				setFocus(tabs[0]);
				break;
			case 'End':
				e.preventDefault();
				setFocus(tabs[tabs.length - 1]);
				break;
		}
	}

	setTabsContext({
		register: registerTab,
		unregister: unregisterTab,
		selectedTab: selectedTab
	});
</script>

<div {...$$restProps} class={twMerge('flex flex-col gap-4', $$restProps['class'])}>
	<div
		role="tablist"
		aria-labelledby="tablist"
		class="flex gap-4 overflow-auto rounded-md bg-light-200 p-3 shadow-inner"
	>
		{#each tabs as tab, i}
			<button
				role="tab"
				type="button"
				id={tab.id}
				tabindex={$selectedTab === tab.id || ($selectedTab === null && i === 0) ? 0 : -1}
				aria-selected={$selectedTab === tab.id}
				aria-controls={tab.id}
				class={twMerge(
					`rounded-md border-2 border-light-300 bg-light-100 px-4 py-2 hover:border-blue-200 ${
						$selectedTab === tab.id ? 'border-blue-300' : ''
					}`,
					buttonClass
				)}
				on:click={() => setTab(tab.id)}
				on:keydown={(e) => onKeyDown(e, tab)}
			>
				{tab.label}
			</button>
		{/each}
	</div>

	<slot />
</div>
