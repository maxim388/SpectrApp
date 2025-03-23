export function computeSecondDerivative(data) {
  const result = [];
  for (let i = 1; i < data.length - 1; i++) {
    result.push(data[i + 1] - 2 * data[i] + data[i - 1]);
  }
  return [0, ...result, 0];
}

export function savitzkyGolay(data, windowSize, polynomialOrder) {
  const halfWindow = Math.floor(windowSize / 2);
  const smoothed = [];

  // Коэффициенты для второй производной, полином 2-го порядка (квадратичная аппроксимация)
  const coeffsMap = {
    3: [1, -2, 1], // Окно 3
    5: [-2, 1, 0, -1, 2], // Окно 5
    7: [2, -1, -2, 0, 2, 1, -2], // Окно 7
    9: [5, -2, -3, -2, 0, 2, 3, 2, -5], // Окно 9
  };

  const coeffs = coeffsMap[windowSize] || coeffsMap[5]; // По умолчанию 5, если размер не поддерживается

  for (let i = 0; i < data.length; i++) {
    let sum = 0;
    let norm = 0;
    for (let j = -halfWindow; j <= halfWindow; j++) {
      const idx = i + j;
      if (idx >= 0 && idx < data.length) {
        sum += coeffs[j + halfWindow] * data[idx];
        norm += coeffs[j + halfWindow] ** 2;
      }
    }
    smoothed[i] = sum / Math.sqrt(norm || 1);
  }
  return smoothed;
}

export function findPeaks(secondDerivative, xValues, yValues) {
  const peaks = [];
  const threshold = 0.01;

  for (let i = 1; i < secondDerivative.length - 1; i++) {
    if (
      (secondDerivative[i] > secondDerivative[i - 1] &&
        secondDerivative[i] > secondDerivative[i + 1]) || // Положительные пики
      (secondDerivative[i] < secondDerivative[i - 1] &&
        secondDerivative[i] < secondDerivative[i + 1]) // Отрицательные пики
    ) {
      const peakHeight = secondDerivative[i];
      if (Math.abs(peakHeight) > threshold) {
        const peakInfo = calculatePeakProperties(i, secondDerivative, xValues, yValues);
        peaks.push(peakInfo);
      }
    }
  }

  return peaks; // Все пики без ограничения
}

export function calculatePeakProperties(index, secondDerivative, xValues, yValues) {
  const peakCenter = xValues[index] || null;
  const peakHeight = secondDerivative[index] || null;

  let startIdx = index;
  let endIdx = index;
  while (startIdx > 0 && secondDerivative[startIdx] * secondDerivative[startIdx - 1] > 0)
    startIdx--;
  while (
    endIdx < secondDerivative.length - 1 &&
    secondDerivative[endIdx] * secondDerivative[endIdx + 1] > 0
  )
    endIdx++;

  const beginningX = xValues[startIdx] || null;
  const endingX = xValues[endIdx] || null;

  let peakArea = 0;
  for (let i = startIdx; i < endIdx; i++) {
    const dx = (xValues[i + 1] || xValues[i]) - xValues[i];
    peakArea += ((secondDerivative[i] + secondDerivative[i + 1]) / 2) * dx;
  }

  const halfHeight = peakHeight ? peakHeight / 2 : null;
  let leftHalf = startIdx;
  let rightHalf = endIdx;
  while (leftHalf < index && Math.abs(secondDerivative[leftHalf]) < Math.abs(halfHeight || 0))
    leftHalf++;
  while (
    rightHalf > index &&
    Math.abs(secondDerivative[rightHalf]) < Math.abs(halfHeight || 0)
  )
    rightHalf--;
  const fwhm = (xValues[rightHalf] || xValues[index]) - (xValues[leftHalf] || xValues[index]);

  let centroidSum = 0;
  let weightSum = 0;
  for (let i = startIdx; i <= endIdx; i++) {
    const weight = Math.abs(secondDerivative[i]);
    centroidSum += (xValues[i] || 0) * weight;
    weightSum += weight;
  }
  const peakCentroid = weightSum > 0 ? centroidSum / weightSum : null;

  const totalCurveArea =
    yValues.slice(startIdx, endIdx + 1).reduce((sum, val) => sum + (val || 0), 0) *
    ((xValues[1] || 0) - (xValues[0] || 0));

  return {
    peakArea: Math.abs(peakArea),
    percentArea: null,
    curveArea: totalCurveArea || null,
    beginningX,
    endingX,
    peakCenter,
    peakHeight,
    fwhm: fwhm || null,
    peakCentroid,
    totalAreaAtBaselineZero: totalCurveArea || null,
  };
}
