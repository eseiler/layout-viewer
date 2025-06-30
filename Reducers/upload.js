import { ActionType } from './actions';

export default function UploadReducer(state, action) {
	if (typeof state === 'undefined') {
		return null;
	} else {
		switch (action.type) {
			case ActionType.UPDATE_TREE_DATA:
				return action.data;
		}
	}

	return state;
}
