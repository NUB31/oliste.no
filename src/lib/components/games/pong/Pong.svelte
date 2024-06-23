<script lang="ts">
	import { onMount } from 'svelte';
	import { Board } from './Board';
	import { Engine2D } from '$lib/game-engine/Engine2D';
	import { Rect } from '$lib/game-engine/Rect';
	import { Vector2D } from '$lib/game-engine/Vector2D';

	let canvas: HTMLCanvasElement;

	onMount(() => {
		const engine = new Engine2D(canvas, 858, 525);
		const board = new Board(new Rect(Vector2D.ZERO, engine.width, engine.height));
		engine.root.addChild(board);

		return () => {
			engine._dispose();
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
