import * as rp from 'redux-persist'
import storage from 'redux-persist/lib/storage'

// import { sessionService } from 'redux-react-session';
import { initStateWithPrevTab } from 'redux-state-sync';
import { persistStore, persistReducer } from 'redux-persist'
import { firebaseAuthReducer } from './auth/firebaseReducers';
import { identityCheckReducer } from './identitycheckReducers';
import { configureStore, ThunkAction, Action, combineReducers } from '@reduxjs/toolkit';

const persistConfig = {
    key: 'root',
    storage,
}

const rootReducer = combineReducers({
    idC: identityCheckReducer,
    auth0: firebaseAuthReducer,
})

const persistedReducer = persistReducer(persistConfig, rootReducer)

export const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: [rp.FLUSH, rp.REHYDRATE, rp.PAUSE, rp.PERSIST, rp.PURGE, rp.REGISTER],
            },
        }),
});


initStateWithPrevTab(store);
// sessionService.initSessionService(store);

export const persistor = persistStore(store)
export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
    ReturnType,
    RootState,
    unknown,
    Action<string>
>;