import React, { useEffect, useRef } from 'react';
import Show from '../Show';
import './preview.css';

const Preview = React.forwardRef((props, ref) => {
  const handleBeforeUnload = (event) => {
    // alert('are you sure you want to exit?');
    // return false;
  };

  useEffect(() => {
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);

  if (!props?.tracks) return null;

  return (
    <div className="preview-container" ref={ref}>
      {/* <h1 className="pdf-ignore">Preview</h1> */}
      <Show {...props} />
    </div>
  );
});

export default Preview;
