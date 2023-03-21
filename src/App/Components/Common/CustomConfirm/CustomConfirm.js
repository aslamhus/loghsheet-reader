import React from 'react';
import { createPortal } from 'react-dom';
import CustomModal from '../CustomModal/CustomModal';
import useConfirm from './useConfirm';
import './custom-confirm.css';

export default function CustomConfirm({ className }) {
  const { onConfirm, onCancel, confirmState } = useConfirm();

  const Component = confirmState.show && (
    <CustomModal
      show={true}
      className={`custom-confirm ${className || ''}`}
      overlay
      overlayClickClosesModal
      dismissible={false}
      onDismiss={onCancel}
      variant="auto"
    >
      <CustomModal.Header>
        <strong>{confirmState?.title}</strong>
      </CustomModal.Header>
      <CustomModal.Body>
        {confirmState?.options?.body && <p>{confirmState?.options?.body}</p>}
        <div className="custom-confirm-buttons-container">
          <button id="cc-btn-cancel" onClick={onCancel}>
            {confirmState?.options?.cancelValue || 'Cancel'}
          </button>
          <button id="cc-btn-confirm" onClick={onConfirm}>
            {confirmState?.options?.confirmValue || 'Confirm'}
          </button>
        </div>
      </CustomModal.Body>
    </CustomModal>
  );

  return createPortal(Component, document.body);
}
