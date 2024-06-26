import type { Node } from '../nodes/Node';

export function visualizeNodeTree(node: Node, indent: string = ''): string {
	let result = `${node.toString()}`;
	node.children.forEach((c, i) => {
		result += `\n${indent}${i == node.children.length - 1 || c.children.length >= 1 ? '└' : '├'} ${visualizeNodeTree(c, indent + '  ')}`;
	});
	return result;
}
