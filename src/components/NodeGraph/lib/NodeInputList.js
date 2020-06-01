import React from 'react';

import { NodeInputListItem } from './NodeInputListItem';

export const NodeInputList = ({
  items,
  onCompleteConnector
}) => {
  const onMouseUp = (i) => {
    onCompleteConnector(i);
  };
  // console.log(items);

  let i = 0;
  return (
    <div className="nodeInputWrapper">
      <ul className="nodeInputList">
        {items.map((item) => (
          <NodeInputListItem
            onMouseUp={() => onMouseUp(i)}
            key={i}
            index={i++}
            item={item}
          />
        ))}
      </ul>
    </div>
  );
};
