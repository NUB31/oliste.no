<script lang="ts">
	import { onMount } from 'svelte';
	import { Engine2D } from '$lib/game-engine/Engine2D';
	import { Board } from './Board';

	let canvas: HTMLCanvasElement;

	onMount(() => {
		const engine = new Engine2D(canvas, 858, 525);
		const snake = new Board(engine.width, engine.height);
		engine.root.addChild(snake);

		return () => {
			engine.dispose();
		};
	});
</script>

<canvas bind:this={canvas}></canvas>

<style>
	canvas {
		border-radius: 8px;
		outline: 2px solid black;
	}
</style>
