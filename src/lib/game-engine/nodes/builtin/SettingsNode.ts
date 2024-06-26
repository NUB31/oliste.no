import { Rect } from '../../Rect';
import { Vector2 } from '../../Vector2';
import { Node } from '../Node';
import { SpriteNode } from '../SpriteNode';
import { ButtonNode } from '../ui/ButtonNode';
import { LabelNode } from '../ui/LabelNode';
import { ColorTexture } from '../../textures/ColorTexture';
import { cssVar } from '../../utils/color';
import type { DebugNode } from './DebugNode';
import type { TreeVisualizerNode } from './TreeVisualizerNode';

export class SettingsNode extends Node {
	public set enabled(value: boolean) {
		this.shouldDraw = value;
		this.shouldProcess = value;
		if (value) {
			this.engine.processBlockers.add('settingsOpen');
		} else {
			this.engine.processBlockers.delete('settingsOpen');
		}
	}

	public get enabled() {
		return this.engine.processBlockers.has('settingsOpen');
	}

	public constructor(rect: Rect, debugNode: DebugNode, treeVisualizer: TreeVisualizerNode) {
		super(rect);

		const padding = 100;
		const x = this.rect.position.x + padding;
		let y = this.rect.position.y + padding;
		const aWidth = this.rect.width - padding * 2;
		const aHeight = this.rect.height - padding * 2;

		this.addChild(
			new SpriteNode(
				new Rect(new Vector2(x - 3, y - 3), aWidth + 3 * 2, aHeight + 3 * 2),
				new ColorTexture(cssVar('--light-50'), 14)
			)
		);

		this.addChild(
			new SpriteNode(
				new Rect(new Vector2(x, y), aWidth, aHeight),
				new ColorTexture(cssVar('--light-400'), 10)
			)
		);

		y += 5;

		this.addChild(
			new LabelNode(new Rect(new Vector2(x, y), aWidth, 20), 'Engine settings', {
				alignHorizontal: 'center',
				fontSize: 16
			})
		);

		y += 50;
		this.addChild(
			new ButtonNode(
				new Rect(new Vector2(x + aWidth / 2 - 175, y), 350, 30),
				'Toggle debug information',
				debugNode.toggle
			)
		);

		y += 50;
		this.addChild(
			new ButtonNode(
				new Rect(new Vector2(x + aWidth / 2 - 175, y), 350, 30),
				'Toggle tree visualizer',
				treeVisualizer.toggle
			)
		);
	}

	protected onInitialized(): void {
		this.enabled = false;
	}
}
