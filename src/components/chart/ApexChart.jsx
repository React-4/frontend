import React, { useState, useEffect, useMemo, useCallback } from "react";
import ReactApexChart from "react-apexcharts";
import axios from "axios";
const BASE_URL = import.meta.env.VITE_BACK_URL;
import { getChartDisclosure } from "../../services/disclosureAPI";
import { useNavigate } from "react-router-dom";
import { Fullscreen } from "@mui/icons-material";

const ApexChart = ({ stockId, type, company }) => {
  const [stockData, setStockData] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [markerData, setMarkerData] = useState([]);
  const [length, setLength] = useState(80);
  const [disclosure, setDisclosure] = useState([]);
  const [selectedAnnouncements, setSelectedAnnouncements] = useState([]); // 선택된 공시 목록
  const [isListVisible, setIsListVisible] = useState(false); // 공시 리스트 표시 여부
  const [selectedDate, setSelectedDate] = useState(""); // 선택된 날짜
  const navigate = useNavigate();

  // type 변경에 따라 length 조정
  useEffect(() => {
    if (type === "day") setLength(80);
    if (type === "week") setLength(30);
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

  // 한국 시간으로 변환하는 함수
  const toKoreanDate = (dateString) => {
    const utcDate = new Date(
      Date.UTC(
        dateString.slice(0, 4), // 연도
        dateString.slice(5, 7) - 1, // 월 (0-based)
        dateString.slice(8, 10) // 일
      )
    );

    // UTC 시간에서 9시간을 더하여 한국 시간(KST)으로 변환
    utcDate.setHours(utcDate.getHours() + 9);
    return utcDate;
  };

  // stockData 변경 시 처리된 차트 데이터 생성
  const processedData = useMemo(() => {
    if (stockData.length === 0) return [];
    console.log(stockData);
    const processStockData = (data) => {
      const processedData = [];
      let previousDate = null;
      let previousStock = null;

      for (const stock of data) {
        const currentDate = toKoreanDate(stock.date); // 한국 시간으로 변환

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
      (a, b) => toKoreanDate(a.date).getTime() - toKoreanDate(b.date).getTime() // 한국 시간으로 비교
    );

    return processStockData(sortedData);
  }, [stockData]);

  useEffect(() => {
    getChartDisclosure(stockId, type).then((data) => setDisclosure(data));
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

    const markerDataMap = new Map();

    disclosure.forEach((item) => {
      const announcementDate = toKoreanDate(item.date).getTime(); // 한국 시간으로 변환

      const stockForDate = stockData.find((stock) => {
        const stockDate = toKoreanDate(stock.date).getTime(); // 한국 시간으로 비교
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
            id: announcement.announcementId,
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
          events: {
            markerClick: (event, chartContext, config) => {
              const clickedMarker = markerData[config.dataPointIndex];
              setSelectedAnnouncements(clickedMarker.announcements);
              setSelectedDate(clickedMarker.x); // 전체 날짜 출력 (DB에서 받아온 대로)
              setIsListVisible(true);
            },
          },
        },
        plotOptions: {
          candlestick: {
            colors: {
              upward: "#FF5959",
              downward: "#2372EB",
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
              const announcementCount = announcements.length;

              const announcementList = announcements
                .map(
                  ({ title, id }) =>
                    `<li class="mb-2">
                      <a href="/disclosure/${id}"
                         class="text-blue-600 hover:text-blue-800"
                         target="_blank"
                         rel="noopener noreferrer">
                        ${title}
                      </a>
                    </li>`
                )
                .join("");

              return `
                <div class="p-4 bg-white border border-gray-300 rounded-lg">
                  <strong class="block mb-2">공시 목록 (총 ${announcementCount}개)</strong>
                  <ul class="m-0 p-0 list-none">
                    ${announcementList}
                  </ul>
                </div>`;
            }
            return null;
          },
          customPosition: function ({ x, y, w }) {
            return { bottom: y - 40, left: x };
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

  const handleCloseList = () => {
    setIsListVisible(false);
    setSelectedAnnouncements([]);
  };

  // DB에서 받아온 날짜를 YYYY-MM 형식으로 변경하여 출력
  const formatDate = (date) => {
    const d = new Date(date);
    return d.toISOString().slice(0, 10); // yyyy-mm-dd 형식으로 출력
  };

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
      <div className="w-100 flex flex-col items-center">
        {isListVisible && selectedAnnouncements.length > 0 && (
          <div className="relative my-4 py-4 px-6 bg-primary-1 rounded-lg w-full">
            <button
              className="absolute top-3 right-3 border-1 border-primary text-primary px-3 py-1 rounded-md font-semibold text-xs hover:bg-primary hover:text-primary-1"
              onClick={handleCloseList}
            >
              닫기
            </button>
            <div className="mb-4 text-xl font-semibold">
              {formatDate(selectedDate)}
            </div>
            <ul className="space-y-2">
              {selectedAnnouncements.map(({ title, id }, index) => (
                <li
                  key={id}
                  className="text-black hover:text-blue-600 cursor-pointer"
                >
                  <div
                    onClick={() => {
                      navigate(`/disclosure/${id}`, {
                        state: { data: [{ company: company }] },
                      });
                    }}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-black hover:text-blue-600"
                  >
                    - {title}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default ApexChart;
