import { useContext } from 'react';
import ConfirmContext from '../CustomConfirm/ConfirmContext';
import { HIDE_CONFIRM, SHOW_CONFIRM } from '../CustomConfirm/Reducer';

let resolveCallback;

export default function useConfirm() {
  const [confirmState, dispatch] = useContext(ConfirmContext);

  const onConfirm = () => {
    closeConfirm();
    resolveCallback(true);
  };

  const onCancel = () => {
    closeConfirm();
    resolveCallback(false);
  };

  const confirm = (title, options = {}) => {
    dispatch({
      type: SHOW_CONFIRM,
      payload: {
        title,
        options,
      },
    });
    return new Promise((resolve, reject) => {
      resolveCallback = resolve;
    });
  };

  const closeConfirm = () => {
    dispatch({
      type: HIDE_CONFIRM,
    });
  };

  return { confirm, onConfirm, onCancel, confirmState };
}
