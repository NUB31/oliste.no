import { Rect } from '../Rect';
import { Vector2D } from '../Vector2D';
import { Node2D } from '../nodes/Node2D';
import { Sprite2D } from '../nodes/Sprite2D';
import { Button2D } from '../nodes/ui/Button2D';
import { Label2D } from '../nodes/ui/Label2D';
import { ColorTexture } from '../textures/ColorTexture';
import { cssVar } from '../utils/color';
import type { DebugNode } from './DebugNode';

export class SettingsNode extends Node2D {
	private readonly padding: number = 50;
	private _shown: boolean = false;

	public constructor(rect: Rect, debugNode: DebugNode) {
		super(rect);
		this.show = this.show.bind(this);
		this.hide = this.hide.bind(this);
		this.toggle = this.toggle.bind(this);

		const padding = 100;
		const x = this.rect.position.x + padding;
		let y = this.rect.position.y + padding;
		const width = this.rect.width - padding * 2;
		const height = this.rect.height - padding * 2;

		this.addChild(
			new Sprite2D(
				new Rect(new Vector2D(x - 3, y - 3), width + 3 * 2, height + 3 * 2),
				new ColorTexture(cssVar('--light-50'), 14)
			)
		);

		this.addChild(
			new Sprite2D(
				new Rect(new Vector2D(x, y), width, height),
				new ColorTexture(cssVar('--light-400'), 10)
			)
		);

		y += 5;

		this.addChild(
			new Label2D(new Rect(new Vector2D(x, y), width, 20), 'Engine settings', {
				alignHorizontal: 'center',
				fontSize: 16
			})
		);

		y += 50;
		this.addChild(
			new Button2D(
				new Rect(new Vector2D(x + width / 2 - 175, y), 350, 30),
				'Toggle debug information',
				debugNode.toggle
			)
		);
	}

	protected onInitialized(): void {
		this.hide();
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
		this.engine.shouldProcess = true;
		this._shown = false;
	}

	public show() {
		this.shouldDraw = true;
		this.shouldProcess = true;
		this.engine.shouldProcess = false;
		this._shown = true;
	}
}
