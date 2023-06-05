/* eslint-disable no-restricted-syntax */
import React from 'react';

const usePalm = () => {
  const [palmDown, setPalmDown] = React.useState(false);
  const [isPalm, setIsPalm] = React.useState(false);

  const handleTouch = React.useCallback((e) => {
    const touches = Array.from(e.touches);

    const avgRadius = touches.reduce((prev, cur) => prev + cur.radiusX, 0) / touches.length;

    // if 3 or more touch points and the average touch point
    // is greater than 50 pixels
    if (touches.length >= 3 && avgRadius >= 50) {
      setPalmDown(true);
    }
  }, []);

  const handleTouchEnd = React.useCallback(() => {
    if (palmDown) {
      setIsPalm(true);
    }
  }, [palmDown]);

  React.useEffect(() => {
    document.addEventListener('touchstart', handleTouch);
    document.addEventListener('touchend', handleTouchEnd);

    return () => {
      document.removeEventListener('touchstart', handleTouch);
      document.removeEventListener('touchend', handleTouchEnd);
    };
  }, [palmDown]);

  return isPalm;
};

export default usePalm;
