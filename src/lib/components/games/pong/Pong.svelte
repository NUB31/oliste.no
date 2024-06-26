<script lang="ts">
	import { onMount } from 'svelte';
	import { Board } from './Board';
	import { Engine } from '$lib/game-engine/Engine';
	import { Rect } from '$lib/game-engine/Rect';
	import { Vector2 } from '$lib/game-engine/Vector2';

	let canvas: HTMLCanvasElement;

	onMount(() => {
		const engine = new Engine(canvas, 858, 525);
		const board = new Board(new Rect(Vector2.ZERO, engine.width, engine.height));
		engine.root.addChild(board);

		return () => {
			engine._dispose();
		};
	});
</script>

<canvas id="canvas" bind:this={canvas}></canvas>

<style>
	canvas {
		border-radius: 8px;
		outline: 2px solid black;
	}
</style>
