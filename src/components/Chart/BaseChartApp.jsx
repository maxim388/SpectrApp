import React, { useEffect, useState, useMemo } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { alsBaseline } from "../../utils/alsBaseline";
import { useWavelength } from "../../context/WavelengthContext";
import { generateDataSource } from "../../utils/generateDataSource";

const BaseChartApp = () => {
  const [baseline, setBaseline] = useState([]);
  const { stepLambda, beginLambda, endLambda, valueArray } = useWavelength();

  // Мемоизация dataSource
  const dataSource = useMemo(() => {
    return generateDataSource(stepLambda, beginLambda, endLambda, valueArray);
  }, [stepLambda, beginLambda, endLambda, valueArray]);

  useEffect(() => {
    if (!Array.isArray(dataSource) || dataSource.length === 0) {
      setBaseline([]);
      return;
    }

    const yValues = dataSource.map((d) => d.value);
    const baselineValues = alsBaseline(yValues, 1e2, 0.001, 100);
    const newData = dataSource.map((d, idx) => ({
      ...d,
      baseline: baselineValues[idx],
    }));
    setBaseline(newData);
  }, []); 

  if (!Array.isArray(dataSource) || dataSource.length === 0) {
    return <div>Нет данных для отображения графика</div>;
  }

  return (
    <div>
      <ResponsiveContainer width="100%" height={400}>
        <LineChart
          data={baseline}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="5 5" />
          <XAxis dataKey="wavelength" name="Длина волны" unit=" нм" />
          <YAxis name="Оптическая плотность" />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="value" stroke="#8884d8" name="Спект поглощения" />
          <Line type="monotone" dataKey="baseline" stroke="#82ca9d" name="Базовая линия" />
        </LineChart>
      </ResponsiveContainer>
      <h2>Рисунок 2 - Базовая линия спектра</h2>
    </div>
  );
};

export default BaseChartApp;
