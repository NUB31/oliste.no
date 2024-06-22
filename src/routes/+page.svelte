<script lang="ts">
	import Pong from '$lib/components/games/pong/Pong.svelte';
	import Snake from '$lib/components/games/snake/Snake.svelte';
	import Tab from '$lib/components/tabs/Tab.svelte';
	import Tabs from '$lib/components/tabs/Tabs.svelte';
</script>

<Tabs class="mt-5 flex flex-col items-center">
	<div>
		<Tab label="Pong">
			<Pong />
		</Tab>
		<Tab label="Snake">
			<Snake />
		</Tab>
	</div>
</Tabs>
