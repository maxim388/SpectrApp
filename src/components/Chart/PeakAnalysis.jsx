import React, { useEffect, useState } from "react";
import { Table } from "antd";
import { findPeaks, calculatePeakProperties } from "../../utils/peakUtils";

const PeakAnalysis = ({ smoothedDerivative, xValues, yValues }) => {
  const [peaks, setPeaks] = useState([]);

  useEffect(() => {
    if (smoothedDerivative && xValues && yValues) {
      const detectedPeaks = findPeaks(smoothedDerivative, xValues, yValues);
      const totalPeakArea = detectedPeaks.reduce((sum, peak) => sum + (peak.peakArea || 0), 0);
      const peaksWithPercentArea = detectedPeaks.map((peak) => ({
        ...peak,
        percentArea: totalPeakArea > 0 ? ((peak.peakArea || 0) / totalPeakArea) * 100 : 0,
      }));
      setPeaks(peaksWithPercentArea);
    }
  }, [smoothedDerivative, xValues, yValues]);

  const columns = [
    {
      title: "Начальная X (нм)",
      dataIndex: "beginningX",
      key: "beginningX",
      render: (val) => (val !== null && val !== undefined ? val : "-"),
      sorter: (a, b) => (a.beginningX || 0) - (b.beginningX || 0), // Сортировка по числам
    },
    {
      title: "Конечная X (нм)",
      dataIndex: "endingX",
      key: "endingX",
      render: (val) => (val !== null && val !== undefined ? val : "-"),
      sorter: (a, b) => (a.endingX || 0) - (b.endingX || 0),
    },
    {
      title: "Центр пика (нм)",
      dataIndex: "peakCenter",
      key: "peakCenter",
      render: (val) => (val !== null && val !== undefined ? val : "-"),
      sorter: (a, b) => (a.peakCenter || 0) - (b.peakCenter || 0),
    },
    {
      title: "Высота пика",
      dataIndex: "peakHeight",
      key: "peakHeight",
      render: (val) => (val !== null && val !== undefined ? val.toFixed(4) : "-"),
      sorter: (a, b) => (a.peakHeight || 0) - (b.peakHeight || 0),
    },
    {
      title: "Площадь пика",
      dataIndex: "peakArea",
      key: "peakArea",
      render: (val) => (val !== null && val !== undefined ? val.toFixed(4) : "-"),
      sorter: (a, b) => (a.peakArea || 0) - (b.peakArea || 0),
    },
    {
      title: "Относительная площадь (%)",
      dataIndex: "percentArea",
      key: "percentArea",
      render: (val) => (val !== null && val !== undefined ? val.toFixed(2) : "-"),
      sorter: (a, b) => (a.percentArea || 0) - (b.percentArea || 0),
    },
    {
      title: "Площадь кривой",
      dataIndex: "curveArea",
      key: "curveArea",
      render: (val) => (val !== null && val !== undefined ? val.toFixed(4) : "-"),
      sorter: (a, b) => (a.curveArea || 0) - (b.curveArea || 0),
    },
    {
      title: "FWHM (нм)",
      dataIndex: "fwhm",
      key: "fwhm",
      render: (val) => (val !== null && val !== undefined ? val.toFixed(2) : "-"),
      sorter: (a, b) => (a.fwhm || 0) - (b.fwhm || 0),
    },
    {
      title: "Центроид пика (нм)",
      dataIndex: "peakCentroid",
      key: "peakCentroid",
      render: (val) => (val !== null && val !== undefined ? val.toFixed(2) : "-"),
      sorter: (a, b) => (a.peakCentroid || 0) - (b.peakCentroid || 0),
    },
    {
      title: "Площадь при Y=0",
      dataIndex: "totalAreaAtBaselineZero",
      key: "totalAreaAtBaselineZero",
      render: (val) => (val !== null && val !== undefined ? val.toFixed(4) : "-"),
      sorter: (a, b) => (a.totalAreaAtBaselineZero || 0) - (b.totalAreaAtBaselineZero || 0),
    },
  ];

  return (
    <div>
      <h3>Характеристики пиков (найдено: {peaks.length})</h3>
      <Table dataSource={peaks} columns={columns} rowKey="peakCenter" pagination={false} />
    </div>
  );
};

export default PeakAnalysis;
