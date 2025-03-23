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
import { generateDataSource } from "../../utils/generateDataSource";

const LineChartApp = () => {
  // Читаем данные из localStorage
  const stepLambda = parseFloat(localStorage.getItem("stepLambda")) || 5;
  const beginLambda = parseFloat(localStorage.getItem("beginLambda")) || 315;
  const endLambda = parseFloat(localStorage.getItem("endLambda")) || 1000;
  const valueArray = JSON.parse(localStorage.getItem("valueArray"));
    // Вычисляем dataSource
  const dataSource = generateDataSource(stepLambda, beginLambda, endLambda, valueArray);

  if (!dataSource || dataSource.length === 0) {
    return <div>Нет данных для отображения графика</div>;
  }

  return (
    <div>
      <ResponsiveContainer width="100%" height={400}>
        <LineChart data={dataSource} margin={{ top: 10, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="5 5" />
          <XAxis dataKey="wavelength" name="Длина волны" unit=" нм" />
          <YAxis name="Оптическая плотность" />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="value" stroke="#8884d8" name="Оптическая плотность" />
        </LineChart>
      </ResponsiveContainer>
      <h2>Рисунок 1 - Спектр поглощения водо-солевого экстракта мяса</h2>
    </div>
  );
};

export default LineChartApp;
