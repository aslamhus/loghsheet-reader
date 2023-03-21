export const initialState = {
  topNavButtons: [],
  customAlert: null,
};

export const actions = {
  setTopNavButtons: 'setTopNavButtons',
  setCustomAlert: 'setCustomAlert',
};

export const reducer = (state, action) => {
  switch (action.type) {
    case actions.setTopNavButtons:
      return {
        ...state,
        topNavButtons: action.payload,
      };

    case actions.setCustomAlert:
      return {
        ...state,
        customAlert: action.payload,
      };
  }
};
