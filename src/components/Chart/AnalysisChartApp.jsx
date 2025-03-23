import React, { useState } from "react";
import DerivativeSmoothingApp from "./DerivativeSmoothingApp";
import PeakAnalysis from "./PeakAnalysis";

const AnalysisChartApp = () => {
  const [smoothingData, setSmoothingData] = useState(null);

  return (
    <div>
      <DerivativeSmoothingApp onSmoothingComplete={setSmoothingData} />
      {smoothingData && (
        <PeakAnalysis
          smoothedDerivative={smoothingData.smoothedDerivative}
          xValues={smoothingData.xValues}
          yValues={smoothingData.yValues}
        />
      )}
    </div>
  );
};

export default AnalysisChartApp;
