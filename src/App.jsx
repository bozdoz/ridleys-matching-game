/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
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

  const twoOpen = openArr.length === 2;
  const won = Object.keys(solved).length === size * size;
  const { start } = useConfetti();

  const handleClick = React.useCallback((e) => {
    const card = e.target.closest('.card');

    if (!card) {
      return;
    }

    const number = card.getAttribute('data-card');
    const index = card.getAttribute('data-index');

    if (!state?.solved?.[index] && !state?.open?.[index]) {
      dispatch({ type: 'OPEN', payload: { index, value: number } });
    }
  }, []);

  const palm = usePalm();

  React.useEffect(() => {
    if (palm) {
      // automatically win
      dispatch({ type: 'AUTO_WIN' });
    }
  }, [palm]);

  React.useEffect(() => {
    let t;

    if (twoOpen) {
      // set a timeout to unflip?
      t = setTimeout(() => {
        dispatch({ type: 'CLOSE_LAST_TWO' });
      }, 1000);
    }

    return () => {
      clearTimeout(t);
    };
  }, [twoOpen]);

  // eslint-disable-next-line consistent-return
  React.useEffect(() => {
    if (won) {
      return start();
    }
  }, [won]);

  return (
    <>
      <div
        id="cards"
        style={{
          '--cards': SIZE,
        }}
        onClick={handleClick}
      >
        {cards.map((n, i) => (
          <Card
            number={n}
            index={i}
            key={i}
            isOpen={!!state?.open?.[i]}
            // TODO: maybe solved is better with the number as index
            solved={!!state?.solved?.[i]}
            won={won}
            size={size}
          />
        ))}
      </div>
      <div id="action-buttons">
        <button
          type="button"
          onClick={() => {
            dispatch({ type: 'RESTART' });
          }}
        >
          RESTART

        </button>
      </div>
    </>
  );
}

export default App;
