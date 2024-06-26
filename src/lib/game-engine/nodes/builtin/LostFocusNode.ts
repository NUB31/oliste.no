import { Rect } from '../../Rect';
import { Vector2 } from '../../Vector2';
import { Node } from '../Node';
import { LabelNode } from '../ui/LabelNode';
import { SpriteNode } from '../SpriteNode';
import { ColorTexture } from '$lib/game-engine/textures/ColorTexture';

export class LostFocusNode extends Node {
	public constructor(rect: Rect) {
		super(rect);

		this.addChild(new SpriteNode(rect.copy(), new ColorTexture('hsl(0,0%,0%,0.9)')));

		const newRect = rect.copy();
		newRect.height = (rect.height / 3) * 2;
		this.addChild(
			new LabelNode(newRect, 'Game window not in focus\nClick the game screen to capture input', {
				alignHorizontal: 'center',
				alignVertical: 'center',
				fontSize: 18
			})
		);
	}

	protected override onInitialized(): void {
		this.engine.processBlockers.add('lostFocus');
	}

	protected override draw(context: CanvasRenderingContext2D, mousePos: Vector2): void {
		if (this.rect.wrapsPosition(mousePos)) {
			this.engine.setCursor('pointer');
		}
	}

	protected override dispose(): void {
		this.engine.processBlockers.delete('lostFocus');
	}
}
