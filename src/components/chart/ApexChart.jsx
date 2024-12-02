/* eslint-disable react/prop-types */
import React, { useState, useEffect, useMemo, useCallback } from "react";
import ReactApexChart from "react-apexcharts";
import axios from "axios";
const BASE_URL = import.meta.env.VITE_BACK_URL;
import { getChartDisclosure } from "../../services/disclosureAPI";

const ApexChart = ({ stockId, type }) => {
  const [stockData, setStockData] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [markerData, setMarkerData] = useState([]);
  const [length, setLength] = useState(100);
  const [disclosure, setDisclosure] = useState([]);

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
        `${BASE_URL}/api/stockprice/${stockId}?type=${type}&length=${length}`
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

  useEffect(() => {
    getChartDisclosure(stockId, type).then((data) => setDisclosure(data));
    console.log(type, disclosure);
  }, [stockId, type]);

  // 공시 데이터를 기반으로 markerData 생성
  const generatedMarkerData = useMemo(() => {
    if (
      !disclosure ||
      disclosure.length === 0 ||
      !stockData ||
      stockData.length === 0
    )
      return [];

    // 날짜별 공시 제목과 중간값 리스트 생성
    const markerDataMap = new Map();

    disclosure.forEach((item) => {
      const announcementDate = new Date(
        item.date.slice(0, 4),
        item.date.slice(5, 7) - 1,
        item.date.slice(8, 10)
      ).getTime();

      // 해당 날짜의 주가 데이터 검색
      const stockForDate = stockData.find((stock) => {
        const stockDate = new Date(
          stock.date.slice(0, 4),
          stock.date.slice(5, 7) - 1,
          stock.date.slice(8, 10)
        ).getTime();
        return stockDate === announcementDate;
      });

      if (stockForDate) {
        const midPrice = (stockForDate.highPrice + stockForDate.lowPrice) / 2;

        item.announcementList.forEach((announcement) => {
          if (!markerDataMap.has(announcementDate)) {
            markerDataMap.set(announcementDate, {
              x: announcementDate,
              y: midPrice,
              announcements: [],
            });
          }
          markerDataMap.get(announcementDate).announcements.push({
            title: announcement.title,
            id: announcement.announcementId, // 공시 ID 추가
          });
        });
      }
    });

    return Array.from(markerDataMap.values());
  }, [disclosure, stockData]);

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
              const announcements =
                w.config.series[seriesIndex].data[dataPointIndex].announcements;

              const announcementList = announcements
                .map(
                  ({ title, id }) =>
                    `<li style="margin: 5px 0;">
                      <a href="/disclosure/${id}"
                         style="text-decoration: none; color: #007bff;"
                         target="_blank"
                         rel="noopener noreferrer">
                        ${title}
                      </a>
                    </li>`
                )
                .join("");

              return `
                <div style="padding: 10px; background: #fff; border: 1px solid #ccc; border-radius: 5px;">
                  <strong style="display: block; margin-bottom: 5px;">공시 목록</strong>
                  <ul style="margin: 0; padding: 0; list-style: none;">
                    ${announcementList}
                  </ul>
                </div>`;
            }
            return null;
          },
          customPosition: function ({ x, y }) {
            return { bottom: y - 100000, left: x };
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
