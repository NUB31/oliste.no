import { Vector2 } from '$lib/game-engine/Vector2';
import { Rect } from '../../Rect';
import { Node } from '../Node';
import { EngineNode } from './EngineNode';

export class RootNode extends Node {
	public readonly mainNode: Node;
	private readonly engineNode: EngineNode;

	public constructor(width: number, height: number) {
		super(new Rect(Vector2.ZERO, width, height));

		this.mainNode = new Node(this.rect.copy());
		this.engineNode = new EngineNode(this.rect.copy());

		this.addChild(this.mainNode);
		this.addChild(this.engineNode);
	}

	public override _cascadeProcess(delta: number): void {
		if (this.engine.processBlockers.size == 0) {
			super._cascadeProcess(delta);
		} else {
			this.process(delta);
			this.engineNode._cascadeProcess(delta);
		}
	}
}
