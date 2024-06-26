import type { Rect } from '../../Rect';
import { LabelNode } from '../ui/LabelNode';

export class DebugNode extends LabelNode {
	private keyHandler: () => void = () => {};
	private _shown: boolean = false;

	constructor(rect: Rect) {
		super(rect, '', {
			fontSize: 8,
			backgroundColor: 'hsl(0, 0%, 0%, 0.8)'
		});
		this.show = this.show.bind(this);
		this.hide = this.hide.bind(this);
		this.toggle = this.toggle.bind(this);
	}

	protected override onInitialized(): void {
		this.hide();
		this.keyHandler = this.engine.eventHandler.onKeyDown((key) => {
			if (key == 'f' && this.engine.eventHandler.isKeyPressed('Control')) {
				this.toggle();
				return true;
			} else {
				return false;
			}
		});
	}

	public toggle() {
		if (this._shown) {
			this.hide();
		} else {
			this.show();
		}
	}

	public hide() {
		this.shouldDraw = false;
		this.shouldProcess = false;
		this._shown = false;
	}

	public show() {
		this.shouldDraw = true;
		this.shouldProcess = true;
		this._shown = true;
	}

	protected override process(delta: number): void {
		const info = this.engine.debug;

		const debugLines = [
			`fps: ${Math.round(1000 / info.delta)}fps`,
			`delta: ${info.delta}ms`,
			`processing: ${Math.round(info.processTime)}ms`,
			`drawing: ${Math.round(info.drawTime)}ms`,
			`event handling: ${Math.round(info.eventHandlerTime)}ms`,
			`idle: ${Math.round(info.delta - info.totalTime)}ms`,
			`total: ${Math.round(info.totalTime)}ms`,
			`process blockers: ${
				this.engine.processBlockers.size == 0
					? '[ ]'
					: `[\n${Array.from(this.engine.processBlockers.values())
							.map((x) => `  ${x}`)
							.join('\n')}\n]`
			}`
		];

		this.text = debugLines.join('\n');
	}

	protected override dispose(): void {
		this.keyHandler();
	}
}
