import type { Node } from '../nodes/Node';

export function visualizeNodeTree(node: Node, indent: string = ''): string {
	let result = `${node.toString()}`;
	node.children
		.toSorted((a, b) => a.layer - b.layer)
		.forEach((c, i) => {
			result += `\n${indent}${i == node.children.length - 1 || c.node.children.length >= 1 ? '└' : '├'} ${visualizeNodeTree(c.node, indent + '  ')}`;
		});
	return result;
}
