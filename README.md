# `line-chart` Web Component 📈

A robust and versatile web component designed for rendering line charts. Powered by LitElement and D3.js, this component strikes a balance between flexibility and performance.

## Features

- 📱 **Responsive**: Seamlessly adapts to any container width.
- 🎨 **Custom Theming**: Offers both light and dark themes. Customize further using CSS variables.
- 🔍 **Tooltips**: Interactive tooltips for detailed data insights.
- 🌊 **Smooth Curves**: Option to display data as smooth curves or straight lines.
- 📊 **Multiple Line Support**: Capability to display multiple datasets in a single chart.

## Getting Started

To begin using the `line-chart` web component in your project, ensure you've loaded the required dependencies, LitElement and D3.js. Next, include the component's JavaScript and CSS in your HTML.

## Usage

### 1. Embed the Web Component

Embed the `line-chart` element in your HTML with its full attributes:

```html
<line-chart id="chart" width="1280" height="400" xAxisLabel="Date" scaleType="ratio" 
           yAxisLabel="Value" strokeWidth="4" pointRadius="4" smoothCurve="true" 
           fillLine="true" theme="dark">
</line-chart>
```

### 2. Configure with Data

Using JavaScript, provide the chart with your data:

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

## Custom Styling

You can style the `line-chart` web component using the provided CSS custom properties:

```css
line-chart {
    --bg-color: #2e2e2e;         /* Background color of the chart */
    --axis-color: #ffffff;       /* Color of the chart's axes */
    --axis-text-color: #d1d1d1;  /* Color of the axis labels */
    --tooltip-bg-color: #333;    /* Background color of tooltips */
    --tooltip-text-color: #fff;  /* Text color within tooltips */
    --tooltip-radius: 5px;       /* Border radius for tooltips */
}
```

Adjust these values as needed to ensure the component fits well within your design ecosystem.
