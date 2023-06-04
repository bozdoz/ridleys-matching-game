import React from 'react';
import { SIZE } from './config';

function Card({
  onClick,
  number = 0,
  isOpen = false,
  solved = false,
  index = 0,
  won = false,
  size = SIZE,
}) {
  let display = number;

  if (won) {
    switch (true) {
      case index % size === 0:
        display = '🦞';
        break;
      case index % size === 1:
        display = '🦀';
        break;
      case index % size === 2:
        display = '💩';
        break;
      case index % size === 3:
        display = '🚽';
        break;
      default:
        display = '🤷‍♀️';
    }
  }

  return (
    <div
      className="card"
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={onClick}
      data-open={isOpen}
      data-solved={solved}
    >
      <div className="card-inner">
        <div className="card-front" />
        <div className="card-back">{display}</div>
      </div>
    </div>
  );
}

export default Card;
