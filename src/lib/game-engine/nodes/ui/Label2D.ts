import { Settings } from '$lib/game-engine/builtin/Settings';
import { font } from '$lib/game-engine/utils/font';
import { Rect } from '../../Rect';
import { Vector2D } from '../../Vector2D';
import { Node2D } from '../Node2D';

interface Label2DOptions {
	fontFamily?: string;
	fontSize?: number;
	alignHorizontal?: 'left' | 'center' | 'right';
	alignVertical?: 'top' | 'center' | 'bottom';
	color?: string;
	backgroundColor?: string;
}

export class Label2D extends Node2D {
	public text: string;
	public fontFamily: string;
	public fontSize: number;
	public alignHorizontal: 'left' | 'center' | 'right';
	public alignVertical: 'top' | 'center' | 'bottom';
	public color: string;
	public backgroundColor: string | null;

	public constructor(rect: Rect, text: string = '', options: Label2DOptions = {}) {
		super(rect);
		this.text = text;
		this.fontFamily = options.fontFamily ?? Settings.defaultFontFamily;
		this.fontSize = options.fontSize ?? 12;
		this.alignHorizontal = options.alignHorizontal ?? 'left';
		this.alignVertical = options.alignVertical ?? 'top';
		this.color = options.color ?? 'white';
		this.backgroundColor = options.backgroundColor ?? null;
	}

	protected draw(context: CanvasRenderingContext2D, mousePos: Vector2D): void {
		context.font = font(this.fontSize, this.fontFamily);

		const textPosMap: { position: Vector2D; text: string }[] = this.text
			.split('\n')
			.map((text, i) => {
				const measured = context.measureText(text);

				let x = this.rect.position.x + 8;
				switch (this.alignHorizontal) {
					case 'center':
						x = this.rect.position.x + this.rect.width / 2 - measured.width / 2;
						break;
					case 'right':
						x = this.rect.position.x - 8 + this.rect.width - measured.width;
						break;
				}

				const y = this.rect.position.y + 8 + i * 4 + (i + 1) * measured.fontBoundingBoxAscent;

				return {
					position: new Vector2D(x, y),
					text: text
				};
			});

		const heightDiff =
			this.rect.position.y + this.rect.height - textPosMap[textPosMap.length - 1].position.y - 8;

		switch (this.alignVertical) {
			case 'center':
				textPosMap.forEach((textPos) => {
					textPos.position.y += heightDiff / 2;
				});
				break;
			case 'bottom':
				textPosMap.forEach((textPos) => {
					textPos.position.y += heightDiff;
				});
				break;
		}

		if (this.backgroundColor) {
			context.fillStyle = this.backgroundColor;
			context.fillRect(
				this.rect.position.x,
				this.rect.position.y,
				this.rect.width,
				textPosMap[textPosMap.length - 1].position.y
			);
		}

		context.fillStyle = this.color;
		textPosMap.forEach((textPos) => {
			context.fillText(textPos.text, textPos.position.x, textPos.position.y, this.rect.width - 16);
		});
	}
}
