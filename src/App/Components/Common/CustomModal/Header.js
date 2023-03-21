import React from 'react';

const Header = ({
  setShow,
  minimize,
  setMinimize,
  className,
  style,
  props,
  handleDismiss,
  children,
}) => {
  const { onDismiss, dismissible, minimizable, minimizedTitle, onMinimize } = props;

  const toggleMinimize = () => {
    setMinimize(!minimize);
    if (onMinimize instanceof Function) {
      onMinimize(!minimize);
    }
  };
  return (
    <div
      className={`
    custom-modal-header
    ${className || ''}`}
      style={{ ...style }}
    >
      <div className="header-container">
        {minimize ? <h3>{minimizedTitle}</h3> : <div>{children}</div>}
      </div>
      <div className="header-btns">
        {minimizable && (
          <button className="minimize-btn custom-modal-btn" onClick={toggleMinimize}>
            {!minimize ? <i className="fas fa-minus"></i> : <i className="fa fa-expand-alt"></i>}
          </button>
        )}
        {dismissible && (
          <button className="close-btn custom-modal-btn" onClick={handleDismiss}>
            <i className="fas fa-times"></i>
          </button>
        )}
      </div>
    </div>
  );
};

export default Header;
