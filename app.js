import React from 'react';
import { createRoot } from 'react-dom/client';
import { Provider, useSelector } from 'react-redux';
import Header from './Components/header';
import TreeContainer from './Components/treeContainer';
import FileUploader from './Components/FileUploader';
import Store from './Reducers/store';
import { resize } from './Reducers/actions';
// Import default data as fallback
import defaultJson from './json';

import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";

import './style.css';

window.onresize = resize;

function App() {
    // Select only the specific pieces of state you need
    const data = useSelector(state => state.data) || defaultJson;
    const filter = useSelector(state => state.filter);
    const activeNode = useSelector(state => state.activeNode);
    const height = useSelector(state => state.height);
    const width = useSelector(state => state.width);

    console.log("rendering app with data:", data);

    return (
        <div id="container">
            <TransformWrapper
                initialScale={1}
                minScale={0.5}
                limitToBounds={false}
                centerOnInit={true}>
            <Header filter={filter}/>
            <FileUploader />
                <TransformComponent
                    wrapperStyle={{ height: height, width: width }}
                    contentStyle={{ height: height, width: width, objectFit: 'contain' }}>
                    <TreeContainer
                        activeNode={activeNode}
                        data={data}
                        filter={filter}
                        height={height}
                        width={width}/>
                </TransformComponent>
            </TransformWrapper>
        </div>
    );
}

const root = createRoot(document.getElementById('app'));
root.render(
    <Provider store={Store}>
        <App/>
    </Provider>
);
