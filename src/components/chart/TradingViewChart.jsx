import React, { useEffect } from "react";

const disclosures = [
  {
    date: "2024-11-01",
    title: "삼성전자 공시 예시 제목 1",
    url: "https://example.com/article/1",
  },
  {
    date: "2024-11-10",
    title: "삼성전자 공시 예시 제목 2",
    url: "https://example.com/article/2",
  },
];

export default function TradingViewChart() {
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://s3.tradingview.com/tv.js";
    script.async = true;

    script.onload = () => {
      const widget = new window.TradingView.widget({
        symbol: "KRX:005930", // 삼성전자 티커
        interval: "D",
        container_id: "tv_chart_container",
        theme: "light",
        style: "1", // 1 = Candlestick
        locale: "ko",
        timezone: "Asia/Seoul",
        datafeed: new window.Datafeeds.UDFCompatibleDatafeed(
          "https://demo_feed.tradingview.com"
        ),
        library_path: "/charting_library/",
        overrides: {
          "mainSeriesProperties.style": 1,
        },
        studies: ["Volume@tv-basicstudies"],
      });

      widget.onChartReady(() => {
        disclosures.forEach((disclosure) => {
          const time = new Date(disclosure.date).getTime() / 1000;
          widget
            .chart()
            .createShape(
              { time, text: disclosure.title },
              {
                shape: "text",
                color: "red",
                text: disclosure.title,
                tooltip: disclosure.title,
              }
            )
            .onClick(() => window.open(disclosure.url, "_blank"));
        });
      });
    };

    document.body.appendChild(script);
  }, []);

  return (
    <div>
      <h1>삼성전자 주식 캔들스틱 차트</h1>
      <div id="tv_chart_container" style={{ height: "500px" }}></div>
    </div>
  );
}
