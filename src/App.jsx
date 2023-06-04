/* eslint-disable react/no-array-index-key */
import React from 'react';
import reducer, { initialState } from './reducer';
import { SIZE } from './config';
import Card from './Card.jsx';
import useConfetti from './useConfetti';

function App() {
  const [state, dispatch] = React.useReducer(reducer, initialState);
  const all = React.useMemo(() => {
    const numbers = Array.from({ length: (SIZE * SIZE) / 2 }).map((_, i) => i + 1);

    return numbers.concat(numbers).sort(() => (Math.random() > 0.5 ? -1 : 1));
  }, []);
  const twoOpen = state.openArr.length > 1 && state.openArr.length % 2 === 0;
  const won = Object.keys(state.solved).length === SIZE * SIZE;
  const { start } = useConfetti();

  React.useEffect(() => {
    if (twoOpen) {
      // flip, but set a timeout to unflip?
      setTimeout(() => {
        dispatch({ type: 'CLOSE_LAST_TWO' });
      }, 1000);
    }
  }, [twoOpen]);

  // eslint-disable-next-line consistent-return
  React.useEffect(() => {
    if (won) {
      return start();
    }
  }, [won]);

  return (
    <div
      id="cards"
      style={{
        '--cards': SIZE,
      }}
    >
      {all.map((n, i) => (
        <Card
          number={n}
          index={i}
          key={i}
          isOpen={!!state?.open?.[i]}
          onClick={() => {
            if (!state?.solved?.[i] && !state?.open?.[i]) {
              dispatch({ type: 'OPEN', payload: { index: i, value: n } });
            }
          }}
          solved={!!state?.solved?.[i]}
          won={won}
        />
      ))}
    </div>
  );
}

export default App;
