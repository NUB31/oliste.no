import { Rect } from '../../Rect';
import { Vector2 } from '../../Vector2';
import { Node } from '../Node';
import { font } from '../../utils/font';

export class LostFocusNode extends Node {
	set enabled(value: boolean) {
		this.shouldDraw = value;
		if (value) {
			this.engine.processBlockers.add('lostFocus');
		} else {
			this.engine.processBlockers.delete('lostFocus');
		}
	}

	public constructor(rect: Rect) {
		super(rect);
	}

	protected override process(delta: number): void {
		if (
			document.activeElement != this.engine.context.canvas &&
			!this.engine.processBlockers.has('lostFocus')
		) {
			this.enabled = true;
		} else if (
			document.activeElement == this.engine.context.canvas &&
			this.engine.processBlockers.has('lostFocus')
		) {
			this.enabled = false;
		}
	}

	protected override draw(context: CanvasRenderingContext2D, mousePos: Vector2): void {
		if (this.rect.wrapsPosition(mousePos)) {
			this.engine.setCursor('pointer');
		} else {
			this.engine.resetCursor();
		}

		context.fillStyle = 'hsl(0,0%,0%,0.9)';
		context.fillRect(0, 0, this.rect.width, this.rect.height);

		context.fillStyle = 'white';
		context.font = font(16);

		const missingFocusTitle = 'Game window not in focus';
		const measuredTitle = context.measureText(missingFocusTitle);
		context.fillText(
			missingFocusTitle,
			this.rect.width / 2 - measuredTitle.width / 2,
			this.rect.height / 4
		);

		const missingFocusBody = 'Click the game screen to capture input';
		const measuredBody = context.measureText(missingFocusBody);
		context.fillText(
			missingFocusBody,
			this.rect.width / 2 - measuredBody.width / 2,
			this.rect.height / 4 + measuredBody.fontBoundingBoxAscent + 5
		);
	}
}
