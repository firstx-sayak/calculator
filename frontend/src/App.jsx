import { useState } from 'react';
import './App.css';

const OPERATIONS = {
  add: '+',
  subtract: '−',
  multiply: '×',
  divide: '÷',
};

const formatNumber = (value) => {
  if (Number.isNaN(value) || !Number.isFinite(value)) {
    return 'Error';
  }

  const text = value.toString();
  return text.length <= 12 ? text : value.toExponential(6);
};

const performCalculation = (a, b, operator) => {
  switch (operator) {
    case OPERATIONS.add:
      return a + b;
    case OPERATIONS.subtract:
      return a - b;
    case OPERATIONS.multiply:
      return a * b;
    case OPERATIONS.divide:
      return b === 0 ? NaN : a / b;
    default:
      return b;
  }
};

const numberGrid = [
  ['7', '8', '9'],
  ['4', '5', '6'],
  ['1', '2', '3'],
];

function App() {
  const [displayValue, setDisplayValue] = useState('0');
  const [storedValue, setStoredValue] = useState(null);
  const [pendingOperator, setPendingOperator] = useState(null);
  const [overwrite, setOverwrite] = useState(true);

  const isInError = displayValue === 'Error';

  const handleAllClear = () => {
    setDisplayValue('0');
    setStoredValue(null);
    setPendingOperator(null);
    setOverwrite(true);
  };

  const handleClearEntry = () => {
    setDisplayValue('0');
    setOverwrite(true);
  };

  const appendDigit = (digit) => {
    if (isInError) {
      handleAllClear();
    }

    setDisplayValue((current) => {
      if (overwrite) {
        setOverwrite(false);
        return digit;
      }

      if (current === '0') {
        return digit;
      }

      return `${current}${digit}`;
    });
  };

  const appendDecimal = () => {
    if (isInError) {
      handleAllClear();
    }

    setDisplayValue((current) => {
      if (overwrite) {
        setOverwrite(false);
        return '0.';
      }

      if (current.includes('.')) {
        return current;
      }

      return `${current}.`;
    });
  };

  const commitPendingOperation = (nextOperator) => {
    const currentValue = Number(displayValue);

    if (storedValue === null) {
      setStoredValue(currentValue);
    } else if (!overwrite || nextOperator === null) {
      const result = performCalculation(storedValue, currentValue, pendingOperator);
      const formatted = formatNumber(result);
      setStoredValue(Number.isNaN(result) ? null : result);
      setDisplayValue(formatted);
      if (formatted === 'Error') {
        setPendingOperator(null);
        setOverwrite(true);
        return;
      }
    }

    setPendingOperator(nextOperator);
    setOverwrite(true);
  };

  const selectOperator = (operator) => {
    if (isInError) {
      handleAllClear();
      return;
    }

    commitPendingOperation(operator);
  };

  const evaluate = () => {
    if (pendingOperator === null || storedValue === null) {
      return;
    }

    commitPendingOperation(null);
  };

  const toggleSign = () => {
    if (isInError) {
      handleAllClear();
      return;
    }

    setDisplayValue((current) => {
      if (current === '0' || overwrite) {
        return current;
      }

      return current.startsWith('-') ? current.slice(1) : `-${current}`;
    });
  };

  const percent = () => {
    if (isInError) {
      handleAllClear();
      return;
    }

    setDisplayValue((current) => formatNumber(Number(current) / 100));
    setOverwrite(true);
  };

  return (
    <div className="app">
      <div className="calculator">
        <div className="display" data-testid="display">
          {displayValue}
        </div>
        <div className="buttons">
          <button type="button" className="function" onClick={handleAllClear}>
            AC
          </button>
          <button type="button" className="function" onClick={handleClearEntry}>
            C
          </button>
          <button type="button" className="function" onClick={percent}>
            %
          </button>
          <button type="button" className="operator" onClick={() => selectOperator(OPERATIONS.divide)}>
            {OPERATIONS.divide}
          </button>

          {numberGrid[0].map((digit) => (
            <button key={digit} type="button" onClick={() => appendDigit(digit)}>
              {digit}
            </button>
          ))}
          <button type="button" className="operator" onClick={() => selectOperator(OPERATIONS.multiply)}>
            {OPERATIONS.multiply}
          </button>

          {numberGrid[1].map((digit) => (
            <button key={digit} type="button" onClick={() => appendDigit(digit)}>
              {digit}
            </button>
          ))}
          <button type="button" className="operator" onClick={() => selectOperator(OPERATIONS.subtract)}>
            {OPERATIONS.subtract}
          </button>

          {numberGrid[2].map((digit) => (
            <button key={digit} type="button" onClick={() => appendDigit(digit)}>
              {digit}
            </button>
          ))}
          <button type="button" className="operator" onClick={() => selectOperator(OPERATIONS.add)}>
            {OPERATIONS.add}
          </button>

          <button type="button" className="function" onClick={toggleSign}>
            ±
          </button>
          <button type="button" onClick={() => appendDigit('0')}>
            0
          </button>
          <button type="button" onClick={appendDecimal}>
            .
          </button>
          <button type="button" className="equals" onClick={evaluate}>
            =
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
