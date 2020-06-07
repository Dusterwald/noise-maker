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

  return (
    <div className="nodeInputWrapper">
      <ul className="nodeInputList">
        {items.map((item, i) => (
          <NodeInputListItem
            onMouseUp={() => onMouseUp(i)}
            key={item.name}
            index={i}
            item={item}
          />
        ))}
      </ul>
    </div>
  );
};
