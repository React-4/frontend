/* eslint-disable react/prop-types */
import React, { useState, useEffect, useMemo, useCallback } from "react";
import ReactApexChart from "react-apexcharts";
import axios from "axios";

const ApexChart = ({ stockId, type }) => {
  const [stockData, setStockData] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [markerData, setMarkerData] = useState([]);
  const [length, setLength] = useState(100);

  // type 변경에 따라 length 조정
  useEffect(() => {
    if (type === "day") setLength(100);
    if (type === "week") setLength(50);
    if (type === "month") setLength(20);
  }, [type]);

  // 주식 데이터 가져오기
  const getStockData = useCallback(async () => {
    try {
      const res = await axios.get(
        `http://43.203.154.25:8080/api/stockprice/${stockId}?type=${type}&length=${length}`
      );
      const data = res.data.data;
      setStockData([...data]);
    } catch (error) {
      console.error("Error fetching stock data:", error);
    }
  }, [stockId, type, length]);

  // stockData 변경 시 처리된 차트 데이터 생성
  const processedData = useMemo(() => {
    if (stockData.length === 0) return [];

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

        // 비어있는 날짜 채우기
        if (previousDate) {
          let diffDays = (currentDate - previousDate) / (1000 * 60 * 60 * 24);
          while (diffDays > 1) {
            previousDate.setDate(previousDate.getDate() + 1);
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
          x: currentDate.getTime(),
          y: [
            stock.openPrice,
            stock.highPrice,
            stock.lowPrice,
            stock.closePrice,
          ],
        });

        previousDate = currentDate;
        previousStock = stock;
      }

      return processedData;
    };

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

    return processStockData(sortedData);
  }, [stockData]);

  // 공시 데이터 생성
  const generatedMarkerData = useMemo(() => {
    if (stockData.length === 0) return [];

    return stockData
      .filter((_, index) => index % 10 === 0)
      .map((stock, index) => {
        const currentDate = new Date(
          stock.date.slice(0, 4),
          stock.date.slice(5, 7) - 1,
          stock.date.slice(8, 10)
        );

        return {
          x: currentDate.getTime(),
          y: stock.closePrice,
          announcement: `공시 제목 ${Math.floor(index / 10) + 1}`,
        };
      });
  }, [stockData]);

  // 차트 옵션 생성
  const chartOptions = useMemo(() => {
    if (chartData.length === 0) return null;

    return {
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
          type: "datetime",
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
                w.config.series[seriesIndex].data[dataPointIndex].announcement;
              return `<div style="padding: 5px; background: #fff; border: 1px solid #ccc;">
                        <strong>${announcement}</strong>
                      </div>`;
            }
            return null;
          },
        },
      },
    };
  }, [chartData, markerData]);

  useEffect(() => {
    getStockData();
  }, [getStockData]);

  useEffect(() => {
    setChartData(processedData);
    setMarkerData(generatedMarkerData);
  }, [processedData, generatedMarkerData]);

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
