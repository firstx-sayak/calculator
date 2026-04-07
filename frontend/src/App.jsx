import { useEffect, useState } from 'react';
import './App.css';

const OPERATIONS = {
  add: '+',
  subtract: '−',
  multiply: '×',
  divide: '÷',
};

const UNARY_ACTIONS = [
  { key: 'sqrt', label: '√x' },
  { key: 'square', label: 'x²' },
  { key: 'reciprocal', label: '1/x' },
  { key: 'backspace', label: '⌫' },
];

const NUMBER_GRID = [
  ['7', '8', '9'],
  ['4', '5', '6'],
  ['1', '2', '3'],
];

const MAX_HISTORY_ITEMS = 8;

const formatNumber = (value) => {
  if (Number.isNaN(value) || !Number.isFinite(value)) {
    return 'Error';
  }

  const normalizedZero = Object.is(value, -0) ? 0 : value;
  const text = normalizedZero.toString();
  return text.length <= 12 ? text : normalizedZero.toExponential(6);
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

const parseDisplayValue = (value) => Number(value);

function App() {
  const [displayValue, setDisplayValue] = useState('0');
  const [storedValue, setStoredValue] = useState(null);
  const [pendingOperator, setPendingOperator] = useState(null);
  const [overwrite, setOverwrite] = useState(true);
  const [memoryValue, setMemoryValue] = useState(0);
  const [history, setHistory] = useState([]);
  const [lastAction, setLastAction] = useState('Ready');

  const isInError = displayValue === 'Error';
  const memoryActive = memoryValue !== 0;
  const expressionPreview =
    storedValue !== null && pendingOperator !== null ? `${formatNumber(storedValue)} ${pendingOperator}` : 'No active expression';

  const pushHistory = (entry) => {
    setHistory((current) => [entry, ...current].slice(0, MAX_HISTORY_ITEMS));
  };

  const handleAllClear = () => {
    setDisplayValue('0');
    setStoredValue(null);
    setPendingOperator(null);
    setOverwrite(true);
    setLastAction('Calculator reset');
  };

  const handleClearEntry = () => {
    setDisplayValue('0');
    setOverwrite(true);
    setLastAction('Entry cleared');
  };

  const recoverFromError = () => {
    if (!isInError) {
      return false;
    }

    handleAllClear();
    return true;
  };

  const appendDigit = (digit) => {
    const resetFromError = recoverFromError();

    setDisplayValue((current) => {
      if (overwrite || resetFromError) {
        setOverwrite(false);
        return digit;
      }

      if (current === '0') {
        return digit;
      }

      return `${current}${digit}`;
    });

    setLastAction(`Entered ${digit}`);
  };

  const appendDecimal = () => {
    const resetFromError = recoverFromError();

    setDisplayValue((current) => {
      if (overwrite || resetFromError) {
        setOverwrite(false);
        return '0.';
      }

      if (current.includes('.')) {
        return current;
      }

      return `${current}.`;
    });

    setLastAction('Decimal appended');
  };

  const finalizeResult = ({ result, summary, nextOperator, nextStoredValue = result }) => {
    const formatted = formatNumber(result);
    setDisplayValue(formatted);

    if (formatted === 'Error') {
      setStoredValue(null);
      setPendingOperator(null);
      setOverwrite(true);
      setLastAction(`${summary} failed`);
      pushHistory(`${summary} = Error`);
      return;
    }

    setStoredValue(nextStoredValue);
    setPendingOperator(nextOperator);
    setOverwrite(true);
    setLastAction(summary);
    pushHistory(`${summary} = ${formatted}`);
  };

  const commitPendingOperation = (nextOperator) => {
    const currentValue = parseDisplayValue(displayValue);

    if (storedValue === null || pendingOperator === null) {
      setStoredValue(currentValue);
      setPendingOperator(nextOperator);
      setOverwrite(true);
      setLastAction(nextOperator ? `Queued ${nextOperator}` : 'Value committed');
      return;
    }

    if (overwrite && nextOperator !== null) {
      setPendingOperator(nextOperator);
      setLastAction(`Switched operator to ${nextOperator}`);
      return;
    }

    const result = performCalculation(storedValue, currentValue, pendingOperator);
    const summary = `${formatNumber(storedValue)} ${pendingOperator} ${formatNumber(currentValue)}`;
    finalizeResult({
      result,
      summary,
      nextOperator,
    });
  };

  const selectOperator = (operator) => {
    if (recoverFromError()) {
      return;
    }

    commitPendingOperation(operator);
  };

  const evaluate = () => {
    if (pendingOperator === null || storedValue === null || isInError) {
      return;
    }

    commitPendingOperation(null);
  };

  const toggleSign = () => {
    if (recoverFromError()) {
      return;
    }

    setDisplayValue((current) => {
      if (current === '0' || overwrite) {
        return current;
      }

      return current.startsWith('-') ? current.slice(1) : `-${current}`;
    });
    setLastAction('Sign toggled');
  };

  const percent = () => {
    if (recoverFromError()) {
      return;
    }

    const currentValue = parseDisplayValue(displayValue);
    const result = currentValue / 100;
    const formatted = formatNumber(result);
    setDisplayValue(formatted);
    setOverwrite(true);
    setLastAction('Converted to percent');
    pushHistory(`${formatNumber(currentValue)}% = ${formatted}`);
  };

  const applyUnaryOperation = (action) => {
    if (recoverFromError()) {
      return;
    }

    const currentValue = parseDisplayValue(displayValue);

    if (action === 'backspace') {
      if (overwrite) {
        return;
      }

      const nextValue = displayValue.length <= 1 ? '0' : displayValue.slice(0, -1);
      setDisplayValue(nextValue === '-' ? '0' : nextValue);
      setLastAction('Deleted last digit');
      return;
    }

    let result = currentValue;
    let label = '';

    switch (action) {
      case 'sqrt':
        result = currentValue < 0 ? NaN : Math.sqrt(currentValue);
        label = `√(${formatNumber(currentValue)})`;
        break;
      case 'square':
        result = currentValue ** 2;
        label = `sq(${formatNumber(currentValue)})`;
        break;
      case 'reciprocal':
        result = currentValue === 0 ? NaN : 1 / currentValue;
        label = `1/(${formatNumber(currentValue)})`;
        break;
      default:
        return;
    }

    const formatted = formatNumber(result);
    setDisplayValue(formatted);
    setOverwrite(true);
    setLastAction(`Applied ${action}`);
    pushHistory(`${label} = ${formatted}`);
  };

  const handleMemoryAction = (action) => {
    if (recoverFromError()) {
      return;
    }

    const currentValue = parseDisplayValue(displayValue);

    switch (action) {
      case 'MC':
        setMemoryValue(0);
        setLastAction('Memory cleared');
        break;
      case 'MR':
        setDisplayValue(formatNumber(memoryValue));
        setOverwrite(true);
        setLastAction('Memory recalled');
        break;
      case 'M+':
        setMemoryValue((current) => current + currentValue);
        setLastAction(`Added ${formatNumber(currentValue)} to memory`);
        break;
      case 'M-':
        setMemoryValue((current) => current - currentValue);
        setLastAction(`Subtracted ${formatNumber(currentValue)} from memory`);
        break;
      default:
        break;
    }
  };

  useEffect(() => {
    const handleKeyDown = (event) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'l') {
        event.preventDefault();
        handleAllClear();
        return;
      }

      if (/^\d$/.test(event.key)) {
        event.preventDefault();
        appendDigit(event.key);
        return;
      }

      switch (event.key) {
        case '.':
          event.preventDefault();
          appendDecimal();
          break;
        case '+':
          event.preventDefault();
          selectOperator(OPERATIONS.add);
          break;
        case '-':
          event.preventDefault();
          selectOperator(OPERATIONS.subtract);
          break;
        case '*':
          event.preventDefault();
          selectOperator(OPERATIONS.multiply);
          break;
        case '/':
          event.preventDefault();
          selectOperator(OPERATIONS.divide);
          break;
        case 'Enter':
        case '=':
          event.preventDefault();
          evaluate();
          break;
        case '%':
          event.preventDefault();
          percent();
          break;
        case 'Backspace':
          event.preventDefault();
          applyUnaryOperation('backspace');
          break;
        case 'Escape':
          event.preventDefault();
          handleClearEntry();
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [displayValue, evaluate, overwrite, pendingOperator, storedValue]);

  return (
    <div className="app">
      <div className="calculator-shell">
        <section className="calculator">
          <div className="calculator-topbar">
            <div>
              <p className="eyebrow">Advanced Desk Calculator</p>
              <h1>Multi-step arithmetic</h1>
            </div>
            <div className={`memory-badge ${memoryActive ? 'active' : ''}`}>M {formatNumber(memoryValue)}</div>
          </div>

          <div className="display-panel">
            <div className="expression-preview">{expressionPreview}</div>
            <div className="display" data-testid="display">
              {displayValue}
            </div>
            <div className="status-row">
              <span>{lastAction}</span>
              <span>Keyboard enabled</span>
            </div>
          </div>

          <div className="memory-row">
            {['MC', 'MR', 'M+', 'M-'].map((action) => (
              <button key={action} type="button" className="memory" onClick={() => handleMemoryAction(action)}>
                {action}
              </button>
            ))}
          </div>

          <div className="utility-grid">
            {UNARY_ACTIONS.map((action) => (
              <button
                key={action.key}
                type="button"
                className="function subtle"
                onClick={() => applyUnaryOperation(action.key)}
              >
                {action.label}
              </button>
            ))}
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

            {NUMBER_GRID[0].map((digit) => (
              <button key={digit} type="button" onClick={() => appendDigit(digit)}>
                {digit}
              </button>
            ))}
            <button type="button" className="operator" onClick={() => selectOperator(OPERATIONS.multiply)}>
              {OPERATIONS.multiply}
            </button>

            {NUMBER_GRID[1].map((digit) => (
              <button key={digit} type="button" onClick={() => appendDigit(digit)}>
                {digit}
              </button>
            ))}
            <button type="button" className="operator" onClick={() => selectOperator(OPERATIONS.subtract)}>
              {OPERATIONS.subtract}
            </button>

            {NUMBER_GRID[2].map((digit) => (
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
            <button type="button" className="zero" onClick={() => appendDigit('0')}>
              0
            </button>
            <button type="button" onClick={appendDecimal}>
              .
            </button>
            <button type="button" className="equals" onClick={evaluate}>
              =
            </button>
          </div>
        </section>

        <aside className="history-panel">
          <div className="history-header">
            <div>
              <p className="eyebrow">Session Log</p>
              <h2>Recent calculations</h2>
            </div>
            <span>{history.length}/{MAX_HISTORY_ITEMS}</span>
          </div>

          {history.length === 0 ? (
            <p className="history-empty">Your completed operations will appear here.</p>
          ) : (
            <ul className="history-list">
              {history.map((entry, index) => (
                <li key={`${entry}-${index}`}>{entry}</li>
              ))}
            </ul>
          )}

          <div className="shortcut-card">
            <p className="eyebrow">Shortcuts</p>
            <p>Digits and operators work from the keyboard.</p>
            <p>`Enter` evaluates, `Backspace` deletes, `Esc` clears entry.</p>
          </div>
        </aside>
      </div>
    </div>
  );
}

export default App;
