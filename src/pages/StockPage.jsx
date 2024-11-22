import React from "react";
import ApexChart from "../components/chart/ApexChart";
import TradingViewChart from "../components/chart/TradingViewChart";
//import Reactfinancialchart from "../components/chart/reactfinancialchart";

export default function StockPage() {
  return (
    <div className="flex flex-col">
      <div className="flex flex-row  gap-2">
        <div className="font-semibold text-xl">삼성전자</div>
        <div className="text-primary-2 font-semibold text-lg ">005930</div>
      </div>
      <div className="flex flex-row gap-3">
        <div className="font-bold text-xl">50,900원</div>
        <div className="text-sm">
          어제보다{" "}
          <span className="text-primary-4 font-bold">-2000원 (3.7%)</span>
        </div>
      </div>
      <div>
        <div className="font-bold text-xl">차트</div>
        <ApexChart />
      </div>
    </div>
  );
}
