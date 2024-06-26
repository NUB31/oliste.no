import { visualizeNodeTree } from '$lib/game-engine/utils/debug';
import type { Rect } from '../../Rect';
import { LabelNode } from '../ui/LabelNode';

export class TreeVisualizerNode extends LabelNode {
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
			if (key == 'g' && this.engine.eventHandler.isKeyPressed('Control')) {
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
		this.text = visualizeNodeTree(this.engine._secretRoot);
	}

	protected override dispose(): void {
		this.keyHandler();
	}
}
