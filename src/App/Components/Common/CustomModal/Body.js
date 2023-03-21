import React from 'react';

const Body = ({ children, style, className }) => {
  return (
    <div
      style={{ ...style }}
      className={`custom-modal-body
      ${className ? className : ''}`}
    >
      {children}
    </div>
  );
};

export default Body;
