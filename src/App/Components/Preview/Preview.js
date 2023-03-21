import React, { useEffect, useRef } from 'react';
import Show from '../Show';
import { createShow } from '@api/shows';
import { useApp } from '../../hooks/useApp';
import './preview.css';
import useConfirm from '../Common/CustomConfirm/useConfirm';

const Preview = React.forwardRef((props, ref) => {
  const { setTopNavButtons, setAlert } = useApp();
  const { confirm } = useConfirm();
  // const handleBeforeUnload = (event) => {
  //   // alert('are you sure you want to exit?');
  //   // return false;
  // };

  // useEffect(() => {
  //   window.addEventListener('beforeunload', handleBeforeUnload);
  //   return () => {
  //     window.removeEventListener('beforeunload', handleBeforeUnload);
  //   };
  // }, []);

  const handleCreateShow = async (body) => {
    const didSave = await createShow(body);
    console.log('didSave', didSave);
    if (didSave.create == true) {
      setAlert({
        variant: 'info',
        content: 'Your show has been saved.',
        onDismiss: () => {
          setAlert(null);
        },
      });
    } else if ((didSave.error = 'conflict')) {
      // confirm whether you want to replace the show
      // confirm?
      const overwriteConfirm = await confirm('There is already a show for this week', {
        body: 'Would you like you to overwrite the old show?',
      });
      if (overwriteConfirm) {
        const replace = await createShow({ ...body, replace: true });
        console.log('replace', replace);
      }
    } else {
      setAlert({
        variant: 'danger',
        content: 'There was an error saving your show: ' + didSave.error,
        onDismiss: () => setAlert(null),
      });
    }
  };
  if (!props?.tracks) return null;

  return (
    <div className="preview-container" ref={ref}>
      <Show {...props} onSave={handleCreateShow} initialHasMadeChanges={true} />
    </div>
  );
});

export default Preview;
