import React, { useState } from 'react';

export const NodeInputListItem = ({
  onMouseUp,
  index,
  item
}) => {
  const [hover, setHover] = useState(false);

  const handleOnMouseUp = e => {
    e.stopPropagation();
    e.preventDefault();

    onMouseUp(index);
  }

  const onMouseOver = () => {
    setHover(true);
  }

  const onMouseOut = () => {
    setHover(false);
  }

  const noop = e => {
    e.stopPropagation();
    e.preventDefault();
  }

  return (
    <li>
      <button onClick={noop} onMouseUp={handleOnMouseUp} type="button">
        <i
          className={hover ? 'fa fa-circle-o hover' : 'fa fa-circle-o'}
          onMouseOver={onMouseOver}
          onMouseOut={onMouseOut}
        />
        { item.name }
      </button>
    </li>
  );
}