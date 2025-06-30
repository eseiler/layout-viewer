import { combineReducers, createStore } from 'redux';
import ActiveNode from './activeNode';
import Filter from './filter';
import Height from './height';
import Width from './width';
import Upload from './upload';

export default createStore(
	combineReducers({
		activeNode: ActiveNode,
		filter: Filter,
		height: Height,
		width: Width,
		data: Upload
	}),
	undefined,
	window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);
