import React from 'react';

export const NodeOutputListItem = ({
  onMouseDown,
  index,
  item
}) => {
  const handleOnMouseDown = (e) => {
    e.stopPropagation();
    e.preventDefault();

    onMouseDown(index);
  };

  const noop = (e) => {
    e.stopPropagation();
    e.preventDefault();
  };

  // eslint-disable-next-line no-nested-ternary
  const cls = item.connected ? 'fa fa-circle' : 'fa fa-circle-o';

  return (
    // eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions
    <li onMouseDown={handleOnMouseDown}>
      <button type="button" onClick={noop}>
        { item.name }
        <i className={cls} />
      </button>
    </li>
  );
};
