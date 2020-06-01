import React from 'react';

import { NodeOutputListItem } from './NodeOutputListItem';

export const NodeOutputList = ({
  onStartConnector,
  items
}) => {
  const onMouseDown = (i) => {
    onStartConnector(i);
  };

  return (
    <div className="nodeOutputWrapper">
      <ul className="nodeOutputList">
        {items.map((item, i) => (
          <NodeOutputListItem
            onMouseDown={() => onMouseDown(i)}
            key={item.name}
            index={i}
            item={item}
          />
        ))}
      </ul>
    </div>
  );
};
