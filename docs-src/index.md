---
layout: page.11ty.cjs
title: <line-chart> ⌲ Home
---

# `line-chart` Web Component

A custom web component built with LitElement and D3.js for rendering line charts.

## 🚀 Features

- 📱 **Responsive Design**: Adapts to the width of its container.
- 🎨 **Custom Theming**: Supports both light and dark themes.
- 🔍 **Tooltips**: Hover over data points to get more detailed information.
- 🌊 **Smooth Curve Option**: Can render as a smooth curve or a straight line.
- 📊 **Multiple Lines**: Supports rendering of multiple lines in one chart.

## 📦 Attributes

The example showcases the following attributes:

```html
<line-chart id="chart" width="1280" height="400" xAxisLabel="Date" scaleType="ratio" 
           yAxisLabel="Value" strokeWidth="4" pointRadius="4" smoothCurve="true" 
           theme="dark">
</line-chart>
```

- `id`: The unique identifier for the chart component. E.g., "chart".
- `width`: Width of the chart. E.g., "1280".
- `height`: Height of the chart. E.g., "400".
- `xAxisLabel`: Label for the x-axis. E.g., "Date".
- `yAxisLabel`: Label for the y-axis. E.g., "Value".
- `scaleType`: Determines how the chart should scale. E.g., "ratio".
- `strokeWidth`: Width of the line stroke. E.g., "4".
- `pointRadius`: Radius of each data point in the chart. E.g., "4".
- `smoothCurve`: Determines if the chart has smooth curves. Accepts "true" or "false".
- `theme`: Chart theme. E.g., "dark".

## 📈 Sample Data and Chart Configuration

You can provide the chart with data and further configuration using JavaScript:

```javascript
const colours = [
    "#E63946",
    "#7cb06b",
    "#6ab8bb",
    "#457B9D",
    "#cc34b3",
    "#F4A261"
];

const xs = Array.from({length: 7}, (_, i) => new Date('2023-01-0' + (i + 1)));
const ys = xs.map(_ => Array.from({length: 6}, () => ~~(Math.random() * 100) + 10));
const sampleData = {xs, ys};

const chartElement = document.getElementById('chart');
chartElement.data = sampleData;
chartElement.colours = colours;
```

In this example:

- `colours`: An array containing the hex codes for the lines in the chart.
- `xs`: An array representing the x-axis data. In this case, a sequence of dates.
- `ys`: A multi-dimensional array that corresponds to y-axis data for the various lines in the chart.
- `sampleData`: An object comprising `xs` and `ys` data that will be used for rendering the chart.

The last lines of the JavaScript code link the `sampleData` and `colours` to the `<line-chart>` element.

## 🎨 Styling

Customize the component's appearance using these CSS variables:

- `--bg-color`: Background color of the chart.
- `--axis-color`: Color of the axes.
- `--axis-text-color`: Color of the axis labels.
- `--tooltip-bg-color`: Background color of the tooltip.
- `--tooltip-text-color`: Color of the tooltip text.
- `--tooltip-radius`: Border radius of the tooltip.


## 📈 Example Charts

### Defaults

<div>
<line-chart
    id="chartOne"
    width="1280"
    height="400"
    xAxisLabel="Date"
    yAxisLabel="Value"
></line-chart>
<script>
      const xs = Array.from(
        {length: 7},
        (_, i) => new Date('2023-01-0' + (i + 1))
      );
      const ys = xs.map((_) =>
        Array.from({length: 4}, () => ~~(Math.random() * 100) + 10)
      );
      const labels = ["Line one", "Line two", "Line three", "Line four"];
      const sampleData = {xs, ys, labels};
      const chartElementOne = document.getElementById('chartOne');
      chartElementOne.data = sampleData;
</script>
</div>

### Customised

<div>
    <line-chart
      id="chartTwo"
      width="1280"
      height="400"
      scaleType="ratio"
      xAxisLabel="Date"
      yAxisLabel="Value"
      strokeWidth="4"
      pointRadius="4"
      smoothCurve="true"
      theme="dark"
    ></line-chart>
<script>
  const chartElementTwo = document.getElementById('chartTwo');
  chartElementTwo.data = sampleData;
  chartElementTwo.colours = [
    '#E63946',
    '#7cb06b',
    '#6ab8bb',
    '#457B9D',
    '#cc34b3',
    '#F4A261',
  ];
</script>
</div>