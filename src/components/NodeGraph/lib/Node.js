import React, { useState, useRef, useEffect } from 'react';
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
  connections,
  title,
  module,
  type
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

  const hasImageModule = typeof module?.getValue === 'function';
  const canvasRef = useRef(null);

  useEffect(() => {
    if (canvasRef && hasImageModule) {
      const ctx = canvasRef.current.getContext('2d');

      const arr = new Uint8ClampedArray(128 * 128 * 4);

      for (let x = 0; x < 128; x++) {
        for (let y = 0; y < 128; y++) {
          const i = ((y * 128) + x) * 4;
          const v = ((module.getValue(x, y, 0) + 1.0) / 2.0) * 255;
          arr[i] = v;
          arr[i + 1] = v;
          arr[i + 2] = v;
          arr[i + 3] = 255;
        }
      }

      const imageData = new ImageData(arr, 128, 128);
      ctx.putImageData(imageData, 0, 0);
    }
  }, [hasImageModule, module]);

  // console.log(connections);
  const cons = connections.filter((c) => c.to_node === nid);
  const processedInputs = inputs.map((i) => {
    // Find if any inputs match this one:
    if (cons.some((c) => c.to === i.name)) {
      return {
        ...i,
        connected: true
      };
    }

    return i;
  });

  const consOut = connections.filter((c) => c.from_node === nid);
  const processedOutputs = outputs.map((i) => {
    // Find if any outputs match this one:
    if (consOut.some((c) => c.from === i.name)) {
      return {
        ...i,
        connected: true
      };
    }

    return i;
  });

  const headerClass = `node-header node-header-${type}`;

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
          <header className={headerClass}>
            <span className="node-title">{title}</span>
          </header>
          <div className="node-content">
            <NodeInputList
              items={processedInputs}
              onCompleteConnector={(idx) => handleOnCompleteConnector(idx)}
            />
            <NodeOutputList
              items={processedOutputs}
              onStartConnector={(idx) => handleOnStartConnector(idx)}
            />
          </div>
          {hasImageModule && (
            <div>
              <canvas width="128" height="128" ref={canvasRef} />
            </div>
          )}
        </section>
      </Draggable>
    </div>
  );
};

export default Node;
