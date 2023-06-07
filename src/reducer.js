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
  const open = { ...state.open };

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
      if (open[action.payload.index]) {
        // already open
        return state;
      }

      let openArr = [...state.openArr];

      openArr.push(action.payload);

      if (openArr.length === 3) {
        // remove and unset previous open pair
        delete open[openArr[0].index];
        delete open[openArr[1].index];
        openArr = openArr.slice(2);
      }

      open[action.payload.index] = true;

      const newState = {
        ...state,
        open,
        openArr,
      };

      // check if last two match:
      if (openArr.length === 2) {
        const lastCard = openArr[0];
        if (lastCard.value === action.payload.value) {
          // match!
          // eslint-disable-next-line no-param-reassign
          newState.solved = {
            ...state.solved,
            [action.payload.index]: true,
            [lastCard.index]: true,
          };
        }
      }

      return newState;
    default:
      return state;
  }
};

export default reducer;
