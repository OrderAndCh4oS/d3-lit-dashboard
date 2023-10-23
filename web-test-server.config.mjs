/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */

import {legacyPlugin} from '@web/dev-server-legacy';
import { esbuildPlugin } from '@web/dev-server-esbuild';

const mode = process.env.MODE || 'dev';
if (!['dev', 'prod'].includes(mode)) {
    throw new Error(`MODE must be "dev" or "prod", was "${mode}"`);
}

export default {
    nodeResolve: {exportConditions: mode === 'dev' ? ['development'] : []},
    preserveSymlinks: true,
    root: './dist',
    plugins: [
        esbuildPlugin({ ts: true, target: 'auto' }),
        legacyPlugin({
            polyfills: {
                // Manually imported in index.html file
                webcomponents: false,
            },
        }),
    ],
};