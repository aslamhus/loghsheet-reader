import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import Header from './Header';
import Body from './Body';
import findByType from './utils';
import PropTypes from 'prop-types';
import { getPrefersColorScheme } from './utils';
import './custom-modal.css';

/**
 * Custom Modal
 *
 * @component
 * @example
 * return (
 *  <CustomModal show={show} className="custom-modal-centered">
 *    <CustomModal.Header>My Header</CustomModal.Header>
 *    <CustomModal.Body> .... </CustomModal.Body>
 *   </CustomModal>
 * )
 *
 */

const CustomModal = (props) => {
  const [show, setShow] = useState(props.show);
  const [triggerFadeOut, setTriggerFadeOut] = useState(false);
  const [prefersColorScheme, setPrefersColorScheme] = useState(
    props.variant == 'auto' ? getPrefersColorScheme() : ''
  );
  const [minimize, setMinimize] = useState(props.defaultMinimizeState || false);

  const handleDismiss = () => {
    if (props.fadeOut && !triggerFadeOut) {
      // trigger fade out then dismiss
      setTriggerFadeOut(true);
    } else {
      // dismiss immediately
      dismissCleanup();
    }
  };

  const dismissCleanup = () => {
    if (props?.onDismiss instanceof Function) {
      props.onDismiss();
    }
    setTriggerFadeOut(false);
    setShow(false);
  };

  const clickOutsideModal = (event) => {
    if (event.target.closest('.custom-modal-dialog')) return;

    handleDismiss();
  };

  if (props.variant == 'auto') {
  }

  const renderHeader = () => {
    const header = findByType(props.children, Header);
    const body = findByType(props.children, Body);
    return header.map((child, index) => {
      return (
        <Header
          key="header"
          setShow={setShow}
          minimize={minimize}
          setMinimize={setMinimize}
          className={child.props?.className}
          style={{
            ...child.props?.style,
          }}
          handleDismiss={handleDismiss}
          props={props}
        >
          {child.props.children}
        </Header>
      );
    });
  };

  const renderBody = () => {
    const body = findByType(props.children, Body);
    return body.map((child, index) => {
      return (
        <Body key={`body-index-${index}-${Date.now()}`} setShow={setShow} {...child?.props}>
          {child.props.children}
        </Body>
      );
    });
  };

  /**
   * get the modal class names
   * @returns string
   */
  const getModalClassname = () => {
    let classes = ['custom-modal'];
    if (!show) {
      classes.push('cm-hide');
    }
    if (props.overlay) {
      classes.push('cm-overlay');
    }
    if (props.fadeOut) {
      // fade out also adds css variable property --fade-out-length
      classes.push('cm-fade-out');
    }
    if (minimize) {
      classes.push('cm-minimize');
    }
    if (props.position) {
      classes.push(getPositionClassName(props.position));
    }
    if (props.variant) {
      switch (props.variant) {
        case 'light':
        case 'dark':
          classes.push(`custom-modal-${props.variant}`);
          break;

        default:
        // do nothing
      }
    }

    return classes.join(' ');
  };

  /**
   * Delay after which the modal will fade out and dismiss
   * Sets a css custom property.
   * In combination with the the class 'cm-fade-out'
   * this allows the modal to fade out and dismiss after
   * the value of props.fadeOut (i.e. 300 milliseconds)
   */
  const getFadeOutDelay = () => {
    if (props.fadeOut) {
      return { '--fade-out-duration': `${props?.fadeOut?.duration || 300}ms` };
    }
    return null;
  };

  const getDialogClassname = () => {
    let classes = ['custom-modal-dialog'];
    if (props.className) {
      classes.push(props.className);
    }
    if (props.fullscreen) {
      classes.push('custom-modal-fullscreen');
    }
    classes.push(getEnterAnimationClassName(props.enter));

    return classes.join(' ');
  };

  const getEnterAnimationClassName = (enter) => {
    switch (enter) {
      case 'fade':
        return 'custom-modal-fade';
      case 'up':
        return 'custom-modal-slide-up';
      case 'down':
        return 'custom-modal-slide-down';
      case 'right':
        return 'custom-modal-slide-right';
      case 'left':
        return 'custom-modal-slide-left';
      default:
        return 'custom-modal-fade';
    }
  };

  const getAnimationStyles = () => {
    return {
      '--duration': `${props.enterOptions?.duration || 0.3}s`,
      '--ease': props.enterOptions?.ease || 'ease',
    };
  };

  const getPositionClassName = (position) => {
    switch (position) {
      case 'left':
      case 'center':
      case 'right':
      case 'bottom right':
      case 'bottom center':
      case 'bottom left':
      case 'top left':
      case 'top center':
      case 'top right':
        // returns cm-position-position-name
        return `cm-position-${position.replace(/\s+/, '-')}`;
      default:
        return '';
    }
  };

  useEffect(() => {
    if (props.show != show) {
      setShow(props.show);
    }
  }, [props]);

  /**
   * Click outside modal
   */
  useEffect(() => {
    const clickOutsideClosesModal = props.overlay && props.overlayClickClosesModal;

    if (clickOutsideClosesModal && props.show) {
      document.body.addEventListener('click', clickOutsideModal);
    }
    return () => {
      if (clickOutsideClosesModal) {
        document.body.removeEventListener('click', clickOutsideModal);
      }
    };
  }, [props.show]);

  /**
   * Dismiss timeout
   * fadeOut={{ delay: 2500, duration: 300}}
   *  */
  useEffect(() => {
    if (props.fadeOut && props.show) {
      let dismissTimeout;
      if (!dismissTimeout) {
        /**
         * Wait for user defined time to fade out,
         * then trigger fadeout animation
         */
        dismissTimeout = setTimeout(() => {
          handleDismiss();
        }, props.fadeOut?.delay);
      }

      return () => {
        clearTimeout(dismissTimeout);
      };
    }
  }, [props.show]);

  /**
   * Dismiss with fadeout
   */
  useEffect(() => {
    let animateTimeout;
    if (triggerFadeOut && props.fadeOut) {
      if (!animateTimeout) {
        animateTimeout = setTimeout(dismissCleanup, props.fadeOut?.duration || 300);
      }
    }
    return () => {
      clearTimeout(animateTimeout);
    };
  }, [triggerFadeOut]);

  /**
   * onChange listener for prefers-color-scheme
   * Only for props.variant == 'auto'
   */
  useEffect(() => {
    if (props.variant == 'auto') {
      const changeColorScheme = (event) => {
        const newColorScheme = event.matches ? 'dark' : 'light';
        setPrefersColorScheme(newColorScheme);
      };
      window
        .matchMedia('(prefers-color-scheme: dark)')
        .addEventListener('change', changeColorScheme);

      return () => {
        window
          .matchMedia('(prefers-color-scheme: dark)')
          .removeEventListener('change', changeColorScheme);
      };
    }
  }, []);

  // if (!show) return null;

  return ReactDOM.createPortal(
    /**
     * Custom Modal enclosing div covers whole screen
     * Custom Modal Dialog can be positioned within it
     **/
    <div
      className={`
           ${getModalClassname()}
           ${prefersColorScheme == 'light' ? 'custom-modal-light' : ''}
           ${prefersColorScheme == 'dark' ? 'custom-modal-dark' : ''}
           ${triggerFadeOut ? 'cm-animate-fade-out' : ''}
        `}
      style={{
        ...getFadeOutDelay(),
      }}
    >
      <div
        className={getDialogClassname()}
        style={{
          ...getAnimationStyles(),
        }}
      >
        {renderHeader()}
        {renderBody()}
      </div>
    </div>,
    document.body
  );
};

CustomModal.Header = Header;
CustomModal.Body = Body;

CustomModal.propTypes = {
  /**
   * Show
   */
  show: PropTypes.bool.isRequired,
  /**
   * Class name
   */
  className: PropTypes.string,
  /**
   * dismissible
   */
  dismissible: PropTypes.bool,
  /**
   * onDismiss
   */
  onDismiss: PropTypes.func,
  /**
   * Overlay
   */
  overlay: PropTypes.bool,
  /**
   * FadeOut
   *
   * Fade out length
   */
  fadeOut: PropTypes.shape({ delay: PropTypes.number, duration: PropTypes.number }),
  /**
   * overlayClickClosesModal
   */
  overlayClickClosesModal: PropTypes.bool,
  /**
   * minimize
   */
  minimizable: PropTypes.bool,
  /**
   * defaultMinimizeState
   */
  defaultMinimizeState: PropTypes.bool,
  /**
   * minimizedTitle
   */
  minimizedTitle: PropTypes.string,
  /**
   * onMinimize
   */
  onMinimize: PropTypes.func,
  /**
   * enter
   */
  enter: PropTypes.string,
  /**
   * enterOptions
   */
  enterOptions: PropTypes.object,
  /**
   * position
   */
  position: PropTypes.string,
  /**
   * variant
   * "light","dark","auto"
   * If variant is set to auto, it will use a theme
   * according to css query prefers-color-scheme
   *
   */
  variant: PropTypes.string,
};

CustomModal.defaultProps = {
  show: true,
  className: 'custom-modal-centered',
  dismissible: true,
  onDismiss: null,
  overlay: false,
  overlayClickClosesModal: false,
  minimizable: false,
  defaultMinimizeState: false,
  minimizedTitle: 'Unminimize',
  onMinimize: null,
  enter: 'fade',
  enterOptions: { duration: 0.3, ease: 'ease' },
  position: '',
  variant: 'light',
};

export default CustomModal;
