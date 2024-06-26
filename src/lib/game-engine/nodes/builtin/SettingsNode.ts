import { Rect } from '../../Rect';
import { Vector2 } from '../../Vector2';
import { Node } from '../Node';
import { SpriteNode } from '../SpriteNode';
import { ButtonNode } from '../ui/ButtonNode';
import { LabelNode } from '../ui/LabelNode';
import { ColorTexture } from '../../textures/ColorTexture';
import { cssVar } from '../../utils/color';
import type { EngineNode } from './EngineNode';

export class SettingsNode extends Node {
	public constructor(rect: Rect, engineNode: EngineNode) {
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
				engineNode.toggleDebugNode
			)
		);

		y += 50;
		this.addChild(
			new ButtonNode(
				new Rect(new Vector2(x + aWidth / 2 - 175, y), 350, 30),
				'Toggle tree visualizer',
				engineNode.toggleTreeVisualizerNode
			)
		);
	}

	protected override onInitialized(): void {
		this.engine.processBlockers.add('settingsOpen');
	}

	protected override dispose(): void {
		this.engine.processBlockers.delete('settingsOpen');
	}
}
