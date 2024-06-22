import { Vector2D } from '$lib/game-engine/Vector2D';
import { Node2D } from '$lib/game-engine/nodes/Node2D';
import type { Board } from './Board';

export class Snake extends Node2D {
	private direction: Vector2D = Vector2D.ZERO;
	private nextDirection: Vector2D = Vector2D.ZERO;
	private nextDirectionChange: Vector2D = Vector2D.ZERO;
	private speed: number;
	private board: Board;
	private tail: {
		position: Vector2D;
		direction: Vector2D;
		nextDirection: Vector2D;
	}[] = [];

	public constructor(board: Board, speed: number) {
		super(Vector2D.ZERO, board.gridAlign, board.gridAlign);
		this.speed = speed;
		this.board = board;
	}

	private applyNextDirection() {
		this.direction = this.nextDirection;
		this.nextDirectionChange = this.position
			.copy()
			.add(this.direction.copy().scale(this.board.gridAlign))
			.align(this.board.gridAlign);
		this.position.align(this.board.gridAlign);

		for (let i = 0; i < this.tail.length; i++) {
			const t = this.tail[i];
			t.direction = t.nextDirection.copy();
			t.nextDirection = i == 0 ? this.nextDirection.copy() : this.tail[i - 1].direction.copy();
			t.position.align(this.board.gridAlign);
		}
	}

	public setNextDirection(direction: Vector2D) {
		const isValidDirection = !this.direction.copy().add(direction).equals(Vector2D.ZERO);
		if (isValidDirection) {
			this.nextDirection = direction;
		}

		// When the snake is not moving at the start of the game
		if (this.direction.equals(Vector2D.ZERO)) {
			this.applyNextDirection();
			return;
		}
	}

	public grow() {
		const lastTail = this.tail[this.tail.length - 1] ?? {
			position: this.position,
			direction: this.direction,
			nextDirection: this.nextDirection
		};

		this.tail.push({
			position: lastTail.position
				.copy()
				.add(
					new Vector2D(-lastTail.direction.x, -lastTail.direction.y)
						.scale(this.board.gridAlign)
						.align(this.board.gridAlign)
				),
			direction: lastTail.direction.copy(),
			nextDirection: lastTail.direction.copy()
		});
	}

	protected override process(delta: number): void {
		this.position.add(this.direction, delta * this.speed);
		this.tail.forEach((t, i) => {
			if (i === 0) {
				t.position.add(t.direction, delta * this.speed);
			} else {
				const prev = this.tail[i - 1];
				t.position = prev.position.copy().subtract(t.direction.copy().scale(this.board.gridAlign));
			}
		});

		if (
			(this.direction.x === 1 && this.position.x >= this.nextDirectionChange.x) ||
			(this.direction.x === -1 && this.position.x <= this.nextDirectionChange.x) ||
			(this.direction.y === 1 && this.position.y >= this.nextDirectionChange.y) ||
			(this.direction.y === -1 && this.position.y <= this.nextDirectionChange.y)
		) {
			this.applyNextDirection();
		}
	}

	protected override draw(context: CanvasRenderingContext2D): void {
		context.fillStyle = 'green';
		context.fillRect(this.position.x, this.position.y, this.width, this.height);

		context.fillStyle = 'blue';
		this.tail.forEach((t) => {
			context.fillRect(t.position.x, t.position.y, this.width, this.height);
		});
	}
}
