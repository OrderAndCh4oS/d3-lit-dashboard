import { esbuildPlugin } from '@web/dev-server-esbuild';
import {playwrightLauncher} from '@web/test-runner-playwright';

const mode = process.env.MODE || 'dev';
if (!['dev', 'prod'].includes(mode)) {
    throw new Error(`MODE must be "dev" or "prod", was "${mode}"`);
}

export default {
    browsers: [playwrightLauncher()],
    files: 'test/**/*.test.ts',  // Adjust your test file pattern if needed
    nodeResolve: {exportConditions: mode === 'dev' ? ['development'] : []},
    preserveSymlinks: true,
    root: './dist',
    plugins: [
        esbuildPlugin({ ts: true, target: 'auto' }),
    ],
};