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
  const valueArray = JSON.parse(localStorage.getItem("valueArray")) || [
    2.092, 2.008, 1.953, 1.908, 1.835, 1.755, 1.707, 1.686, 1.657, 1.612, 1.579, 1.547, 1.512,
    1.495, 1.484, 1.497, 1.533, 1.57, 1.633, 1.711, 1.712, 1.631, 1.486, 1.319, 1.194, 1.112,
    1.058, 1.014, 0.977, 0.948, 0.919, 0.892, 0.869, 0.85, 0.833, 0.815, 0.797, 0.78, 0.765,
    0.75, 0.737, 0.726, 0.719, 0.716, 0.713, 0.707, 0.697, 0.678, 0.656, 0.637, 0.624, 0.62,
    0.621, 0.618, 0.603, 0.578, 0.556, 0.537, 0.521, 0.511, 0.505, 0.497, 0.49, 0.484, 0.478,
    0.518, 0.57, 0.578, 0.479, 0.489, 0.556, 0.498, 0.432, 0.415, 0.408, 0.399, 0.395, 0.393,
    0.389, 0.384, 0.379, 0.374, 0.369, 0.365, 0.358, 0.352, 0.348, 0.345, 0.339, 0.335, 0.331,
    0.327, 0.323, 0.32, 0.316, 0.312, 0.307, 0.304, 0.301, 0.298, 0.295, 0.288, 0.284, 0.284,
    0.282, 0.279, 0.276, 0.274, 0.272, 0.268, 0.265, 0.261, 0.259, 0.255, 0.252, 0.25, 0.246,
    0.245, 0.243, 0.24, 0.237, 0.235, 0.232, 0.23, 0.228, 0.226, 0.223, 0.221, 0.218, 0.216,
    0.215, 0.235, 0.296, 0.343, 0.374, 0.399, 0.425, 0.449,
  ];
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
