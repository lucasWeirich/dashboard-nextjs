import { getUser } from "@/lib/auth";
import React, { useState, useEffect } from "react";
import { Chart } from "react-google-charts";

export const options = {
  width: 400,
  height: 120,
  greenFrom: 85,
  greenTo: 100,
  yellowFrom: 75,
  yellowTo: 85,
  minorTicks: 8,
};

interface GaugeSalesProps {
  percentage: number,
}

export default function GaugeSales(props: GaugeSalesProps) {
  const company = getUser()

  function getData() {
    return [
      ["Label", "Value"],
      ["Sales", (props.percentage / company.sales_goal * 100)]
    ];
  }

  return (
    <Chart
      chartType="Gauge"
      width="120px"
      height="120px"
      data={getData()}
      options={options}
    />
  );
}