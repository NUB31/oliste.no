import { Rect } from '$lib/game-engine/Rect';
import { Vector2 } from '$lib/game-engine/Vector2';
import { LabelNode } from '$lib/game-engine/nodes/ui/LabelNode';
import { Node } from '$lib/game-engine/nodes/Node';
import { Ball } from './Ball';
import { Paddle } from './Paddle';

export class Board extends Node {
	private leftPaddle: Paddle;
	private rightPaddle: Paddle;
	private ball: Ball;
	private scoreLabel: LabelNode;
	private startGameLabel: LabelNode;
	private leftPaddleTutorialLabel: LabelNode;
	private rightPaddleTutorialLabel: LabelNode;
	public points: number = 0;
	public started: boolean = false;

	public constructor(rect: Rect) {
		super(rect);
		this.leftPaddle = new Paddle(this, 'w', 's', '#ed4e42');
		this.rightPaddle = new Paddle(this, 'ArrowUp', 'ArrowDown', '#42a3ed');
		this.ball = new Ball(this, [this.leftPaddle, this.rightPaddle]);

		this.scoreLabel = new LabelNode(new Rect(new Vector2(20, 20), this.rect.width - 40, 20));
		this.startGameLabel = new LabelNode(
			new Rect(new Vector2(20, this.rect.height / 3), this.rect.width - 40, 100),
			'Press space to start',
			{
				alignHorizontal: 'center',
				alignVertical: 'center',
				fontSize: 16
			}
		);

		this.leftPaddleTutorialLabel = new LabelNode(
			new Rect(new Vector2(20, rect.height - 30), this.rect.width / 2 - 20, 20),
			this.paddleTutorialMessage(this.leftPaddle),
			{
				fontSize: 8
			}
		);

		this.rightPaddleTutorialLabel = new LabelNode(
			new Rect(new Vector2(this.rect.width / 2, rect.height - 30), this.rect.width / 2 - 20, 20),
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
		this.scoreLabel.text = `${this.points} points`;
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
