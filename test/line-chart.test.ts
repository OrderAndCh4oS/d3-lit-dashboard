/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */

import {LineChart} from '../src/line-chart';

import {assert, fixture} from '@open-wc/testing';
import {html} from 'lit/static-html.js';

describe('line-chart', () => {
  it('is defined', () => {
    const el = document.createElement('line-chart');
    assert.instanceOf(el, LineChart);
  });

  it('renders a simple chart', async () => {
    const el = await fixture(html` <line-chart
      width="400"
      height="400"
      xAxisLabel="xs"
      yAxisLabel="ys"
    ></line-chart>`);
    el.data = {
      xs: [1, 2, 3],
      ys: [
        [1, 2, 3],
        [3, 1, 2],
        [2, 3, 1],
      ],
    };
    assert.equal(
      el.shadowRoot.querySelector('svg').outerHTML,
      '<svg class="chart" id="line-chart" width="400" height="400"><g class="axis x-axis" transform="translate(0, 320)" fill="none" font-size="10" font-family="sans-serif" text-anchor="middle"><path class="domain" stroke="currentColor" d="M80.5,6V0.5H360.5V6"></path></g><g class="axis y-axis" transform="translate(80, 0)" fill="none" font-size="10" font-family="sans-serif" text-anchor="end"><path class="domain" stroke="currentColor" d="M-6,320.5H0.5V50.5H-6"></path><g class="tick" opacity="1" transform="translate(0,185.5)"><line stroke="currentColor" x2="-6"></line><text fill="currentColor" x="-9" dy="0.32em">0</text></g></g><text transform="translate(200, 365.2173913043478)" class="axis text">xs</text><text transform="rotate(-90)" y="16" x="-200" dy="1em" class="axis text">ys</text></svg>'
    );
  });

  it('styling applied', async () => {
    const el = (await fixture(html`<line-chart></line-chart>`)) as LineChart;
    await el.updateComplete;
    assert.equal(getComputedStyle(el).backgroundColor, 'rgba(0, 0, 0, 0)');
  });
});
