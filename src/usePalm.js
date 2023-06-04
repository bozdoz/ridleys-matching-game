import React from 'react';

const usePalm = () => {
  const [palmDown, setPalmDown] = React.useState(0);
  const [isPalm, setIsPalm] = React.useState(false);
  const handleTouch = React.useCallback((e) => {
    const touches = e.touches.length;

    if (touches >= 3) {
      setPalmDown(Date.now());
    }
  });

  const handleTouchEnd = React.useCallback((e) => {
    const touches = e.changedTouches.length;

    // need 3+ touches for at least half a second
    if (touches >= 3 && Date.now() - palmDown >= 500) {
      setIsPalm(true);
    } else {
      setPalmDown(0);
    }
  });

  React.useEffect(() => {
    document.addEventListener('touchstart', handleTouch);
    document.addEventListener('touchend', handleTouchEnd);

    return () => {
      document.removeEventListener('touchstart', handleTouch);
      document.removeEventListener('touchend', handleTouchEnd);
    };
  }, []);

  return isPalm;
};

export default usePalm;
