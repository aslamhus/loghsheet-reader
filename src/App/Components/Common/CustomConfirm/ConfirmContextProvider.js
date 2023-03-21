import React, { useReducer } from 'react';
import ConfirmContext from './ConfirmContext';
import { reducer, initialState } from './Reducer';

export default function ConfirmContextProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  return <ConfirmContext.Provider value={[state, dispatch]}>{children}</ConfirmContext.Provider>;
}
