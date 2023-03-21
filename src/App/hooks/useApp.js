import { useContext } from 'react';
import { AppContext } from '../context/context';
import { actions } from '../context/Reducer';

export const useApp = () => {
  const [state, dispatch] = useContext(AppContext);
  const { topNavButtons, customAlert } = state;

  /**
   * Set the top navigation buttons
   *
   * @param {Array<React.Component>} buttons - array of ReactComponents
   * @returns
   */
  const setTopNavButtons = (buttons) =>
    dispatch({ type: actions.setTopNavButtons, payload: buttons });

  const setAlert = (alert = { variant, content, onDismiss }) =>
    dispatch({ type: actions.setCustomAlert, payload: alert });

  return {
    setTopNavButtons,
    setAlert,
    state: { topNavButtons, customAlert },
  };
};
