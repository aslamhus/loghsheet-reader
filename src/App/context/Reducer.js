export const initialState = {
  topNavButtons: [],
};

export const actions = {
  setTopNavButtons: 'setTopNavButtons',
};

export const reducer = (state, action) => {
  switch (action.type) {
    case actions.setTopNavButtons:
      return {
        ...state,
        topNavButtons: action.payload,
      };
  }
};
