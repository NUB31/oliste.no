import { Vector2D } from '$lib/game-engine/Vector2D';
import { Node2D } from '$lib/game-engine/nodes/Node2D';
import { Ball } from './Ball';
import { Paddle } from './Paddle';

export class Board extends Node2D {
	private leftPaddle: Paddle;
	private rightPaddle: Paddle;
	private ball: Ball;
	public points: number = 0;
	public started: boolean = false;

	public constructor(width: number, height: number) {
		super(Vector2D.ZERO, width, height);
		this.leftPaddle = new Paddle(this, 'w', 's', '#ed4e42');
		this.rightPaddle = new Paddle(this, 'ArrowUp', 'ArrowDown', '#42a3ed');
		this.ball = new Ball(this, [this.leftPaddle, this.rightPaddle]);

		this.addChild(this.leftPaddle);
		this.addChild(this.rightPaddle);
		this.addChild(this.ball);

		this.reset();
	}

	private reset() {
		this.leftPaddle.reset(10);
		this.rightPaddle.reset(this.width - 10 - this.rightPaddle.width);
		this.ball.reset();
		this.points = 0;
	}

	public addPoint() {
		this.points++;
	}

	public start() {
		this.reset();
		this.started = true;
	}

	public stop() {
		this.started = false;
	}

	protected override process() {
		this.engine.eventHandler.preventDefault(' ');

		if (this.engine.eventHandler.wasPressed(' ')) {
			if (this.started == false) {
				this.reset();
				this.started = true;
			}
		}
	}

	protected override draw(context: CanvasRenderingContext2D): void {
		context.fillStyle = 'white';
		context.font = "12px 'Press Start 2P'";
		context.fillText(`${this.points} points`, 20, 30, this.width - 40);

		if (!this.started) {
			context.font = "16px 'Press Start 2P'";
			const startText = 'Press space to start';
			const measuredStartText = context.measureText(startText);
			context.fillText(startText, this.width / 2 - measuredStartText.width / 2, this.height / 4);
		}

		context.font = "8px 'Press Start 2P'";
		const leftPaddleText = `Use '${this.leftPaddle.upKey}' and '${this.leftPaddle.downKey}' to move the paddle`;
		context.fillText(leftPaddleText, 20, this.height - 20, this.width / 2);

		const rightPaddleText = `Use '${this.rightPaddle.upKey}' and '${this.rightPaddle.downKey}' to move the paddle`;
		const measuredRightPaddleText = context.measureText(rightPaddleText);
		context.fillText(
			rightPaddleText,
			this.width - measuredRightPaddleText.width - 20,
			this.height - 20,
			this.width / 2
		);
	}
}
