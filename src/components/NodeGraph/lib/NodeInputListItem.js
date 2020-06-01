/* eslint-disable jsx-a11y/mouse-events-have-key-events */
import React, { useState } from 'react';

export const NodeInputListItem = ({
  onMouseUp,
  index,
  item
}) => {
  const [hover, setHover] = useState(false);

  const handleOnMouseUp = (e) => {
    e.stopPropagation();
    e.preventDefault();

    onMouseUp(index);
  };

  const onMouseOver = () => {
    setHover(true);
  };

  const onMouseOut = () => {
    setHover(false);
  };

  const noop = (e) => {
    e.stopPropagation();
    e.preventDefault();
  };

  // eslint-disable-next-line no-nested-ternary
  const cls = item.connected ? (hover ? 'fa fa-circle hover' : 'fa fa-circle') : (hover ? 'fa fa-circle-o hover' : 'fa fa-circle-o');

  return (
    <li>
      <button onClick={noop} onMouseUp={handleOnMouseUp} type="button">
        <i
          className={cls}
          onMouseOver={onMouseOver}
          onMouseOut={onMouseOut}
        />
        { item.name }
      </button>
    </li>
  );
};
