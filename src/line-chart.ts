import {css, html, LitElement, PropertyValues} from 'lit'
import {customElement, property} from 'lit/decorators.js'
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import * as d3 from "d3";
import {MouseController} from "./mouse-controller";

type ChartData = {
    xs: (Date | number | null)[];
    ys: (Date | number | null)[][];
};

type LineDatum = {
    x: Date | number | null;
    y: Date | number | null
};

type Margin = { top: number, right: number, bottom: number, left: number }

@customElement('line-chart')
export class LineChart extends LitElement {
    static SCALE_TYPES = ['ratio', 'fixed-height'];

    static override styles = css`
      :host {
        --bg-color: #F7F7F7;
        --axis-color: #626568;
        --axis-text-color: #213547;
        --tooltip-bg-color: black;
        --tooltip-text-color: white;
        --tooltip-radius: 4px;

        color-scheme: light dark;
        color: var(--axis-text-color);
        line-height: 1.5;
        font-weight: 400;
        font-synthesis: none;
        text-rendering: optimizeLegibility;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        -webkit-text-size-adjust: 100%;
      }

      @media (prefers-color-scheme: dark) {
        :host {
          --bg-color: #2a2a2a;
          --axis-color: #979797;
          --axis-text-color: #ddd;
          --tooltip-bg-color: #ddd;
          --tooltip-text-color: #2a2a2a;
        }
      }

      :host([theme='light']) {
        --bg-color: #F7F7F7;
        --axis-color: #626568;
        --axis-text-color: #213547;
        --tooltip-bg-color: black;
        --tooltip-text-color: white;
      }

      :host([theme='dark']) {
        --bg-color: #2a2a2a;
        --axis-color: #979797;
        --axis-text-color: #ddd;
        --tooltip-bg-color: #ddd;
        --tooltip-text-color: #2a2a2a;
      }

      .chart {
        background-color: var(--bg-color);
        width: 100%;
        position: relative;
      }

      .axis.text {
        fill: var(--axis-text-color);
        font-family: Arial, sans-serif;
        font-size: 16px;
        text-anchor: middle;
      }

      .axis line,
      .axis path {
        stroke: var(--axis-color);
        stroke-width: 1;
      }

      .line {
        fill: none;
        stroke-width: var(--stroke-width);
        stroke-linejoin: round;
        stroke-linecap: round;
      }

      .tooltip {
        background: var(--tooltip-bg-color);
        color: var(--tooltip-text-color);
        position: absolute;
        text-align: center;
        transition: opacity 200ms ease-in-out;
        padding: 6px;
        font: 12px sans-serif;
        border: 0;
        border-radius: var(--tooltip-radius);
        pointer-events: none;
      }
    `;

    @property({type: String})
    declare id;

    @property({type: Number})
    declare strokeWidth;

    @property({type: Number})
    declare pointRadius;

    @property({
        type: Object,
        hasChanged(newVal: Partial<ChartData>, oldVal: ChartData) {
            if (!Array.isArray(newVal.xs) ||
                !Array.isArray(newVal.ys) ||
                !newVal.ys.every(y => Array.isArray(y))) {
                console.error('line-chart Error: Invalid ChartData format.');
                return false;
            }
            return JSON.stringify(newVal) !== JSON.stringify(oldVal);
        }
    })
    declare data: ChartData;

    @property({
        type: Object,
        hasChanged(newVal: Partial<Margin>, oldVal: Margin) {
            if (typeof newVal?.top !== 'number' ||
                typeof newVal?.right !== 'number' ||
                typeof newVal?.bottom !== 'number' ||
                typeof newVal?.left !== 'number') {
                console.error('line-chart Error: Invalid Margin format.');
                return false;
            }
            return JSON.stringify(newVal) !== JSON.stringify(oldVal);
        }
    })
    declare margin: Margin;

    @property({
        type: Array,
        hasChanged(newVal: string[], oldVal: string[]) {
            if (!Array.isArray(newVal)) {
                console.error('line-chart Error: Invalid colours format. Expected an array.');
                return false;
            }
            if (!newVal.every(color => /^#[0-9A-Fa-f]{6}$/.test(color))) {
                console.error('line-chart Error: Invalid colour value. Expected format is #RRGGBB.');
                return false;
            }
            return JSON.stringify(newVal) !== JSON.stringify(oldVal);
        }
    })
    declare colours: string[];

    @property({
        type: String,
        hasChanged(newVal: 'ratio' | 'fixed-height', oldVal: 'ratio' | 'fixed-height') {
            if (!LineChart.SCALE_TYPES.includes(newVal)) {
                console.warn(`Invalid scaleType value: '${newVal}'. Expected one of: ${LineChart.SCALE_TYPES.join(', ')}.`);
                return false;
            }
            return newVal !== oldVal;
        }
    })
    declare scaleType: 'ratio' | 'fixed-height';

    @property({type: Number})
    declare width;
    @property({type: Number})
    declare height;
    @property({type: Boolean})
    declare smoothCurve;
    @property({type: Boolean})
    declare fillLine;
    @property({type: String})
    declare xAxisLabel: string | null;
    @property({type: String})
    declare yAxisLabel: string | null;

    private declare svg: d3.Selection<SVGElement, unknown, null, undefined>;
    private declare xScale: d3.ScaleTime<number, number>;
    private declare yScale: d3.ScaleLinear<number, number>;
    private declare xAxis: d3.Axis<number | { valueOf(): number }>;
    private declare yAxis: d3.Axis<number | { valueOf(): number }>;
    private declare initialWidth: number;
    private declare resizeObserver: ResizeObserver | null;
    private declare mouse: MouseController;

    constructor() {
        super();
        this.id = 'line-chart';
        this.data = {xs: [], ys: [[]]};
        this.colours = [
            "#FF6D75",
            "#FFD23F",
            "#14FFEC",
            "#A88BEB",
            "#FF9642",
            "#53D8FB",
            "#C0D860",
            "#F25DFC",
        ];
        this.initialWidth = 600;
        this.width = this.initialWidth;
        this.height = 400;
        this.scaleType = 'fixed-height';
        this.margin = {top: 50, right: 40, bottom: 80, left: 80};
        this.smoothCurve = false;
        this.fillLine = false;
        this.strokeWidth = 2;
        this.pointRadius = 2.5;
        this.xAxisLabel = null;
        this.yAxisLabel = null;
        this.mouse = new MouseController(this);
        this.resizeObserver = null;
    }

    override firstUpdated() {
        const el = this.renderRoot.querySelector(`#${this.id}`) as SVGElement;
        this.svg = d3.select(el);
        this.initialWidth = this.width;
        this.setupChart();

        this.resizeObserver = new ResizeObserver(() => {
            if (el && this.scaleType === "fixed-height") {
                this.width = el.clientWidth;
                this.setupChart();
                this.drawChart(); // Redraw the chart based on the new width
            } else if (this.scaleType === "ratio") {
                this.width = this.initialWidth;
            }
        });

        this.resizeObserver.observe(el); // Begin observing the SVG element for size changes
    }

    override updated(changedProperties: PropertyValues) {
        if (!changedProperties.has("data") || !this.data) return;
        this.drawChart();
    }

    override disconnectedCallback() {
        super.disconnectedCallback();
        if (this.resizeObserver) {
            this.resizeObserver.disconnect(); // Disconnect the observer when the component is removed
            this.resizeObserver = null;
        }
    }

    setupChart() {
        this.svg.selectAll('*').remove();

        this.xScale = d3.scaleTime().range([this.margin.left, this.width - this.margin.right]);
        this.yScale = d3.scaleLinear().range([this.height - this.margin.bottom, this.margin.top]);

        this.xAxis = d3.axisBottom(this.xScale);
        this.yAxis = d3.axisLeft(this.yScale);

        switch (this.scaleType) {
            case "ratio":
                this.svg
                    .attr("viewBox", `0 0 ${this.width} ${this.height}`)
                    .attr("width", "100%");
                break;
            case "fixed-height":
                this.svg
                    .attr("width", this.width)
                    .attr("height", this.height);
        }


        this.svg.append("g").attr("class", "axis x-axis");
        this.svg.append("g").attr("class", "axis y-axis");

        if (this.xAxisLabel) {
            this.svg.append("text")
                .attr("transform", `translate(${this.width / 2}, ${this.height - this.margin.bottom / 2.3})`)
                .attr("class", "axis text")
                .text(this.xAxisLabel);
        }

        if (this.yAxisLabel) {
            this.svg.append("text")
                .attr("transform", "rotate(-90)")
                .attr("y", this.margin.left / 5)
                .attr("x", 0 - (this.height / 2))
                .attr("dy", "1em")
                .attr("class", "axis text")
                .text(this.yAxisLabel);
        }
    }

    drawChart() {
        this.xScale.domain(d3.extent(this.data.xs));
        const yMax = d3.max(this.data.ys, (d: (Date | number)[]) => (d.length > 0 ? d3.max(d) : undefined)) || 0;
        this.yScale.domain([0, yMax]);

        for (let index = 0; index < this.data.ys[0].length; index++) {
            const lineGenerator = d3.line<LineDatum>()
                .x((d: LineDatum) => this.xScale(d.x))
                .y((d: LineDatum) => this.yScale(d.y))
                .curve(this.smoothCurve ? d3.curveCatmullRom.alpha(0.9) : d3.curveLinear)
                .defined((d: LineDatum) => d.x !== null && d.y !== null);

            const lineData = this.data.xs.map((x, i) => ({x, y: this.data.ys[i][index]}));

            this.svg.append("defs").append("clipPath")
                .attr("id", "clip")
                .append("rect")
                .attr("width", this.width)
                .attr("height", this.height);

            if (this.fillLine) {
                const areaGenerator = d3.area<LineDatum>()
                    .x((d: LineDatum) => this.xScale(d.x))
                    .y1((d: LineDatum) => this.yScale(d.y))
                    .y0(this.yScale(0))
                    .curve(this.smoothCurve ? d3.curveCatmullRom.alpha(0.5) : d3.curveLinear)
                    .defined((d: LineDatum) => d.x !== null && d.y !== null);

                this.svg.append("path")
                    .datum(lineData)
                    .attr("class", `area area${index}`)
                    .attr("style", `fill: ${this.colours[index % this.colours.length]}; opacity: 0.1; mix-blend-mode: color-dodge;`)
                    .attr("d", areaGenerator)
                    .attr("clip-path", "url(#clip)");  // Apply clipping here;
            }

            this.svg.append("path")
                .datum(lineData)
                .attr("class", `line line${index}`)
                .attr("style", `stroke: ${this.colours[index % this.colours.length]}; stroke-width: ${this.strokeWidth}px`)
                .attr("d", lineGenerator)
                .attr("clip-path", "url(#clip)");  // Apply clipping here;

            const validLineData = lineData.filter(d => d.x !== null && d.y !== null);

            const circles = this.svg.selectAll(`circle.line${index + 1}`)
                .data(validLineData)
                .join("circle")
                .attr("class", `circle-${index} circle`)
                .attr("style", `fill: ${this.colours[index % this.colours.length]};`)
                .attr("cx", (d: LineDatum) => this.xScale(d.x))
                .attr("cy", (d: LineDatum) => this.yScale(d.y))
                .attr("r", this.pointRadius)
            ;

            circles.on("mouseover", ((_event: MouseEvent, d: LineDatum) => {
                const tooltip = this.renderRoot.querySelector(".tooltip") as HTMLDivElement;
                if (tooltip) {
                    const x = d.x instanceof Date ? d.x.toLocaleDateString() : d.x;
                    const y = d.y instanceof Date ? d.y.toLocaleDateString() : d.y;
                    tooltip.style.left = `${window.scrollX + this.mouse.pos.x + 10}px`;
                    tooltip.style.top = `${window.scrollY + this.mouse.pos.y - 40}px`;
                    tooltip.innerHTML = `x: ${x}<br>y: ${y}`;
                    tooltip.style.opacity = "1";
                }
            }) as never);

            circles.on("mouseout", () => {
                const tooltip = this.renderRoot.querySelector(".tooltip") as HTMLDivElement;
                if (tooltip) {
                    tooltip.style.opacity = "0";
                }
            });
        }

        this.svg.select(".x-axis")
            .attr("transform", `translate(0, ${this.height - this.margin.bottom})`)
            .call(this.xAxis);

        this.svg.select(".y-axis")
            .attr("transform", `translate(${this.margin.left}, 0)`)
            .call(this.yAxis);
    }

    override render() {
        return html`
            <div>
                <svg id="${this.id}" class="chart"></svg>
                <div class="tooltip" style="opacity:0;"></div> 
            </div>
        `
    }
}

declare global {
    interface HTMLElementTagNameMap {
        'line-chart': LineChart
    }
}
