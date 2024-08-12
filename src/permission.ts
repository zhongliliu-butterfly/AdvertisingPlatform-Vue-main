import router from '@/router';
import { TOKEN_NAME } from './config/global';
import * as WebApp from './utils/webapp';

router.beforeEach(async (to, from, next) => {
    const sessionId = WebApp.getQueryFromUrl(TOKEN_NAME);
    if (sessionId && sessionId.length === 32) {
        sessionStorage.setItem(TOKEN_NAME, sessionId);
    }


    const toPath = to.path;
    if (toPath === '/login' || /^\/(index|app|result)($|\/.*)/.test(toPath)) {
        next();
        return;
    }

    
    next({
        path: '/login',
        query: {
            redirect: decodeURI(to.fullPath),
        },
    });
});
