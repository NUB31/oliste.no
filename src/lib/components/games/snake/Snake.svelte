<script lang="ts">
	import { onMount } from 'svelte';
	import { Engine2D } from '$lib/game-engine/Engine2D';
	import { Snake } from './Snake';

	onMount(() => {
		const canvas = document.getElementById('canvas') as HTMLCanvasElement;
		const engine = new Engine2D(canvas, 858, 525);
		const snake = new Snake(engine.width, engine.height);
		engine.root.addChild(snake);

		return () => {
			engine.dispose();
		};
	});
</script>

<canvas id="canvas"></canvas>

<style>
	canvas {
		border-radius: 8px;
		outline: 2px solid black;
	}
</style>
