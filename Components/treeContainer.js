import clone from 'clone';
import PropTypes from 'prop-types';
import React, { useState, useEffect } from 'react';
import { AnimatedTree } from 'react-tree-graph';
import { setActiveNode } from '../Reducers/actions';

import { Tooltip } from 'react-tooltip';

function handleClick(event, node) {
	setActiveNode(node);
}

function handleScroll(event) {
	console.log("Scroll");
}

function path(x1, y1, x2, y2) {
	return `M${x1},${y1} ${x2},${y2}`;
}

// function handleHover(node, current) {
// 	// console.log(node);
// 	current = current.root || current;
// 	if (current.name === node) {
// 		// console.log(current);
// 		let res = current.children?.length || 0;
// 		console.log(`return result: ${res}`);
// 		return current;
// 	}

// 	for (let i = 0; i < current.children?.length; i++) {
// 		// console.log("recursion");
// 		const childJson = handleHover(node, current.children[i]);
// 		if (childJson) {
// 			// console.log("recursion return");
// 			return childJson;
// 		}
// 	}

// 	// console.log("return false");
// 	return false;
// }

export default function TreeContainer(props) {
	const [shouldRender, setShouldRender] = useState(true);

	// Force a brief unmount-remount cycle when props change
	useEffect(() => {
		setShouldRender(false);
		const timer = setTimeout(() => setShouldRender(true), 50);
		return () => clearTimeout(timer);
	}, [props.data, props.filter, props.width, props.height]);

	function getRoot(json) {
		if (json.name === props.activeNode) {
			return json;
		}

		for (let i = 0; i < json.children?.length; i++) {
			const childJson = getRoot(json.children[i]);
			if (childJson) {
				return childJson;
			}
		}

		return false;
	}

	function buildSubTree(root) {
		let newChildren = [];

		for (let i = 0; i < root.children?.length; i++) {
			const child = buildSubTree(root.children[i]);
			if (child) {
				newChildren.push(child);
			}
		}

		if (newChildren.length > 0) {
			root.children = newChildren;
		}

		if (newChildren.length > 0 || root.name.toLowerCase().indexOf(props.filter.toLowerCase()) !== -1) {
			return root;
		}

		return null;
	}

	function setClassName(node) {
		node.children?.forEach(setClassName);

		if (!props.filter) {
			return;
		}

		node.className = node.name.toLowerCase().indexOf(props.filter) === -1
			? 'node searchExcluded'
			: 'node searchIncluded';
	}

	let root = props.activeNode ? getRoot(props.data) : props.data;

	root = clone(root);

	if (props.filter) {
		root = buildSubTree(root) || root;
	}

	setClassName(root);

	let offset = (props.width - props.height) / 2;

	if (!shouldRender) {
		return <main></main>;
	}

	return (
		<main>
			<AnimatedTree
				data={root}
				labelProp="label"
				direction="rtl"
				width={props.height}
				height={props.width}
				pathFunc={path}
				svgProps={{
					transform: `rotate(-90) translate(${offset},${offset})`,
					onWheel: handleScroll
				}}
				gProps={{
					className: 'node',
					onClick: handleClick,
					// onMouseOver: (event, node) => handleHover(node, {root})
				}}
				// nodeShape='rect'
				// nodeProps={{
				// 	height: 10,
				// 	width: 5
				// }}
				textProps={{
					// dx: -14,
					// dy: 14,
					// dx:0,
					// dy:0,
					// transform: "rotate(-90)"
				}}
				steps={30}/>
				<Tooltip id="my-tooltip" />
		</main>
	);
}

TreeContainer.propTypes = {
	activeNode: PropTypes.string,
	data: PropTypes.object,
	filter: PropTypes.string,
	height: PropTypes.number,
	width: PropTypes.number
};
