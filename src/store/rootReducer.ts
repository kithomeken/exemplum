import { combineReducers } from 'redux';

import { withReduxStateSync } from 'redux-state-sync';
import { firebaseAuthReducer } from './auth/firebaseReducers';
import { identityCheckReducer } from './identitycheckReducers';

const rootReducer = combineReducers({
    idC: identityCheckReducer,
    auth0: firebaseAuthReducer,
})

export default withReduxStateSync(rootReducer)