import { Rect } from '../../Rect';
import { Vector2 } from '../../Vector2';
import { Node } from '../Node';
import { ButtonNode } from '../ui/ButtonNode';
import { DebugNode } from './DebugNode';
import { TreeVisualizerNode } from './TreeVisualizerNode';
import { LostFocusNode } from './LostFocusNode';
import { SettingsNode } from './SettingsNode';

export class EngineNode extends Node {
	private readonly debugNode: DebugNode;
	private readonly treeVisualizerNode: TreeVisualizerNode;
	private readonly settingsNode: SettingsNode;
	private readonly settingsButton: ButtonNode;
	private readonly lostFocusNode: LostFocusNode;
	private keyHandler: () => void = () => {};

	public constructor(rect: Rect) {
		super(rect);

		this.debugNode = new DebugNode(new Rect(new Vector2(this.rect.width - 250, 10), 240, 100));
		this.treeVisualizerNode = new TreeVisualizerNode(
			new Rect(new Vector2(10, 10), 200, this.rect.height - 20)
		);
		this.settingsNode = new SettingsNode(this.rect.copy(), this.debugNode, this.treeVisualizerNode);
		this.lostFocusNode = new LostFocusNode(this.rect.copy());

		this.settingsButton = new ButtonNode(
			new Rect(new Vector2(this.rect.width / 2 - 75, 20), 150, 40),
			'Settings',
			() => {
				this.settingsNode.enabled = !this.settingsNode.enabled;
			}
		);

		this.addChild(this.settingsButton);
		this.addChild(this.settingsNode);
		this.addChild(this.debugNode);
		this.addChild(this.treeVisualizerNode);
		this.addChild(this.lostFocusNode);
	}

	protected override onInitialized(): void {
		this.keyHandler = this.engine.eventHandler.onKeyDown((key) => {
			if (key == 'Escape') {
				this.settingsNode.enabled = !this.settingsNode.enabled;
				return true;
			} else {
				return false;
			}
		});
	}

	protected override dispose(): void {
		this.keyHandler();
	}
}
