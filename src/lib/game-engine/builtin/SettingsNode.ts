import { Rect } from '../Rect';
import { Vector2D } from '../Vector2D';
import { Node2D } from '../nodes/Node2D';
import { Sprite2D } from '../nodes/Sprite2D';
import { ColorTexture } from '../textures/ColorTexture';
import { cssVar } from '../utils/color';

export class SettingsNode extends Node2D {
	private readonly padding: number = 50;
	private clickHandler: () => void = () => {};
	private keyHandler: () => void = () => {};

	public constructor(width: number, height: number) {
		super(new Rect(Vector2D.ZERO, width, height));

		this.addChild(
			new Sprite2D(
				new Rect(
					new Vector2D(this.rect.position.x + 50, this.rect.position.y + 50),
					this.rect.width - 100,
					this.rect.height - 100
				),
				new ColorTexture(cssVar('--light-400'))
			)
		);
	}

	protected onInitialized(): void {
		this.clickHandler = this.engine.eventHandler.onClick((mousePos) => {
			if (
				this.shouldProcess &&
				!new Rect(
					new Vector2D(this.rect.position.x + this.padding, this.rect.position.y + this.padding),
					this.rect.width - this.padding * 2,
					this.rect.height - this.padding * 2
				).wrapsPosition(mousePos)
			) {
				this.shouldDraw = false;
				this.shouldProcess = false;
				return true;
			} else {
				return false;
			}
		});

		this.keyHandler = this.engine.eventHandler.onKeyDown((key) => {
			if (this.shouldProcess && key == 'Escape') {
				this.shouldDraw = false;
				this.shouldProcess = false;
				return true;
			} else {
				return false;
			}
		});
	}

	protected override draw(context: CanvasRenderingContext2D, mousePos: Vector2D): void {
		context.fillStyle = cssVar('--light-400');
		context.fillRect(
			this.rect.position.x + this.padding,
			this.rect.position.y + this.padding,
			this.rect.width - this.padding * 2,
			this.rect.height - this.padding * 2
		);
	}

	protected override dispose(): void {
		this.clickHandler();
	}
}
