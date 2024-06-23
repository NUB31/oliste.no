import { Vector2D } from '../../Vector2D';
import { ColorTexture } from '../../textures/ColorTexture';
import { Rect } from '../../Rect';
import { Node2D } from '../Node2D';
import { Sprite2D } from '../Sprite2D';
import { Label2D } from './Label2D';
import { cssVar } from '../../utils/color';

interface Button2DOptions {
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

export class Button2D extends Node2D {
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

	private label: Label2D;
	private borderTexture: ColorTexture;
	private backgroundTexture: ColorTexture;

	public set text(value: string) {
		this.label.text = value;
	}

	public constructor(
		position: Rect,
		text: string,
		onClick: () => void,
		options: Button2DOptions = {}
	) {
		super(position);

		this.onClick = onClick;

		this.color = options.color ?? cssVar('--dark-50');
		this.hoverColor = options.hoverColor ?? cssVar('--dark-100');
		this.clickColor = options.clickColor ?? cssVar('--dark-200');

		this.backgroundColor = options.backgroundColor ?? cssVar('--light-200');
		this.hoverBackgroundColor = options.hoverBackgroundColor ?? cssVar('--light-300');
		this.clickBackgroundColor = options.clickBackgroundColor ?? cssVar('--light-400');

		this.borderColor = options.borderColor ?? cssVar('--light-300');
		this.hoverBorderColor = options.hoverBorderColor ?? cssVar('--light-300');
		this.clickBorderColor = options.clickBorderColor ?? cssVar('--light-300');

		this.label = new Label2D(this.rect, text, {
			alignHorizontal: 'center',
			alignVertical: 'center',
			color: this.color,
			fontFamily: options.fontFamily,
			fontSize: options.fontSize
		});

		this.borderTexture = new ColorTexture(this.borderColor, options.cornerRadius ?? 4);
		this.addChild(new Sprite2D(position, this.borderTexture));

		this.backgroundTexture = new ColorTexture(this.backgroundColor, options.cornerRadius ?? 4);
		this.addChild(
			new Sprite2D(
				new Rect(
					new Vector2D(position.position.x + 2, position.position.y + 2),
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
			}
		});
	}

	protected override draw(context: CanvasRenderingContext2D, mousePos: Vector2D): void {
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
