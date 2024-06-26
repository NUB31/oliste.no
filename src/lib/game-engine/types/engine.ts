import type { Engine } from '../Engine';
import type { Node } from '../nodes/Node';

export type Initialization = {
	engine: Engine;
	root: Node;
};

export type Cursor =
	| 'auto'
	| 'default'
	| 'none'
	| 'context-menu'
	| 'help'
	| 'pointer'
	| 'progress'
	| 'wait'
	| 'cell'
	| 'crosshair'
	| 'text'
	| 'vertical-text'
	| 'alias'
	| 'copy'
	| 'move'
	| 'no-drop'
	| 'not-allowed'
	| 'grab'
	| 'grabbing'
	| 'e-resize'
	| 'n-resize'
	| 'ne-resize'
	| 'nw-resize'
	| 's-resize'
	| 'se-resize'
	| 'sw-resize'
	| 'w-resize'
	| 'ew-resize'
	| 'ns-resize'
	| 'nesw-resize'
	| 'nwse-resize'
	| 'col-resize'
	| 'row-resize'
	| 'all-scroll'
	| 'zoom-in'
	| 'zoom-out';
