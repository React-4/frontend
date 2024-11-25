import React, { useState, useEffect } from "react";
import ReactApexChart from "react-apexcharts";
import axios from "axios";

const ApexChart = () => {
  const [stockData, setStockData] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [markerData, setMarkerData] = useState([]);
  const [chartOptions, setChartOptions] = useState(null);

  // 데이터 정리: 연속되지 않은 날짜 제거
  const processStockData = (data) => {
    const processedData = [];
    let previousDate = null;
    let previousStock = null;

    for (const stock of data) {
      const currentDate = new Date(
        stock.date.slice(0, 4),
        stock.date.slice(5, 7) - 1,
        stock.date.slice(8, 10)
      );

      // 비어있는 날짜를 직전 날짜 값으로 채우기
      if (previousDate) {
        let diffDays = (currentDate - previousDate) / (1000 * 60 * 60 * 24); // 날짜 차이 계산
        while (diffDays > 1) {
          previousDate.setDate(previousDate.getDate() + 1); // 다음 날짜 생성
          processedData.push({
            x: previousDate.getTime(),
            y: [
              previousStock.closePrice,
              previousStock.closePrice,
              previousStock.closePrice,
              previousStock.closePrice,
            ],
          });
          diffDays--;
        }
      }

      // 현재 날짜 데이터 추가
      processedData.push({
        x: currentDate.getTime(), // X축에 timestamp 사용
        y: [stock.openPrice, stock.highPrice, stock.lowPrice, stock.closePrice],
      });

      previousDate = currentDate; // 직전 날짜 업데이트
      previousStock = stock; // 직전 주식 데이터 업데이트
    }

    return processedData;
  };

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
          x: currentDate.getTime(), // timestamp 형식으로 변경
          y: stock.closePrice, // 공시가 발생한 종가
          announcement: `공시 제목 ${Math.floor(index / 10) + 1}`,
        });
      }
    });
    return markerData;
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
      // 날짜 정렬 후 비연속적인 날짜 제거
      const sortedData = stockData.sort(
        (a, b) =>
          new Date(
            a.date.slice(0, 4),
            a.date.slice(5, 7) - 1,
            a.date.slice(8, 10)
          ) -
          new Date(
            b.date.slice(0, 4),
            b.date.slice(5, 7) - 1,
            b.date.slice(8, 10)
          )
      );
      const continuousData = processStockData(sortedData);

      setChartData(continuousData);

      // 공시 데이터 생성
      const generatedMarkerData = generateDisclosure(sortedData);
      setMarkerData(generatedMarkerData);
    }
  }, [stockData]);

  useEffect(() => {
    if (chartData.length > 0) {
      setChartOptions({
        series: [
          {
            name: "주가",
            type: "candlestick",
            data: chartData,
            color: "#0045B0",
          },
          {
            name: "공시",
            type: "scatter",
            data: markerData,
            color: "#fff716",
          },
        ],
        options: {
          chart: {
            type: "candlestick",
            height: 350,
            toolbar: {
              autoSelected: "pan",
              show: true,
            },
            zoom: {
              enabled: true,
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
          xaxis: {
            type: "datetime", // X축을 datetime으로 설정
            labels: {
              format: "yyyy-MM-dd",
            },
          },
          markers: {
            size: 7,
            colors: ["#fff716"],
            strokeColors: "#5a5a5a",
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
