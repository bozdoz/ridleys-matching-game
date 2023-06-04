/* eslint-disable react/no-array-index-key */
import React from 'react';
import reducer, { initialState } from './reducer';
import { SIZE } from './config';
import Card from './Card.jsx';
import useConfetti from './useConfetti';
import usePalm from './usePalm';

function App() {
  const [state, dispatch] = React.useReducer(reducer, initialState);

  const {
    size, openArr, solved, cards,
  } = state;

  const twoOpen = openArr.length > 1 && openArr.length % 2 === 0;
  const won = Object.keys(solved).length === size * size;
  const { start } = useConfetti();

  const palm = usePalm();

  React.useEffect(() => {
    if (palm) {
      // automatically win
      dispatch({ type: 'AUTO_WIN' });
    }
  }, [palm]);

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
      {cards.map((n, i) => (
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
          // TODO: maybe solved is better with the number as index
          solved={!!state?.solved?.[i]}
          won={won}
          size={size}
        />
      ))}
    </div>
  );
}

export default App;
