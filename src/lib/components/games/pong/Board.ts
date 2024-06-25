import { Rect } from '$lib/game-engine/Rect';
import { Vector2D } from '$lib/game-engine/Vector2D';
import { Label2D } from '$lib/game-engine/nodes/ui/Label2D';
import { Node2D } from '$lib/game-engine/nodes/Node2D';
import { Ball } from './Ball';
import { Paddle } from './Paddle';

export class Board extends Node2D {
	private leftPaddle: Paddle;
	private rightPaddle: Paddle;
	private ball: Ball;
	private scoreLabel: Label2D;
	private startGameLabel: Label2D;
	private leftPaddleTutorialLabel: Label2D;
	private rightPaddleTutorialLabel: Label2D;
	public points: number = 0;
	public started: boolean = false;

	public constructor(rect: Rect) {
		super(rect);
		this.leftPaddle = new Paddle(this, 'w', 's', '#ed4e42');
		this.rightPaddle = new Paddle(this, 'ArrowUp', 'ArrowDown', '#42a3ed');
		this.ball = new Ball(this, [this.leftPaddle, this.rightPaddle]);

		this.scoreLabel = new Label2D(
			new Rect(new Vector2D(20, 20), this.rect.width - 40, 20),
			'0 points'
		);
		this.startGameLabel = new Label2D(
			new Rect(new Vector2D(20, this.rect.height / 3), this.rect.width - 40, 100),
			'Press space to start',
			{
				alignHorizontal: 'center',
				alignVertical: 'center',
				fontSize: 16
			}
		);

		this.leftPaddleTutorialLabel = new Label2D(
			new Rect(new Vector2D(20, rect.height - 30), this.rect.width / 2 - 20, 20),
			this.paddleTutorialMessage(this.leftPaddle),
			{
				fontSize: 8
			}
		);

		this.rightPaddleTutorialLabel = new Label2D(
			new Rect(new Vector2D(this.rect.width / 2, rect.height - 30), this.rect.width / 2 - 20, 20),
			this.paddleTutorialMessage(this.rightPaddle),
			{
				alignHorizontal: 'right',
				fontSize: 8
			}
		);

		this.addChild(this.leftPaddle);
		this.addChild(this.rightPaddle);
		this.addChild(this.ball);

		this.addChild(this.scoreLabel);
		this.addChild(this.leftPaddleTutorialLabel);
		this.addChild(this.rightPaddleTutorialLabel);
		this.addChild(this.startGameLabel);

		this.reset();
	}

	private paddleTutorialMessage(paddle: Paddle) {
		return `Use '${paddle.upKey}' and '${paddle.downKey}' to move the paddle`;
	}

	private reset() {
		this.leftPaddle.reset(10);
		this.rightPaddle.reset(this.rect.width - 10 - this.rightPaddle.rect.width);
		this.ball.reset();
		this.points = 0;
	}

	public addPoint() {
		this.points++;
		this.scoreLabel.text = `${this.points} points`;
	}

	public start() {
		this.reset();
		this.started = true;
		this.startGameLabel.shouldDraw = false;
		this.leftPaddleTutorialLabel.shouldDraw = false;
		this.rightPaddleTutorialLabel.shouldDraw = false;
	}

	public stop() {
		this.started = false;
		this.startGameLabel.shouldDraw = true;
		this.leftPaddleTutorialLabel.shouldDraw = true;
		this.rightPaddleTutorialLabel.shouldDraw = true;
	}

	protected override process() {
		if (this.engine.eventHandler.wasKeyPressed(' ')) {
			if (this.started == false) {
				this.start();
			}
		}
	}
}
