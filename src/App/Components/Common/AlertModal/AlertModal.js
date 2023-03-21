import React from 'react';
import CustomModal from '@components/Common/CustomModal';
import './alert-modal.css';

/**
 * Alert modal
 *
 * Alert Modal variants: 'danger', 'success', warning
 *
 * @component
 *
 */
export default function AlertModal({ content, variant, onDismiss }) {
  const getAlertModalVariantClassname = () => {
    switch (variant) {
      case 'danger':
      case 'success':
      case 'warning':
        return `alert-modal-${variant}`;

      default:
        return '';
    }
  };
  /**
   * To do: Find a way to destroy alert if new content arrives.
   */

  return (
    <CustomModal
      show={content != null}
      onDismiss={onDismiss}
      fadeOut={{ delay: 3500, duration: 500 }}
      overlayClickClosesModal={true}
      className={`alert-modal ${getAlertModalVariantClassname()}`}
      position="bottom right"
      enter="left"
    >
      <CustomModal.Header>
        <p style={{ margin: 0 }}>{content}</p>
      </CustomModal.Header>
    </CustomModal>
  );
}
