import { Settings } from '$lib/game-engine/Settings';
import { font } from '$lib/game-engine/utils/font';
import { Rect } from '../../Rect';
import { Vector2 } from '../../Vector2';
import { Node } from '../Node';

interface LabelNodeOptions {
	fontFamily?: string;
	fontSize?: number;
	alignHorizontal?: 'left' | 'center' | 'right';
	alignVertical?: 'top' | 'center' | 'bottom';
	color?: string;
	backgroundColor?: string;
}

export class LabelNode extends Node {
	public text: string;
	public fontFamily: string;
	public fontSize: number;
	public alignHorizontal: 'left' | 'center' | 'right';
	public alignVertical: 'top' | 'center' | 'bottom';
	public color: string;
	public backgroundColor: string | null;

	public constructor(rect: Rect, text: string = '', options: LabelNodeOptions = {}) {
		super(rect);
		this.text = text;
		this.fontFamily = options.fontFamily ?? Settings.defaultFontFamily;
		this.fontSize = options.fontSize ?? 12;
		this.alignHorizontal = options.alignHorizontal ?? 'left';
		this.alignVertical = options.alignVertical ?? 'top';
		this.color = options.color ?? 'white';
		this.backgroundColor = options.backgroundColor ?? null;
	}

	protected draw(context: CanvasRenderingContext2D, mousePos: Vector2): void {
		context.font = font(this.fontSize, this.fontFamily);

		const textPosMap: { position: Vector2; text: string; color: string }[] = this.text
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

				let color = 'white';
				if (text.startsWith('{')) {
					const index = text.indexOf('}');
					if (index != -1) {
						color = text.substring(1, index);
						text = text.slice(index + 1);
					}
				}

				return {
					position: new Vector2(x, y),
					text: text,
					color: color
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

		textPosMap.forEach((textPos) => {
			context.fillStyle = textPos.color;
			context.fillText(textPos.text, textPos.position.x, textPos.position.y, this.rect.width - 16);
		});
	}
}
