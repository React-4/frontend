import { useEffect, useState } from "react";
import ReactApexChart from "react-apexcharts";

const ApexChart = () => {
  const [chartOptions, setChartOptions] = useState({
    series: [
      {
        name: "Candlestick",
        type: "candlestick",
        data: [
          {
            x: new Date(1538778600000),
            y: [6629.81, 6650.5, 6623.04, 6633.33],
          },
          { x: new Date(1538780400000), y: [6632.01, 6643.59, 6620, 6630.11] },
          {
            x: new Date(1538782200000),
            y: [6630.71, 6648.95, 6623.34, 6635.65],
          },
          // (추가 데이터 생략)
          { x: new Date(1538884800000), y: [6604.98, 6606, 6604.07, 6606] },
        ],
      },
      {
        name: "Marker Points",
        type: "line",
        data: [
          { x: new Date(1538780400000), y: 6625.59 }, // 마커가 표시될 포인트
          // { x: new Date(1538794800000), y: 6614.4 }, // 다른 마커 포인트
          //{ x: new Date(1538827200000), y: 6600 }, // 또 다른 포인트
        ],
      },
    ],
    options: {
      chart: {
        // 해당 부분 눌렀을 때 뜸

        events: {
          //   click: () => {
          //     console.log("clicked");
          //   },
          dataPointSelection: (event, chartContext, opts) => {
            console.log(chartContext, opts);
          },
        },
        height: 350,
        type: "line",
      },
      plotOptions: {
        candlestick: {
          colors: {
            upward: "#00B746",
            downward: "#EF403C",
          },
        },
      },
      stroke: {
        width: [1, 3], // 캔들스틱과 라인 두 개의 시리즈 중, 라인 시리즈의 두께 설정
      },
      markers: {
        size: 5,
        colors: ["#FF4560"],
        strokeColors: "#fff",
        strokeWidth: 2,
        hover: {
          size: 7,
        },
      },
      xaxis: {
        type: "datetime",
      },
      yaxis: {
        tooltip: {
          enabled: true,
        },
      },
      title: {
        text: "Candlestick Chart with Markers",
        align: "left",
      },
    },
  });

  return (
    <div>
      <div id="chart">
        <ReactApexChart
          options={chartOptions.options}
          series={chartOptions.series}
          type="candlestick"
          height={350}
        />
      </div>
    </div>
  );
};

export default ApexChart;
