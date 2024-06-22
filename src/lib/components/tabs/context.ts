import { getContext, setContext } from 'svelte';
import type { Writable } from 'svelte/store';

type TabsContext = {
	register: (tab: TabAbstract) => void;
	unregister: (id: string) => void;
	selectedTab: Writable<string | null>;
};

export type TabAbstract = {
	id: string;
	label: string;
};

export function setTabsContext(context: TabsContext): void {
	setContext('tabs', context);
}

export function getTabsContext(): TabsContext {
	return getContext('tabs') as TabsContext;
}
