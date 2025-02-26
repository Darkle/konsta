import { useRef, useEffect, useContext } from 'react';
import { KonstaContext } from './KonstaContext.js';
import { TouchRipple } from '../../shared/touch-ripple-class.js';

export const useTouchRipple = (elRef, needsTouchRipple) => {
  const context = useContext(KonstaContext);

  const ripple = useRef(null);
  const removeRipple = () => {
    if (ripple.current) ripple.current.remove();
    ripple.current = null;
  };

  const onPointerDown = (e) => {
    ripple.current = new TouchRipple(elRef.current, e.pageX, e.pageY);
  };
  const onPointerMove = () => {
    removeRipple();
  };
  const onPointerUp = () => {
    removeRipple();
  };

  const attachEvents = () => {
    if (!context.touchRipple) return;

    const el = elRef.current;
    el.addEventListener('pointerdown', onPointerDown);
    el.addEventListener('pointermove', onPointerMove);
    el.addEventListener('pointerup', onPointerUp);
  };
  const detachEvents = () => {
    const el = elRef.current;
    el.removeEventListener('pointerdown', onPointerDown);
    el.removeEventListener('pointermove', onPointerMove);
    el.removeEventListener('pointerup', onPointerUp);
  };
  const onMounted = () => {
    if (!elRef || !elRef.current || !needsTouchRipple) return;
    attachEvents();
  };
  const onDestroy = () => {
    if (!elRef || !elRef.current || !needsTouchRipple) return;
    detachEvents();
  };

  useEffect(() => {
    onMounted();
    return () => onDestroy();
  });
};
