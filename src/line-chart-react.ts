import {createComponent} from "@lit/react";
import {LineChart} from "./line-chart";
import React from "react";

export const LineChartComponent = createComponent({
    tagName: 'line-chart',
    elementClass: LineChart,
    react: React,
    events: {
        onactivate: 'activate',
    },
});

console.log(LineChartComponent);