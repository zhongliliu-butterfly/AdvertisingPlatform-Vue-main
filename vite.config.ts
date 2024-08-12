import { ConfigEnv, defineConfig, loadEnv, UserConfigExport } from 'vite';
import vue from '@vitejs/plugin-vue';
import { resolve } from 'path';
import AutoImport from 'unplugin-auto-import/vite';
import Components from 'unplugin-vue-components/vite';
import { TDesignResolver } from 'unplugin-vue-components/resolvers';

const CWD = process.cwd();

export default ({ mode }: ConfigEnv): UserConfigExport => {
    const { VITE_SERVER_URL, VITE_REQUEST_BASE_URL,VITE_RATE_URL,VITE_RATE_BASE_URL } = loadEnv(mode, CWD);

    const proxy: Recordable = {};
    proxy[VITE_REQUEST_BASE_URL] = {
        target: VITE_SERVER_URL,
        changeOrigin: true,
    };
    proxy[VITE_RATE_BASE_URL] = {
        target: VITE_RATE_URL,
        changeOrigin: true,
    };

    return defineConfig({
        base: './',
        plugins: [
            vue(),
            AutoImport({ resolvers: [TDesignResolver({ library: 'vue-next' })] }),
            Components({ resolvers: [TDesignResolver({ library: 'vue-next' })] }),
        ],
        resolve: { alias: { '@': resolve(__dirname, './src') } },
        server: {
            port: 3001,
            host: '0.0.0.0',
            open: true,
            proxy,
        },
    });
};
