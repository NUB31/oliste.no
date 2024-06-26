import { Rect } from '../../Rect';
import { Vector2 } from '../../Vector2';
import { Node } from '../Node';
import { ButtonNode } from '../ui/ButtonNode';
import { DebugNode } from './DebugNode';
import { TreeVisualizerNode } from './TreeVisualizerNode';
import { LostFocusNode } from './LostFocusNode';
import { SettingsNode } from './SettingsNode';

export class EngineNode extends Node {
	public readonly debugNode: DebugNode;
	public readonly treeVisualizerNode: TreeVisualizerNode;
	private readonly settingsNode: SettingsNode;
	private readonly lostFocusNode: LostFocusNode;
	private keyHandler: () => void = () => {};

	public constructor(rect: Rect) {
		super(rect);
		this.toggleSettingsNode = this.toggleSettingsNode.bind(this);
		this.toggleDebugNode = this.toggleDebugNode.bind(this);
		this.toggleTreeVisualizerNode = this.toggleTreeVisualizerNode.bind(this);

		this.debugNode = new DebugNode(new Rect(new Vector2(this.rect.width - 250, 10), 240, 100));
		this.treeVisualizerNode = new TreeVisualizerNode(
			new Rect(new Vector2(10, 10), 200, this.rect.height - 20)
		);
		this.settingsNode = new SettingsNode(this.rect.copy(), this);
		this.lostFocusNode = new LostFocusNode(this.rect.copy());

		this.addChild(this.lostFocusNode, 2);
	}

	protected override onInitialized(): void {
		this.keyHandler = this.engine.eventHandler.onKeyDown((key) => {
			if (key == 'Escape') {
				this.toggleSettingsNode();
				return true;
			} else if (
				key.toLowerCase() == 'f' &&
				this.engine.eventHandler.isKeyPressed('Shift') &&
				this.engine.eventHandler.isKeyPressed('Control')
			) {
				this.toggleDebugNode();
				return true;
			} else if (
				key.toLowerCase() == 'g' &&
				this.engine.eventHandler.isKeyPressed('Shift') &&
				this.engine.eventHandler.isKeyPressed('Control')
			) {
				this.toggleTreeVisualizerNode();
				return true;
			} else {
				return false;
			}
		});
	}

	protected override process(delta: number): void {
		if (
			document.activeElement != this.engine.context.canvas &&
			!this.hasChild(this.lostFocusNode)
		) {
			this.addChild(this.lostFocusNode, 1);
		} else if (
			document.activeElement == this.engine.context.canvas &&
			this.hasChild(this.lostFocusNode)
		) {
			this.removeChild(this.lostFocusNode);
		}
	}

	public toggleDebugNode(): void {
		if (this.hasChild(this.debugNode)) {
			this.removeChild(this.debugNode);
		} else {
			this.addChild(this.debugNode, 3);
		}
	}

	public toggleTreeVisualizerNode(): void {
		if (this.hasChild(this.treeVisualizerNode)) {
			this.removeChild(this.treeVisualizerNode);
		} else {
			this.addChild(this.treeVisualizerNode, 3);
		}
	}

	public toggleSettingsNode(): void {
		if (this.hasChild(this.settingsNode)) {
			this.removeChild(this.settingsNode);
		} else {
			this.addChild(this.settingsNode, 1);
		}
	}

	protected override dispose(): void {
		this.keyHandler();
	}
}
