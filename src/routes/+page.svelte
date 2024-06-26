<script lang="ts">
	import Pong from '$lib/components/games/pong/Pong.svelte';
	import Tab from '$lib/components/tabs/Tab.svelte';
	import Tabs from '$lib/components/tabs/Tabs.svelte';
</script>

<div class="flex items-center flex-col my-8">
	<h1 class="font-medium text-4xl">Welcome!</h1>
	<div class="text-dark-200 mt-2">
		I dont really know what to put here, so enjoy some games while i think of something
	</div>
	<div class="text-dark-200 text-sm mt-2 italic">
		Tip: press escape to see the inner workings of the game engine
	</div>
</div>

<Tabs class="mt-5 flex flex-col items-center">
	<Tab label="Pong">
		<Pong />
	</Tab>
</Tabs>
