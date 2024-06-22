import { Vector2D } from '$lib/game-engine/Vector2D';
import { Node2D } from '$lib/game-engine/nodes/Node2D';
import { Food } from './Food';
import { Snake } from './Snake';

export class Board extends Node2D {
	public readonly gridAlign = 40;
	private snake: Snake;
	private food: Food;
	private points: number = 0;
	private started: boolean = false;
	private speed: number = 0.5;

	public constructor(width: number, height: number) {
		super(Vector2D.ZERO, width, height);
		this.snake = new Snake(this, this.speed);
		this.food = new Food(this);

		this.addChild(this.snake);
		this.addChild(this.food);
	}

	protected override onInitialized(): void {
		this.engine.eventHandler.onKeydown((e) => {
			switch (e.key) {
				case 'ArrowLeft':
					e.preventDefault();
					this.snake.setNextDirection(new Vector2D(-1, 0));
					break;
				case 'ArrowRight':
					e.preventDefault();
					this.snake.setNextDirection(new Vector2D(1, 0));
					break;
				case 'ArrowUp':
					e.preventDefault();
					this.snake.setNextDirection(new Vector2D(0, -1));
					break;
				case 'ArrowDown':
					e.preventDefault();
					this.snake.setNextDirection(new Vector2D(0, 1));
					break;

				default:
					break;
			}
		});
	}

	protected override process(delta: number): void {
		if (this.snake.intersects(this.food, -1)) {
			this.food.randomPos();
			this.points++;
			this.snake.grow();
		}
	}

	protected override draw(context: CanvasRenderingContext2D): void {
		context.fillStyle = 'white';
		context.font = "12px 'Press Start 2P'";
		context.fillText(`${this.points} points`, 20, 30, this.width - 40);

		if (!this.started) {
			context.font = "16px 'Press Start 2P'";
			const startText = 'Press an arrow key to start';
			const measuredStartText = context.measureText(startText);
			context.fillText(startText, this.width / 2 - measuredStartText.width / 2, this.height / 4);
		}
	}
}
