/* eslint-disable consistent-return */

import React from 'react';
import JSConfetti from 'js-confetti';

const jsConfetti = new JSConfetti();

const useConfetti = () => {
  const start = () => {
    let cancel = false;

    const repeat = () => {
      if (!cancel) {
        const confetti = () => jsConfetti
          .addConfetti({
            emojis: ['🦀🦀🦀💩🚽🤮🤢'],
          })
          .then(() => {
            if (!cancel) {
              return jsConfetti.addConfetti({
                emojis: ['💩', '🚽'],
              });
            }
          })
          .then(() => {
            if (!cancel) {
              return jsConfetti.addConfetti({
                emojis: ['🤮', '🤢'],
              });
            }
          });

        confetti().then(repeat);
      }
    };

    repeat();

    // return a cancel function
    return () => {
      cancel = true;
    };
  };

  return React.useMemo(() => ({
    start,
  }), []);
};

export default useConfetti;
