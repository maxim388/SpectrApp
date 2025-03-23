/**
 * Асимметричное сглаживание методом наименьших квадратов (ALS)
 * @param {number[]} y - Исходные данные (спектр)
 * @param {number} lambda - Параметр сглаживания (рекомендуется 10^2 - 10^9)
 * @param {number} p - Фактор асимметрии (рекомендуется 0.001)
 * @param {number} nIter - Количество итераций (рекомендуется 10)
 * @returns {number[]} - Базовая линия
 */
export function alsBaseline(y, lambda = 1e7, p = 0.001, nIter = 100) {
  const L = y.length;
  const D = diffMatrix(L);
  let w = new Array(L).fill(1);

  let z = y.slice(); // Начальное приближение базовой линии

  for (let i = 0; i < nIter; i++) {
    const W = diagMatrix(w);
    const Z = addMatrices(W, mulMatrixByScalar(mulMatrices(transposeMatrix(D), D), lambda));
    z = solveLinearSystem(Z, mulMatrixByVector(W, y));
    w = y.map((yi, idx) => p * (yi > z[idx] ? 1 : 0) + (1 - p) * (yi <= z[idx] ? 1 : 0));
  }

  return z;
}

/**
 * Создаёт матрицу разностей (для вычисления второй производной)
 * @param {number} L - Длина данных
 * @returns {number[][]} - Матрица разностей
 */
function diffMatrix(L) {
  const data = [];
  for (let i = 0; i < L - 2; i++) {
    const row = new Array(L).fill(0);
    row[i] = 1;
    row[i + 1] = -2;
    row[i + 2] = 1;
    data.push(row);
  }
  return data;
}

/**
 * Создаёт диагональную матрицу из массива
 * @param {number[]} arr - Массив значений
 * @returns {number[][]} - Диагональная матрица
 */
function diagMatrix(arr) {
  const L = arr.length;
  const data = new Array(L).fill(0).map(() => new Array(L).fill(0));
  for (let i = 0; i < L; i++) {
    data[i][i] = arr[i];
  }
  return data;
}

/**
 * Транспонирует матрицу
 * @param {number[][]} matrix - Исходная матрица
 * @returns {number[][]} - Транспонированная матрица
 */
function transposeMatrix(matrix) {
  return matrix[0].map((_, colIndex) => matrix.map((row) => row[colIndex]));
}

/**
 * Умножает матрицу на скаляр
 * @param {number[][]} matrix - Исходная матрица
 * @param {number} scalar - Скаляр
 * @returns {number[][]} - Результирующая матрица
 */
function mulMatrixByScalar(matrix, scalar) {
  return matrix.map((row) => row.map((val) => val * scalar));
}

/**
 * Умножает две матрицы
 * @param {number[][]} A - Первая матрица
 * @param {number[][]} B - Вторая матрица
 * @returns {number[][]} - Результирующая матрица
 */
function mulMatrices(A, B) {
  const rowsA = A.length;
  const colsA = A[0].length;
  const colsB = B[0].length;
  const result = new Array(rowsA).fill(0).map(() => new Array(colsB).fill(0));

  for (let i = 0; i < rowsA; i++) {
    for (let j = 0; j < colsB; j++) {
      for (let k = 0; k < colsA; k++) {
        result[i][j] += A[i][k] * B[k][j];
      }
    }
  }

  return result;
}

/**
 * Складывает две матрицы
 * @param {number[][]} A - Первая матрица
 * @param {number[][]} B - Вторая матрица
 * @returns {number[][]} - Результирующая матрица
 */
function addMatrices(A, B) {
  return A.map((row, i) => row.map((val, j) => val + B[i][j]));
}

/**
 * Умножает матрицу на вектор
 * @param {number[][]} matrix - Матрица
 * @param {number[]} vector - Вектор
 * @returns {number[]} - Результирующий вектор
 */
function mulMatrixByVector(matrix, vector) {
  return matrix.map((row) => row.reduce((sum, val, i) => sum + val * vector[i], 0));
}

/**
 * Решает систему линейных уравнений Ax = b методом Гаусса
 * @param {number[][]} A - Матрица коэффициентов
 * @param {number[]} b - Вектор правой части
 * @returns {number[]} - Решение системы
 */
function solveLinearSystem(A, b) {
  const n = A.length;
  const Ab = A.map((row, i) => [...row, b[i]]);

  // Прямой ход метода Гаусса
  for (let i = 0; i < n; i++) {
    // Поиск максимального элемента в столбце
    let maxRow = i;
    for (let j = i + 1; j < n; j++) {
      if (Math.abs(Ab[j][i]) > Math.abs(Ab[maxRow][i])) {
        maxRow = j;
      }
    }
    // Перестановка строк
    [Ab[i], Ab[maxRow]] = [Ab[maxRow], Ab[i]];
    // Нормализация строки
    const div = Ab[i][i];
    for (let j = i; j <= n; j++) {
      Ab[i][j] /= div;
    }
    // Исключение переменной
    for (let j = i + 1; j < n; j++) {
      const factor = Ab[j][i];
      for (let k = i; k <= n; k++) {
        Ab[j][k] -= factor * Ab[i][k];
      }
    }
  }

  // Обратный ход метода Гаусса
  const x = new Array(n).fill(0);
  for (let i = n - 1; i >= 0; i--) {
    x[i] = Ab[i][n];
    for (let j = i + 1; j < n; j++) {
      x[i] -= Ab[i][j] * x[j];
    }
  }

  return x;
}