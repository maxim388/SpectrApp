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
import { Select } from "antd";
import { computeSecondDerivative, savitzkyGolay } from "../../utils/peakUtils";
import { useWavelength } from "../../context/WavelengthContext";
import { generateDataSource } from "../../utils/generateDataSource";

const { Option } = Select;

const DerivativeSmoothingApp = ({ onSmoothingComplete }) => {
  const [chartData, setChartData] = useState([]);
  const [windowSize, setWindowSize] = useState(5);
  const { stepLambda, beginLambda, endLambda, valueArray } = useWavelength();

  // Мемоизация dataSource
  const dataSource = useMemo(() => {
    return generateDataSource(stepLambda, beginLambda, endLambda, valueArray);
  }, [stepLambda, beginLambda, endLambda, valueArray]);

  // Мемоизация вычислений второй производной и сглаживания
  const computedData = useMemo(() => {
    if (!Array.isArray(dataSource) || dataSource.length < 2) {
      return null;
    }

    const xValues = dataSource.map((d) => d.wavelength);
    const yValues = dataSource.map((d) => d.value);
    const secondDerivative = computeSecondDerivative(yValues);
    const smoothedDerivative = savitzkyGolay(secondDerivative, windowSize, 2);

    return { xValues, yValues, smoothedDerivative };
  }, [dataSource, windowSize]);

  useEffect(() => {
    if (!computedData) {
      setChartData([]);
      return;
    }

    const { xValues, yValues, smoothedDerivative } = computedData;
    const newChartData = xValues.map((wavelength, idx) => ({
      wavelength,
      secondDerivative: smoothedDerivative[idx],
    }));

    setChartData(newChartData);

    if (onSmoothingComplete) {
      onSmoothingComplete({
        smoothedDerivative,
        xValues,
        yValues,
      });
    }
  }, [computedData, onSmoothingComplete]);

  const handleWindowSizeChange = (value) => {
    setWindowSize(value);
  };

  if (!Array.isArray(dataSource) || dataSource.length === 0) {
    return <div>Нет данных для отображения графика</div>;
  }

  return (
    <div>
      <div style={{ marginBottom: 16 }}>
        <span>Размер окна сглаживания (Smoothing Window Size): </span>
        <Select value={windowSize} style={{ width: 120 }} onChange={handleWindowSizeChange}>
          <Option value={3}>3</Option>
          <Option value={5}>5</Option>
          <Option value={7}>7</Option>
          <Option value={9}>9</Option>
        </Select>
      </div>
      <ResponsiveContainer width="100%" height={400}>
        <LineChart data={chartData} margin={{ top: 10, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="5 5" />
          <XAxis dataKey="wavelength" name="Длина волны" unit=" нм" />
          <YAxis name="Вторая производная" />
          <Tooltip />
          <Legend />
          <Line
            type="monotone"
            dataKey="secondDerivative"
            stroke="#ff7300"
            name="Вторая производная"
          />
        </LineChart>
      </ResponsiveContainer>
      <h2>Рисунок 3 - Результат разрешения спектра с помощью второй производной</h2>
    </div>
  );
};

export default DerivativeSmoothingApp;
