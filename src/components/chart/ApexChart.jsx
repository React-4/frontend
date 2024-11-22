import React, { useState } from "react";
import ReactApexChart from "react-apexcharts";

const ApexChart = () => {
  // 100일치의 가상 주가 데이터를 생성
  const generateStockData = () => {
    const data = [];
    const markerData = [];
    const startDate = new Date(2024, 0, 1); // 시작 날짜: 2024년 1월 1일
    let open = 70000;

    for (let i = 0; i < 100; i++) {
      const date = new Date(startDate);
      date.setDate(date.getDate() + i); // 날짜를 1일씩 증가

      // 랜덤한 주가 생성
      const high = open + Math.floor(Math.random() * 1000); // 고가
      const low = open - Math.floor(Math.random() * 1000); // 저가
      const close = low + Math.floor(Math.random() * (high - low)); // 종가

      data.push({
        x: date,
        y: [open, high, low, close],
      });

      // 특정 날짜마다 공시를 추가 (약 10개)
      if (i % 10 === 0) {
        markerData.push({
          x: date,
          y: close,
          announcement: `공시 제목 ${i / 10 + 1}`,
        });
      }

      open = close; // 다음 날의 시가를 현재 종가로 설정
    }

    return { data, markerData };
  };

  const { data, markerData } = generateStockData();

  const [chartOptions, setChartOptions] = useState({
    series: [
      {
        name: "Candlestick",
        type: "candlestick",
        data: data,
      },
      {
        name: "Public Announcements",
        type: "scatter",
        data: markerData,
      },
    ],
    options: {
      chart: {
        type: "candlestick",
        height: 350,
        toolbar: {
          autoSelected: "pan",
          show: false,
        },
      },
      plotOptions: {
        candlestick: {
          colors: {
            upward: "#2372EB",
            downward: "#FF5959",
          },
        },
      },
      markers: {
        size: 8,
        colors: ["#6a6a6a"],
        strokeColors: "#fff",
        strokeWidth: 2,
        hover: {
          size: 13,
        },
      },
      tooltip: {
        enabled: true,
        shared: false,
        custom: ({ series, seriesIndex, dataPointIndex, w }) => {
          if (seriesIndex === 1) {
            const announcement =
              w.config.series[seriesIndex].data[dataPointIndex].announcement;
            return `<div style="padding: 5px; background: #fff; border: 1px solid #ccc;">
                      <strong>${announcement}</strong>
                    </div>`;
          }
          return null;
        },
      },
      xaxis: {
        type: "datetime",
        labels: {
          format: "yyyy-MM-dd",
        },
      },
      yaxis: {
        tooltip: {
          enabled: false,
        },
      },
      // title: {
      //   text: "차트",
      //   align: "left",
      // },
    },
    optionsBar: {
      chart: {
        height: 160,
        type: "bar",
        brush: {
          enabled: true,
          target: "candles",
        },
        selection: {
          enabled: true,
          xaxis: {
            min: new Date("20 Jan 2017").getTime(),
            max: new Date("10 Dec 2017").getTime(),
          },
          fill: {
            color: "#ccc",
            opacity: 0.4,
          },
          stroke: {
            color: "#0D47A1",
          },
        },
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
        />{" "}
        {/* 거래량 차트 수정 */}
        {/* <ReactApexChart
          options={chartOptions.optionsBar}
          // series={chartOptions.series}
          type="bar"
          height={160}
        /> */}
      </div>
    </div>
  );
};

export default ApexChart;
