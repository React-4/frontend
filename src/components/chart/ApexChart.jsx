import React, { useState, useEffect } from "react";
import ReactApexChart from "react-apexcharts";
import axios from "axios";

const ApexChart = () => {
  const [stockData, setStockData] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [markerData, setMarkerData] = useState([]);
  const [chartOptions, setChartOptions] = useState(null);

  // 공시 데이터 생성
  const generateDisclosure = (data) => {
    const markerData = [];
    data.forEach((stock, index) => {
      if (index % 10 === 0) {
        const currentDate = new Date(
          stock.date.slice(0, 4),
          stock.date.slice(5, 7) - 1,
          stock.date.slice(8, 10)
        );
        markerData.push({
          x: currentDate.toISOString().slice(0, 10), // 공시 날짜 (ISO 포맷)
          y: stock.closePrice, // 공시가 발생한 종가
          announcement: `공시 제목 ${Math.floor(index / 10) + 1}`,
        });
      }
    });
    return markerData;
  };

  // 주가 데이터 처리 및 정렬
  const processStockData = (data) => {
    const processedData = data.map((stock) => ({
      x: new Date(
        stock.date.slice(0, 4),
        stock.date.slice(5, 7) - 1,
        stock.date.slice(8, 10)
      )
        .toISOString()
        .slice(0, 10), // ISO 포맷으로 저장
      y: [stock.openPrice, stock.highPrice, stock.lowPrice, stock.closePrice],
    }));
    return processedData.sort((a, b) => new Date(a.x) - new Date(b.x));
  };

  const getStockData = async () => {
    const res = await axios.get("/json/stockData.json");
    const data = res.data.data;
    setStockData([...data]);
  };

  useEffect(() => {
    getStockData();
  }, []);

  useEffect(() => {
    if (stockData.length > 0) {
      const filteredData = processStockData(stockData);
      setChartData(filteredData);

      const generatedMarkerData = generateDisclosure(stockData);
      setMarkerData(generatedMarkerData);
    }
  }, [stockData]);

  useEffect(() => {
    if (chartData.length > 0) {
      setChartOptions({
        series: [
          {
            name: "Candlestick",
            type: "candlestick",
            data: chartData,
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
            },
            zoom: {
              enabled: true,
            },
          },
          // title: {
          //   text: "CandleStick Chart",
          //   align: "left",
          // },
          plotOptions: {
            candlestick: {
              colors: {
                upward: "#2372EB",
                downward: "#FF5959",
              },
            },
          },
          xaxis: {
            type: "categories",
            categories: chartData.map((data) => data.x),
            labels: {
              format: "yyyy-MM-dd",
            },
          },
          markers: {
            size: 7,
            colors: ["#787878"],
            strokeColors: "#fff",
            strokeWidth: 2,
            shape: "star",
            hover: {
              size: 13,
            },
          },
          tooltip: {
            enabled: true,
            shared: false,
            custom: ({ seriesIndex, dataPointIndex, w }) => {
              if (seriesIndex === 1) {
                const announcement =
                  w.config.series[seriesIndex].data[dataPointIndex]
                    .announcement;
                return `<div style="padding: 5px; background: #fff; border: 1px solid #ccc;">
                          <strong>${announcement}</strong>
                        </div>`;
              }
              return null;
            },
          },
        },
      });
    }
  }, [chartData, markerData]);

  return (
    <div>
      <div id="chart">
        {chartOptions && (
          <ReactApexChart
            options={chartOptions.options}
            series={chartOptions.series}
            type="candlestick"
            height={350}
          />
        )}
      </div>
    </div>
  );
};

export default ApexChart;
