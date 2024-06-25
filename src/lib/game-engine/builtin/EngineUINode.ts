import { Rect } from '../Rect';
import { Vector2D } from '../Vector2D';
import { Node2D } from '../nodes/Node2D';
import { Button2D } from '../nodes/ui/Button2D';
import { DebugNode } from './DebugNode';
import { SettingsNode } from './SettingsNode';

export class EngineUINode extends Node2D {
	private readonly debugNode: DebugNode;
	private readonly settingsNode: SettingsNode;
	private readonly settingsButton: Button2D;
	private keyHandler: () => void = () => {};

	public constructor(rect: Rect) {
		super(rect);

		this.debugNode = new DebugNode(new Rect(new Vector2D(this.rect.width - 185, 10), 175, 100));
		this.settingsNode = new SettingsNode(this.rect.copy(), this.debugNode);

		this.settingsButton = new Button2D(
			new Rect(new Vector2D(this.rect.width / 2 - 75, 20), 150, 40),
			'Settings',
			() => {
				this.settingsNode.toggle();
			}
		);

		this.addChild(this.settingsButton);
		this.addChild(this.settingsNode);
		this.addChild(this.debugNode);
	}

	protected override onInitialized(): void {
		this.keyHandler = this.engine.eventHandler.onKeyDown((key) => {
			if (key == 'Escape') {
				this.settingsNode.toggle();
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
