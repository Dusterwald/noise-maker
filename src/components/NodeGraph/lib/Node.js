import React, { useState, useRef, useEffect } from 'react';
import Draggable from 'react-draggable';
import useOnClickOutside from 'use-onclickoutside';
import { Perlin } from 'libnoise-ts/module/generator';

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

  const canvasRef = useRef(null);

  useEffect(() => {
    if (canvasRef) {
      const ctx = canvasRef.current.getContext('2d');

      const perlin1 = new Perlin(0.25, 2.0, 4, 0.5, Math.random() * Number.MAX_SAFE_INTEGER);

      const arr = new Uint8ClampedArray(128 * 128 * 4);
      /* for (let i = 0; i < (128 * 128 * 4); i += 4) {
        arr[i + 0] = 255;
        arr[i + 1] = 0;
        arr[i + 2] = 0;
        arr[i + 3] = 255;
      } */
      for (let x = 0; x < 128; x++) {
        for (let y = 0; y < 128; y++) {
          const i = ((y * 128) + x) * 4;
          const v = ((perlin1.getValue(x, y, 0) + 1.0) / 2.0) * 255;
          arr[i] = v;
          arr[i + 1] = v;
          arr[i + 2] = v;
          arr[i + 3] = 255;
        }
      }

      const imageData = new ImageData(arr, 128, 128);
      ctx.putImageData(imageData, 0, 0);
    }
  }, []);

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
          <div>
            <canvas width="128" height="128" ref={canvasRef} />
          </div>
        </section>
      </Draggable>
    </div>
  );
};

export default Node;
