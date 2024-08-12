import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router';
import Blank from '@/layouts/blank.vue';

// 存放固定的路由
const defaultRouterList: Array<RouteRecordRaw> = [
    {
        path: '/page',
        name: 'page',
        component: () => import('@/layouts/page.vue'),
        children: [
            {
                path: 'products',
                name: 'products',
                component: () => import('@/pages/products/index.vue'),
            },
            {
                path: 'statistic',
                name: 'statistic',
                component: () => import('@/pages/statistic/index.vue'),
            },
            {
                path: 'industryAnalysis',
                name: 'industryAnalysis',
                component: () => import('@/pages/industryAnalysis/index.vue'),
            },
            {
                path: 'custom',
                name: 'custom',
                component: () => import('@/pages/custom/index.vue'),
            }
        ]
    },
    {
        path: '/',
        redirect: '/login/index',
        // 控制项目首页
    },
    {
        path: '/result',
        name: 'result',
        children: [
            {
                path: '404',
                name: '404',
                component: () => import('@/result/404.vue'),
                meta: { title: '访问页面不存在页' },
            },
        ],
    },
    {
        path: '/:w+',
        name: '404Page',
        redirect: '/result/404',
    },
];

// 存放动态路由
export const asyncRouterList: Array<RouteRecordRaw> = [];

// 自动导入pages文件夹下所有vue文件
const pages = import.meta.glob('@/pages/**/index.vue');
Object.keys(pages).forEach((path) => {
    if (path.includes('component') || path.includes('Component')) return '';

    const match = path.match(/\/src\/pages(\/.*)\/index\.vue$/);
    if (!match) {
        return '';
    }

    const pagePath = match[1];
    const defaultRouter = defaultRouterList.find((value) => {
        return value.path === pagePath;
    });
    if (defaultRouter) return '';

    const ss = pagePath.substring(1).split('/');

    let parent: RouteRecordRaw | undefined;
    for (let i = 0; i < ss.length; i++) {
        const pkg = ss[i];

        if (i === 0) {
            // 是一级路由

            parent = asyncRouterList.find((value) => {
                return value.path === `/${ss[0]}`;
            });
            if (!parent) {
                parent = {
                    path: `/${pkg}`,
                    name: `/${pkg}`,
                    component: Blank,
                    meta: {},
                    children: [],
                    redirect: `/${pkg}/index`,
                };
                asyncRouterList.push(parent);
            }
        } else if (i < ss.length - 1 && parent) {
            // 中间路由

            const oldParent: RouteRecordRaw = parent;
            parent = parent.children?.find((value) => {
                return value.path === pkg;
            });

            if (!parent) {
                parent = {
                    path: pkg,
                    name: `${oldParent.name?.toString()}/${pkg}`,
                    component: Blank,
                    meta: {},
                    children: [],
                };
                oldParent.children?.push(parent);
            }
        }
    }

    parent?.children?.push({
        path: ss.length === 1 ? 'index' : ss[ss.length - 1],
        name: `${parent.name?.toString()}/${ss.length === 1 ? 'index' : ss[ss.length - 1]}`,
        component: pages[path],
        meta: {},
    });

    return path;
});

export const allRoutes = [...defaultRouterList, ...asyncRouterList];

const router = createRouter({
    history: createWebHashHistory('/'),
    routes: allRoutes,
    scrollBehavior() {
        return {
            el: '#app',
            top: 0,
            behavior: 'smooth',
        };
    },
});

const defaultTitle = window.document.title;
router.beforeEach((to, from, next) => {
    const title = to.meta.title as string;
    if (title) {
        window.document.title = title;
    } else {
        window.document.title = defaultTitle;
    }
    next();
});

export default router;
