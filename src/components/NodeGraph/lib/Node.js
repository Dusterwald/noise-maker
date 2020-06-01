import React, { useState, useRef } from 'react';
import Draggable from 'react-draggable';
import useOnClickOutside from 'use-onclickoutside';

import { NodeInputList } from './NodeInputList';
import { NodeOutputList } from './NodeOutputList';

const Node = ({
  onNodeDeselect,
  onNodeSelect,
  onNodeStart,
  onNodeStop,
  onNodeMove,
  onStartConnector,
  onCompleteConnector,
  index,
  inputs,
  outputs,
  nid,
  pos,
  title
}) => {
  const [selected, setSelected] = useState(false);

  // useEffect(() => {}, [selected]);

  const handleDragStart = (eve, ui) => {
    onNodeStart(nid, ui);
  };

  const handleDragStop = (eve, ui) => {
    onNodeStop(nid, { x: ui.x, y: ui.y });
  };

  const handleDrag = (eve, ui) => {
    // console.log(ui);
    onNodeMove(index, { x: ui.x, y: ui.y });
  };

  const handleOnStartConnector = (idx) => {
    onStartConnector(nid, idx);
  };

  const handleOnCompleteConnector = (idx) => {
    onCompleteConnector(nid, idx);
  };

  const handleClick = () => {
    setSelected(true);
    if (onNodeSelect) {
      onNodeSelect(nid);
    }
  };

  const handleClickOutside = () => {
    if (onNodeDeselect && selected) {
      onNodeDeselect(nid);
    }
    setSelected(false);
  };

  const ref = useRef(null);
  useOnClickOutside(ref, handleClickOutside);

  const nodeClass = `node ${selected ? ' selected' : ''}`;

  const nodeRef = useRef(null);

  return (
    <div onDoubleClick={(e) => handleClick(e)} ref={ref}>
      <Draggable
        position={{ x: pos.x, y: pos.y }}
        handle=".node-header"
        onStart={(eve, ui) => handleDragStart(eve, ui)}
        onStop={(eve, ui) => handleDragStop(eve, ui)}
        onDrag={(eve, ui) => handleDrag(eve, ui)}
        nodeRef={nodeRef}
      >
        <section className={nodeClass} style={{ zIndex: 10000 }} ref={nodeRef}>
          <header className="node-header">
            <span className="node-title">{title}</span>
          </header>
          <div className="node-content">
            <NodeInputList
              items={inputs}
              onCompleteConnector={(idx) => handleOnCompleteConnector(idx)}
            />
            <NodeOutputList
              items={outputs}
              onStartConnector={(idx) => handleOnStartConnector(idx)}
            />
          </div>
        </section>
      </Draggable>
    </div>
  );
};

export default Node;
