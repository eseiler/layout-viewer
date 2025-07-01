import PropTypes from 'prop-types';
import React, { useEffect } from 'react';
import { setActiveNode, setFilter, resize } from '../Reducers/actions';
import ExportSvg from './ExportSvg';
import Filter from './filter';

import { useControls } from "react-zoom-pan-pinch";

function handleClick() {
	setActiveNode(null);
	setFilter('');
}

export default function Header(props) {
	useEffect(resize, []);
	const { zoomIn, zoomOut, resetTransform } = useControls();

	return (
		<header id="header">
			{/* <Filter filter={props.filter}/> */}
			<button onClick={() => {resetTransform(); handleClick()}}>Reset</button>
			{/* <a href="https://github.com/jpb12/tree-viewer">View Source</a> */}
			<button onClick={() => zoomIn()}>+</button>
			<button onClick={() => zoomOut()}>-</button>
			<button onClick={() => resetTransform()}>x</button>
			<ExportSvg />
		</header>
	);
}

Header.propTypes = {
	filter: PropTypes.string.isRequired,
	timestamp: PropTypes.string
};
