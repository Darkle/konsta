import React, { useRef, useImperativeHandle, forwardRef } from 'react';
import { useTheme } from '../shared/use-theme.js';
import { useThemeClasses } from '../shared/use-theme-classes.js';
import { useTouchRipple } from '../shared/use-touch-ripple.js';
import { FabClasses } from '../../shared/classes/FabClasses.js';

const Fab = forwardRef((props, ref) => {
  const {
    component = 'a',
    className,
    colors: colorsProp,

    href,
    text,
    textPosition = 'after',
    icon,

    ios,
    material,

    touchRipple = true,

    // Children
    children,

    // Rest
    ...rest
  } = props;

  const rippleElRef = useRef(null);

  useImperativeHandle(ref, () => ({
    el: rippleElRef.current,
  }));

  const Component = component;

  const attrs = {
    ...rest,
  };

  const theme = useTheme({ ios, material });
  const themeClasses = useThemeClasses({ ios, material });

  useTouchRipple(rippleElRef, theme === 'material' && touchRipple);

  const colors = {
    bg: 'bg-primary',
    activeBg: 'active:bg-primary-dark',
    text: 'text-white',
    ...colorsProp,
  };

  const c = themeClasses(FabClasses(props, colors), className);

  return (
    <Component
      className={text ? c.base.withText : c.base.iconOnly}
      href={href}
      ref={rippleElRef}
      {...attrs}
    >
      {text && textPosition === 'before' && (
        <span className={c.text}>{text}</span>
      )}
      {icon && <span className={c.icon}>{icon}</span>}
      {text && textPosition === 'after' && (
        <span className={c.text}>{text}</span>
      )}
      {children}
    </Component>
  );
});

Fab.displayName = 'Fab';

export default Fab;
