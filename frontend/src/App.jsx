import { useEffect, useState } from 'react';
import './App.css';

const OPERATIONS = {
  add: '+',
  subtract: '−',
  multiply: '×',
  divide: '÷',
};

const BINARY_KEYPAD = [
  ['7', '8', '9', OPERATIONS.divide],
  ['4', '5', '6', OPERATIONS.multiply],
  ['1', '2', '3', OPERATIONS.subtract],
  ['±', '0', '.', OPERATIONS.add],
];

const MEMORY_ACTIONS = ['MC', 'MR', 'M+', 'M-'];

const SCIENTIFIC_ACTIONS = [
  { key: 'sqrt', label: '√x' },
  { key: 'square', label: 'x²' },
  { key: 'reciprocal', label: '1/x' },
  { key: 'factorial', label: 'n!' },
  { key: 'sin', label: 'sin' },
  { key: 'cos', label: 'cos' },
  { key: 'tan', label: 'tan' },
  { key: 'log', label: 'log' },
  { key: 'ln', label: 'ln' },
  { key: 'backspace', label: '⌫' },
];

const CONSTANT_ACTIONS = [
  { key: 'pi', label: 'π', value: Math.PI },
  { key: 'euler', label: 'e', value: Math.E },
];

const MAX_HISTORY_ITEMS = 10;
const FACTORIAL_LIMIT = 170;

const createHistoryEntry = (label, value, meta = {}) => ({
  id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
  label,
  value,
  display: formatNumber(value),
  meta,
});

function factorial(value) {
  if (!Number.isInteger(value) || value < 0 || value > FACTORIAL_LIMIT) {
    return NaN;
  }

  let result = 1;
  for (let index = 2; index <= value; index += 1) {
    result *= index;
  }
  return result;
}

function convertAngle(value, angleMode) {
  return angleMode === 'deg' ? (value * Math.PI) / 180 : value;
}

function formatNumber(value, precisionMode = 'compact') {
  if (Number.isNaN(value) || !Number.isFinite(value)) {
    return 'Error';
  }

  const normalizedZero = Object.is(value, -0) ? 0 : value;
  if (precisionMode === 'high') {
    return normalizedZero.toPrecision(12).replace(/\.?0+$/, '');
  }

  const text = normalizedZero.toString();
  return text.length <= 12 ? text : normalizedZero.toExponential(6);
}

function performCalculation(a, b, operator) {
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
}

function parseDisplayValue(value) {
  return Number(value);
}

function App() {
  const [displayValue, setDisplayValue] = useState('0');
  const [storedValue, setStoredValue] = useState(null);
  const [pendingOperator, setPendingOperator] = useState(null);
  const [overwrite, setOverwrite] = useState(true);
  const [memoryValue, setMemoryValue] = useState(0);
  const [history, setHistory] = useState([]);
  const [lastAction, setLastAction] = useState('Ready');
  const [angleMode, setAngleMode] = useState('deg');
  const [precisionMode, setPrecisionMode] = useState('compact');
  const [stats, setStats] = useState({
    operations: 0,
    unaryOperations: 0,
    memoryHits: 0,
  });

  const isInError = displayValue === 'Error';
  const memoryActive = memoryValue !== 0;
  const displayFormatter = (value) => formatNumber(value, precisionMode);
  const currentValue = parseDisplayValue(displayValue);
  const expressionPreview =
    storedValue !== null && pendingOperator !== null
      ? `${displayFormatter(storedValue)} ${pendingOperator} ${displayValue}`
      : 'No active expression';
  const statsCards = [
    { label: 'Binary ops', value: stats.operations },
    { label: 'Unary ops', value: stats.unaryOperations },
    { label: 'Memory recalls', value: stats.memoryHits },
  ];

  const pushHistory = (entry) => {
    setHistory((current) => [entry, ...current].slice(0, MAX_HISTORY_ITEMS));
  };

  const incrementStat = (key) => {
    setStats((current) => ({
      ...current,
      [key]: current[key] + 1,
    }));
  };

  const applyDisplayResult = (result, actionLabel, historyMeta = {}) => {
    const formatted = displayFormatter(result);
    setDisplayValue(formatted);

    if (formatted === 'Error') {
      setStoredValue(null);
      setPendingOperator(null);
      setOverwrite(true);
      setLastAction(`${actionLabel} failed`);
      pushHistory(createHistoryEntry(`${actionLabel} = Error`, Number.NaN, historyMeta));
      return false;
    }

    setOverwrite(true);
    setLastAction(actionLabel);
    pushHistory(createHistoryEntry(`${actionLabel} = ${formatted}`, result, historyMeta));
    return true;
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

  const replayHistoryValue = (entry) => {
    if (entry.display === 'Error') {
      return;
    }

    setDisplayValue(entry.display);
    setOverwrite(true);
    setLastAction(`Loaded ${entry.display} from history`);
  };

  const injectConstant = (constant) => {
    if (recoverFromError()) {
      return;
    }

    const formatted = displayFormatter(constant.value);
    setDisplayValue(formatted);
    setOverwrite(true);
    setLastAction(`Inserted constant ${constant.label}`);
    pushHistory(createHistoryEntry(`Constant ${constant.label} = ${formatted}`, constant.value, { type: 'constant' }));
  };

  const finalizeBinaryOperation = (nextOperator) => {
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
    const summary = `${displayFormatter(storedValue)} ${pendingOperator} ${displayFormatter(currentValue)}`;
    const success = applyDisplayResult(result, summary, { type: 'binary', operator: pendingOperator });

    if (!success) {
      return;
    }

    setStoredValue(result);
    setPendingOperator(nextOperator);
    incrementStat('operations');
  };

  const selectOperator = (operator) => {
    if (recoverFromError()) {
      return;
    }

    finalizeBinaryOperation(operator);
  };

  const evaluate = () => {
    if (pendingOperator === null || storedValue === null || isInError) {
      return;
    }

    finalizeBinaryOperation(null);
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

    const result = currentValue / 100;
    const success = applyDisplayResult(result, `${displayFormatter(currentValue)}%`, { type: 'percent' });
    if (success) {
      incrementStat('unaryOperations');
    }
  };

  const applyScientificAction = (action) => {
    if (recoverFromError()) {
      return;
    }

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
    const inputLabel = displayFormatter(currentValue);

    switch (action) {
      case 'sqrt':
        result = currentValue < 0 ? NaN : Math.sqrt(currentValue);
        label = `√(${inputLabel})`;
        break;
      case 'square':
        result = currentValue ** 2;
        label = `sq(${inputLabel})`;
        break;
      case 'reciprocal':
        result = currentValue === 0 ? NaN : 1 / currentValue;
        label = `1/(${inputLabel})`;
        break;
      case 'factorial':
        result = factorial(currentValue);
        label = `${inputLabel}!`;
        break;
      case 'sin':
        result = Math.sin(convertAngle(currentValue, angleMode));
        label = `sin(${inputLabel} ${angleMode})`;
        break;
      case 'cos':
        result = Math.cos(convertAngle(currentValue, angleMode));
        label = `cos(${inputLabel} ${angleMode})`;
        break;
      case 'tan':
        result = Math.tan(convertAngle(currentValue, angleMode));
        label = `tan(${inputLabel} ${angleMode})`;
        break;
      case 'log':
        result = currentValue <= 0 ? NaN : Math.log10(currentValue);
        label = `log(${inputLabel})`;
        break;
      case 'ln':
        result = currentValue <= 0 ? NaN : Math.log(currentValue);
        label = `ln(${inputLabel})`;
        break;
      default:
        return;
    }

    const success = applyDisplayResult(result, label, { type: 'scientific', action, angleMode });
    if (success) {
      incrementStat('unaryOperations');
    }
  };

  const handleMemoryAction = (action) => {
    if (recoverFromError()) {
      return;
    }

    switch (action) {
      case 'MC':
        setMemoryValue(0);
        setLastAction('Memory cleared');
        break;
      case 'MR':
        setDisplayValue(displayFormatter(memoryValue));
        setOverwrite(true);
        setLastAction('Memory recalled');
        incrementStat('memoryHits');
        break;
      case 'M+':
        setMemoryValue((current) => current + currentValue);
        setLastAction(`Added ${displayFormatter(currentValue)} to memory`);
        break;
      case 'M-':
        setMemoryValue((current) => current - currentValue);
        setLastAction(`Subtracted ${displayFormatter(currentValue)} from memory`);
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
          applyScientificAction('backspace');
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
  }, [angleMode, currentValue, displayValue, isInError, overwrite, pendingOperator, precisionMode, storedValue]);

  return (
    <div className="app">
      <div className="calculator-shell">
        <section className="calculator">
          <div className="calculator-topbar">
            <div>
              <p className="eyebrow">Advanced Desk Calculator</p>
              <h1>Scientific and memory workflow</h1>
            </div>
            <div className={`memory-badge ${memoryActive ? 'active' : ''}`}>M {displayFormatter(memoryValue)}</div>
          </div>

          <div className="control-ribbon">
            <div className="mode-group">
              <span className="control-label">Angle</span>
              <button
                type="button"
                className={`chip ${angleMode === 'deg' ? 'active' : ''}`}
                onClick={() => setAngleMode('deg')}
              >
                Deg
              </button>
              <button
                type="button"
                className={`chip ${angleMode === 'rad' ? 'active' : ''}`}
                onClick={() => setAngleMode('rad')}
              >
                Rad
              </button>
            </div>
            <div className="mode-group">
              <span className="control-label">Precision</span>
              <button
                type="button"
                className={`chip ${precisionMode === 'compact' ? 'active' : ''}`}
                onClick={() => setPrecisionMode('compact')}
              >
                Compact
              </button>
              <button
                type="button"
                className={`chip ${precisionMode === 'high' ? 'active' : ''}`}
                onClick={() => setPrecisionMode('high')}
              >
                High
              </button>
            </div>
          </div>

          <div className="display-panel">
            <div className="expression-preview">{expressionPreview}</div>
            <div className="display" data-testid="display">
              {displayValue}
            </div>
            <div className="status-row">
              <span>{lastAction}</span>
              <span>{angleMode.toUpperCase()} mode</span>
            </div>
          </div>

          <div className="memory-row">
            {MEMORY_ACTIONS.map((action) => (
              <button key={action} type="button" className="memory" onClick={() => handleMemoryAction(action)}>
                {action}
              </button>
            ))}
          </div>

          <div className="constant-row">
            {CONSTANT_ACTIONS.map((constant) => (
              <button key={constant.key} type="button" className="function subtle" onClick={() => injectConstant(constant)}>
                {constant.label}
              </button>
            ))}
            <button type="button" className="function subtle" onClick={percent}>
              %
            </button>
            <button type="button" className="function subtle" onClick={toggleSign}>
              ±
            </button>
          </div>

          <div className="scientific-grid">
            {SCIENTIFIC_ACTIONS.map((action) => (
              <button
                key={action.key}
                type="button"
                className="function subtle"
                onClick={() => applyScientificAction(action.key)}
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
            <button type="button" className="function" onClick={() => replayHistoryValue(history[0])} disabled={history.length === 0}>
              ANS
            </button>
            <button type="button" className="equals" onClick={evaluate}>
              =
            </button>

            {BINARY_KEYPAD.flat().map((key, index) => {
              if (Object.values(OPERATIONS).includes(key)) {
                return (
                  <button key={`${key}-${index}`} type="button" className="operator" onClick={() => selectOperator(key)}>
                    {key}
                  </button>
                );
              }

              if (key === '±') {
                return (
                  <button key={`${key}-${index}`} type="button" className="function" onClick={toggleSign}>
                    {key}
                  </button>
                );
              }

              if (key === '.') {
                return (
                  <button key={`${key}-${index}`} type="button" onClick={appendDecimal}>
                    .
                  </button>
                );
              }

              return (
                <button key={`${key}-${index}`} type="button" onClick={() => appendDigit(key)}>
                  {key}
                </button>
              );
            })}
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
              {history.map((entry) => (
                <li key={entry.id}>
                  <button type="button" className="history-entry" onClick={() => replayHistoryValue(entry)}>
                    <span>{entry.label}</span>
                    <strong>{entry.display}</strong>
                  </button>
                </li>
              ))}
            </ul>
          )}

          <div className="stats-grid">
            {statsCards.map((card) => (
              <div key={card.label} className="stat-card">
                <span>{card.label}</span>
                <strong>{card.value}</strong>
              </div>
            ))}
          </div>

          <div className="shortcut-card">
            <p className="eyebrow">Shortcuts</p>
            <p>Digits and arithmetic operators work from the keyboard.</p>
            <p>`Enter` evaluates, `Backspace` deletes, `Esc` clears entry.</p>
            <p>`Ctrl/Cmd + L` triggers a full reset.</p>
          </div>
        </aside>
      </div>
    </div>
  );
}

export default App;
