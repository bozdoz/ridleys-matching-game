/* eslint-disable no-plusplus */
/* eslint-disable no-case-declarations */
import { SIZE } from './config';

const getCards = (size) => {
  const numbers = Array.from({ length: (size * size) / 2 }).map((_, i) => i + 1);

  return numbers.concat(numbers).sort(() => (Math.random() > 0.5 ? -1 : 1));
};

export const initialState = {
  open: {},
  openArr: [],
  solved: {},
  won: false,
  size: SIZE,
  cards: getCards(SIZE),
};

const reducer = (state, action) => {
  switch (action.type) {
    case 'RESTART':
      return {
        ...state,
        open: {},
        openArr: [],
        solved: {},
        won: false,
        cards: getCards(state.size),
      };
    case 'AUTO_WIN':
      // flip everything
      const max = state.size * state.size;
      const solved = { ...state.solved };

      for (let i = 0; i < max; i++) {
        solved[i] = true;
      }

      return {
        ...state,
        solved,
      };
    case 'CLOSE_LAST_TWO':
      const [first, second] = state.openArr;
      const open = {
        ...state.open,
      };

      if (first && second) {
        delete open[first.index];
        delete open[second.index];
      }

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

export default reducer;
