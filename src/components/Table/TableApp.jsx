// src/components/Table/TableApp.js
import React, { useEffect, useState } from "react";
import { Table, Input, Button } from "antd";
import { useWavelength } from "../../context/WavelengthContext";
import { generateDataSource } from "../../utils/generateDataSource";

const { TextArea } = Input;

const columns = [
  {
    title: "Длина волны λ, нм",
    dataIndex: "wavelength",
    key: "wavelength",
  },
  {
    title: "Номер образца",
    dataIndex: "number",
    key: "number",
  },
  {
    title: "Оптическая плотность",
    dataIndex: "value",
    key: "value",
  },
];

const TableApp = () => {
  const {
    stepLambda,
    setStepLambda,
    beginLambda,
    setBeginLambda,
    endLambda,
    setEndLambda,
    valueArray,
    setValueArray,
  } = useWavelength();
  const [inputValues, setInputValues] = useState(valueArray.join(", "));

  useEffect(() => {
    setInputValues(valueArray.join(", "));
  }, [valueArray]);

  const handleStepLambdaChange = (e) => {
    const value = parseFloat(e.target.value) || 5;
    setStepLambda(value > 0 ? value : 5);
  };

  const handleBeginLambdaChange = (e) => {
    const value = parseFloat(e.target.value) || 315;
    setBeginLambda(value);
  };

  const handleEndLambdaChange = (e) => {
    const value = parseFloat(e.target.value) || 1000;
    setEndLambda(value > beginLambda ? value : beginLambda + stepLambda);
  };

  const handleValuesChange = (e) => {
    setInputValues(e.target.value);
  };

  const handleApplyValues = () => {
    const newArray = inputValues
      .split(/[\s,]+/)
      .map((val) => parseFloat(val))
      .filter((val) => !isNaN(val));
    setValueArray(newArray);
    // Сохранение всех данных в localStorage
    localStorage.setItem("stepLambda", stepLambda);
    localStorage.setItem("beginLambda", beginLambda);
    localStorage.setItem("endLambda", endLambda);
    localStorage.setItem("valueArray", JSON.stringify(newArray));
  };

  // Вычисляем dataSource на основе текущих значений
  const dataSource = generateDataSource(stepLambda, beginLambda, endLambda, valueArray);

  return (
    <div>
      <h2>Настройка длин волн и данных</h2>
      <div style={{ display: "flex", gap: "16px", marginBottom: "16px", flexWrap: "wrap" }}>
        <div>
          <span>Шаг длины волны (нм): </span>
          <Input
            value={stepLambda}
            onChange={handleStepLambdaChange}
            style={{ width: 100 }}
            type="number"
            step={1}
            min={0.1}
          />
        </div>
        <div>
          <span>Начальная длина волны (нм): </span>
          <Input
            value={beginLambda}
            onChange={handleBeginLambdaChange}
            style={{ width: 100 }}
            type="number"
            step={1}
          />
        </div>
        <div>
          <span>Конечная длина волны (нм): </span>
          <Input
            value={endLambda}
            onChange={handleEndLambdaChange}
            style={{ width: 100 }}
            type="number"
            step={1}
          />
        </div>
      </div>
      <div style={{ marginBottom: "16px" }}>
        <span>Значения оптической плотности (через пробел или запятую): </span>
        <div>
          <TextArea
            value={inputValues}
            onChange={handleValuesChange}
            placeholder="Введите значения оптической плотности для каждой длины волны в, например: 2.092, 2.008, 1.953..."
            rows={4}
            style={{ marginTop: "8px", width: "100%", maxWidth: "500px" }}
          />
        </div>
        <Button type="primary" onClick={handleApplyValues} style={{ marginTop: "8px" }}>
          Применить значения
        </Button>
      </div>
      <Table dataSource={dataSource} columns={columns} pagination={false} />
    </div>
  );
};

export default TableApp;

let valueArray = [
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
