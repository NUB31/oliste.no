import { Vector2D } from '$lib/game-engine/Vector2D';
import { Node2D } from '$lib/game-engine/nodes/Node2D';

export class Snake extends Node2D {
	public points: number = 0;
	public started: boolean = false;

	public constructor(width: number, height: number) {
		super(Vector2D.ZERO, width, height);
	}

	public addPoint() {
		this.points++;
	}

	public start() {
		this.started = true;
	}

	public stop() {
		this.started = false;
	}

	protected override draw(context: CanvasRenderingContext2D): void {
		context.fillStyle = 'white';
		context.font = "16px 'Press Start 2P'";
		const text = 'This game has not been created yet';
		const measured = context.measureText(text);
		context.fillText(text, this.width / 2 - measured.width / 2, this.height / 4);
	}
}
