import React, { FC } from "react"
import { Line } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    Title,
    Tooltip,
    Legend,
    LineElement,
    PointElement,
    Filler,
} from 'chart.js';
import { Line_Chart_Props } from "../../lib/modules/Interfaces";

export const LineChart: FC<Line_Chart_Props> = ({ title, labels, dataset }) => {
    ChartJS.register(
        CategoryScale,
        LinearScale,
        PointElement,
        LineElement,
        Title,
        Tooltip,
        Filler,
        Legend
    );

    const lineOptions = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top' as const,
            },
            title: {
                display: true,
                text: '',
            },
        },
        stacked: false,
        interaction: {
            intersect: false,
        },
        scales: {
            y: {
                border: {
                    display: false,
                },
                ticks: {
                    font: {
                        family: 'Arial',
                        size: 14
                    }
                },
                grid: {
                    // drawOnChartArea: false,
                    // display: false,
                    // lineWidth: 0,
                    drawTicks: true,
                },
                title: {
                    display: true,
                    text: '',
                    font: {
                        family: 'Arial',
                        size: 14,
                    }
                }
            },
            x: {
                border: {
                    display: false,
                },
                ticks: {
                    font: {
                        family: 'Arial',
                        size: 14
                    }
                },
                grid: {
                    drawOnChartArea: false,
                    display: false,
                    lineWidth: 0,
                    drawTicks: true,
                },
                title: {
                    display: true,
                    text: '',
                    font: {
                        family: 'Arial',
                        size: 14,
                    }
                }
            },
        },
    };

    const lineData = {
        labels: labels,
        datasets: dataset,
    };

    return (
        <React.Fragment>
            <Line options={lineOptions} data={lineData} />
        </React.Fragment>
    )
}