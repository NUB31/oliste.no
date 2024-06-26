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
			'{green}FRAME DATA',
			`fps: ${Math.round(1000 / info.delta)}fps`,
			`delta: ${info.delta}ms`,
			'',
			'{green}TIMINGS',
			`processing: ${Math.round(info.processTime)}ms`,
			`drawing: ${Math.round(info.drawTime)}ms`,
			`event handling: ${Math.round(info.eventHandlerTime)}ms`,
			`idle: ${Math.round(info.delta - info.totalTime)}ms`,
			`total (-idle): ${Math.round(info.totalTime)}ms`,
			'',
			'{green}EVENT HANDLERS',
			this.formatHandlerArray('click', Array.from(this.engine.eventHandler._clickHandlers)),
			this.formatHandlerArray('keydown', Array.from(this.engine.eventHandler._keyDownHandlers)),
			this.formatHandlerArray('keyup', Array.from(this.engine.eventHandler._keyUpHandlers)),
			this.formatHandlerArray('mousemove', Array.from(this.engine.eventHandler._mouseMoveHandlers)),
			this.formatHandlerArray('mousedown', Array.from(this.engine.eventHandler._mouseDownHandlers)),
			this.formatHandlerArray('mouseup', Array.from(this.engine.eventHandler._mouseUpHandlers)),
			'',
			'{green}OTHER',
			this.formatStringArray('process blockers', Array.from(this.engine.processBlockers)),
			this.formatStringArray(
				'currently pressed keys',
				Array.from(this.engine.eventHandler._currentlyPressedKeys),
				false
			),
			this.formatStringArray(
				'keys pressed last frame',
				Array.from(this.engine.eventHandler._wasPressedKeys),
				false
			)
		];

		this.text = debugLines.join('\n');
	}

	private formatStringArray(prefix: string, values: string[], multiLine: boolean = true) {
		if (multiLine) {
			return `${prefix}: ${
				values.length == 0
					? '[ ]'
					: `[\n${Array.from(values.values())
							.map((x) => `  ${x}`)
							.join('\n')}\n]`
			}`;
		} else {
			return `${prefix}: ${`[\n  ${Array.from(values.values()).join(', ')}\n]`}`;
		}
	}

	private formatHandlerArray(prefix: string, values: ((_: never) => boolean)[]) {
		return `${prefix} handlers: ${
			values.length == 0
				? '[ ]'
				: `[\n${Array.from(values.values())
						.map((x) => `  -> ${x.name ? x.name : 'anon'}`)
						.join('\n')}\n]`
		}`;
	}

	protected override dispose(): void {
		this.keyHandler();
	}
}
