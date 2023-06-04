export const initialState = {
  open: {},
  openArr: [],
  solved: {},
  won: false,
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

export default reducer;
