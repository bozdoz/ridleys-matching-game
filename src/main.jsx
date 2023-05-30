/* eslint-disable react/no-array-index-key */
/* eslint-disable react/prop-types */
/* eslint-disable consistent-return */
import JSConfetti from 'js-confetti';
import React from 'react';
import ReactDOM from 'react-dom/client';

const jsConfetti = new JSConfetti();

// width / height (needs to be even number)
const size = 4;

let won = false;

const confetti = () => jsConfetti
  .addConfetti({
    emojis: ['🦀🦀🦀💩🚽🤮🤢'],
  })
  .then(() => {
    if (won) {
      return jsConfetti.addConfetti({
        emojis: ['💩', '🚽'],
      });
    }
  })
  .then(() => {
    if (won) {
      return jsConfetti.addConfetti({
        emojis: ['🤮', '🤢'],
      });
    }
  });

const repeatConfetti = () => {
  if (won) {
    setTimeout(() => confetti().then(repeatConfetti), 0);
  }
};

const initialState = {
  open: {},
  openArr: [],
  solved: {},
};

const reducer = (state, action) => {
  switch (action.type) {
    case 'CLOSE_LAST_TWO':
      // eslint-disable-next-line no-case-declarations
      const [first, second] = state.openArr;
      // eslint-disable-next-line no-case-declarations
      const open = {
        ...state.open,
      };

      delete open[first.index];
      delete open[second.index];

      return {
        ...state,
        open,
        openArr: state.openArr.slice(2),
      };
    case 'OPEN':
      state.openArr.push(action.payload);
      // check if last two match:
      if (state.openArr.length % 2 === 0) {
        const lastCard = state.openArr[state.openArr.length - 2];
        if (lastCard.value === action.payload.value) {
          // match!
          // eslint-disable-next-line no-param-reassign
          state = {
            ...state,
            solved: {
              ...state.solved,
              [action.payload.index]: true,
              [lastCard.index]: true,
            },
          };
        }
      }

      return {
        ...state,
        open: {
          ...state.open,
          [action.payload.index]: true,
        },
      };
    default:
      return state;
  }
};

function Card({
  number = 0,
  isOpen = false,
  onClick,
  solved = false,
  index = 0,
}) {
  let display = number;

  if (won) {
    switch (true) {
      case index % size === 0:
        display = '🦞';
        break;
      case index % size === 1:
        display = '🦀';
        break;
      case index % size === 2:
        display = '💩';
        break;
      case index % size === 3:
        display = '🚽';
        break;
      default:
        display = '🤷‍♀️';
    }
  }

  return (
    <div
      className="card"
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={onClick}
      data-open={isOpen}
      data-solved={solved}
    >
      <div className="card-inner">
        <div className="card-front" />
        <div className="card-back">{display}</div>
      </div>
    </div>
  );
}

function App() {
  const [state, dispatch] = React.useReducer(reducer, initialState);
  const all = React.useMemo(() => {
    const numbers = Array.from({ length: (size * size) / 2 }).map((_, i) => i + 1);

    return numbers.concat(numbers).sort(() => (Math.random() > 0.5 ? -1 : 1));
  }, []);
  const twoOpen = state.openArr.length > 1 && state.openArr.length % 2 === 0;
  const allSolved = Object.keys(state.solved).length === size * size;

  React.useEffect(() => {
    if (twoOpen) {
      // flip, but set a timeout to unflip?
      setTimeout(() => {
        dispatch({ type: 'CLOSE_LAST_TWO' });
      }, 1500);
    }
  }, [twoOpen]);

  React.useEffect(() => {
    won = allSolved;

    if (won) {
      repeatConfetti();
    }
  }, [allSolved]);

  return (
    <div
      id="cards"
      style={{
        '--cards': size,
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
        />
      ))}
    </div>
  );
}

const domNode = document.getElementById('app');
const root = ReactDOM.createRoot(domNode);

root.render(<App />);

// service worker
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js').then((registration) => {
      // Registration was successful
      console.log('ServiceWorker registration successful with scope: ', registration.scope);
    }, (err) => {
      // registration failed :(
      console.log('ServiceWorker registration failed: ', err);
    });
  });
}
