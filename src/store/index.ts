import { createPinia } from 'pinia';
import { createPersistedState } from 'pinia-plugin-persistedstate';

const store = createPinia();
store.use(
    createPersistedState({
        storage: window.sessionStorage,
    }),
);

export { store };

export * from './modules/rate';

export default store;
