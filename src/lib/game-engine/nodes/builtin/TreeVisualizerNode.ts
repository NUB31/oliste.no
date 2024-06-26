import { visualizeNodeTree } from '$lib/game-engine/utils/debug';
import type { Rect } from '../../Rect';
import { LabelNode } from '../ui/LabelNode';

export class TreeVisualizerNode extends LabelNode {
	constructor(rect: Rect) {
		super(rect, '', {
			fontSize: 8,
			backgroundColor: 'hsl(0, 0%, 0%, 0.8)'
		});
	}

	protected override process(delta: number): void {
		this.text = visualizeNodeTree(this.engine._secretRoot);
	}
}
