import { Vector2 } from '../../Vector2';
import { ColorTexture } from '../../textures/ColorTexture';
import { Rect } from '../../Rect';
import { Node } from '../Node';
import { SpriteNode } from '../SpriteNode';
import { LabelNode } from './LabelNode';
import { cssVar } from '../../utils/color';

interface ButtonNodeOptions {
	color?: string;
	hoverColor?: string;
	clickColor?: string;
	backgroundColor?: string;
	hoverBackgroundColor?: string;
	clickBackgroundColor?: string;
	borderColor?: string;
	hoverBorderColor?: string;
	clickBorderColor?: string;
	fontFamily?: string;
	fontSize?: number;
	cornerRadius?: number;
}

export class ButtonNode extends Node {
	public onClick: () => void;

	private unsubscribeClickHandler: () => void = () => {};

	private color: string;
	private hoverColor: string;
	private clickColor: string;

	private backgroundColor: string;
	private hoverBackgroundColor: string;
	private clickBackgroundColor: string;

	private borderColor: string;
	private hoverBorderColor: string;
	private clickBorderColor: string;

	private label: LabelNode;
	private borderTexture: ColorTexture;
	private backgroundTexture: ColorTexture;

	public set text(value: string) {
		this.label.text = value;
	}

	public constructor(
		position: Rect,
		text: string,
		onClick: () => void,
		options: ButtonNodeOptions = {}
	) {
		super(position);

		this.onClick = onClick;

		this.color = options.color ?? cssVar('--dark-50');
		this.hoverColor = options.hoverColor ?? cssVar('--dark-100');
		this.clickColor = options.clickColor ?? cssVar('--dark-200');

		this.backgroundColor = options.backgroundColor ?? cssVar('--light-200');
		this.hoverBackgroundColor = options.hoverBackgroundColor ?? cssVar('--light-100');
		this.clickBackgroundColor = options.clickBackgroundColor ?? cssVar('--light-50');

		this.borderColor = options.borderColor ?? cssVar('--light-50');
		this.hoverBorderColor = options.hoverBorderColor ?? cssVar('--light-50');
		this.clickBorderColor = options.clickBorderColor ?? cssVar('--light-50');

		this.label = new LabelNode(this.rect, text, {
			alignHorizontal: 'center',
			alignVertical: 'center',
			color: this.color,
			fontFamily: options.fontFamily,
			fontSize: options.fontSize
		});

		this.borderTexture = new ColorTexture(this.borderColor, options.cornerRadius ?? 4);
		this.addChild(new SpriteNode(position, this.borderTexture));

		this.backgroundTexture = new ColorTexture(this.backgroundColor, options.cornerRadius ?? 4);
		this.addChild(
			new SpriteNode(
				new Rect(
					new Vector2(position.position.x + 2, position.position.y + 2),
					position.width - 4,
					position.height - 4
				),
				this.backgroundTexture
			)
		);

		this.addChild(this.label);
	}

	protected override onInitialized(): void {
		this.unsubscribeClickHandler = this.engine.eventHandler.onClick((mousePos) => {
			if (this.rect.wrapsPosition(mousePos)) {
				this.onClick();
				return true;
			} else {
				return false;
			}
		});
	}

	protected override draw(context: CanvasRenderingContext2D, mousePos: Vector2): void {
		if (this.rect.wrapsPosition(mousePos)) {
			this.engine.setCursor('pointer');
			if (this.engine.eventHandler.isMouseDown()) {
				this.borderTexture.color = this.clickBorderColor;
				this.backgroundTexture.color = this.clickBackgroundColor;
				this.label.color = this.clickColor;
			} else {
				this.borderTexture.color = this.hoverBorderColor;
				this.backgroundTexture.color = this.hoverBackgroundColor;
				this.label.color = this.hoverColor;
			}
		} else {
			this.borderTexture.color = this.borderColor;
			this.backgroundTexture.color = this.backgroundColor;
			this.label.color = this.color;
			this.engine.resetCursor();
		}
	}

	protected override dispose(): void {
		this.unsubscribeClickHandler();
	}
}
