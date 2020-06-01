import React, { useState, useRef } from 'react';
import { computeOutOffsetByIndex, computeInOffsetByIndex } from './lib/util';
import Spline from './lib/Spline';
import DragNode from './lib/Node';
import './node.css';

const NodeGraph = ({
  data,
  onNodeDeselect,
  onNodeMove,
  onNodeStartMove,
  onNodeSelect,
  onNewConnector,
  onRemoveConnector
}) => {
  const [dataS, setDataS] = useState(data);
  const [source, setSource] = useState([]);
  const [dragging, setDragging] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const svgRef = useRef();

  const onMouseMove = e => {
    const [pX, pY] = [e.clientX, e.clientY];
    e.stopPropagation();
    e.preventDefault();

    const svgRect = svgRef.current.getBoundingClientRect();
    // console.log(svgRect);
    setMousePos((old) => ({
      ...old,
      ...{ x: pX - svgRect.left, y: pY - svgRect.top }
    }));
  };

  const onMouseUp = () => {
    setDragging(false);
  };

  const handleNodeStart = (nid) => {
    // eslint-disable-next-line no-unused-expressions
    onNodeStartMove?.(nid);
  };

  const handleNodeStop = (nid, pos) => {
    // eslint-disable-next-line no-unused-expressions
    onNodeMove?.(nid, pos);
  };

  const handleNodeMove = (idx, pos) => {
    const dataT = dataS;
    dataT.nodes[idx].x = pos.x;
    dataT.nodes[idx].y = pos.y;

    // console.log(dataT);
    // console.log({...dataS,...dataT});
    setDataS((old) => ({
      ...old,
      ...dataT
    }));
  };

  const handleStartConnector = (nid, outputIdx) => {
    let newSrc = [nid, outputIdx];

    setDragging(true);
    setSource(newSrc); // Not sure if this will work...
  };

  const handleCompleteConnector = (nid, inputIdx) => {
    if (dragging) {
      const fromNode = getNodeById(data.nodes, source[0]);
      const fromPinName = fromNode.fields.out[source[1]].name;
      const toNode = getNodeById(data.nodes, nid);
      const toPinName = toNode.fields.in[inputIdx].name;

      // eslint-disable-next-line no-unused-expressions
      onNewConnector?.(fromNode.nid, fromPinName, toNode.nid, toPinName);
    }
    setDragging(false);
  };

  const handleRemoveConnector = (connector) => {
    // eslint-disable-next-line no-unused-expressions
    onRemoveConnector?.(connector);
  };

  const handleNodeSelect = (nid) => {
    // eslint-disable-next-line no-unused-expressions
    onNodeSelect?.(nid);
  };

  const handleNodeDeselect = (nid) => {
    // eslint-disable-next-line no-unused-expressions
    onNodeDeselect?.(nid);
  };

  const computePinIdxfromLabel = (pins, pinLabel) => {
    let reval = 0;

    for (let pin of pins) {
      if (pin.name === pinLabel) {
        return reval;
      }
      reval++;
    }

    return reval;
  };

  const getNodeById = (nodes, nid) => {
    let reval = 0;

    for(const node of nodes) {
      if (node.nid === nid) {
        return nodes[reval];
      }
      reval++;
    }

    return reval;
  };

  let newConn = null;
  let i = 0;

  // console.log(dragging);
  if (dragging) {
    const sourceNode = getNodeById(dataS.nodes, source[0]);
    const connectorStart = computeOutOffsetByIndex(sourceNode.x, sourceNode.y, source[1]);
    const connectorEnd = {
      x: mousePos.x,
      y: mousePos.y
    };

    // console.log(mousePos);
    newConn = (
      <Spline
        start={connectorStart}
        end={connectorEnd}
      />
    );
  }

  let splineIdx = 0;

  return (
    <div
      className={dragging ? 'dragging' : ''}
      onMouseMove={onMouseMove}
      onMouseUp={onMouseUp}
    >
      {dataS.nodes.map((node) => {
        // console.log(node);
        return (
          <DragNode
            index={i++}
            nid={node.nid}
            title={node.type}
            inputs={node.fields.in}
            outputs={node.fields.out}
            pos={{x: node.x, y: node.y}}
            key={node.nid}

            onNodeStart={(nid) => handleNodeStart(nid)}
            onNodeStop={(nid, pos) => handleNodeStop(nid, pos)}
            onNodeMove={(idx, pos) => handleNodeMove(idx, pos)}

            onStartConnector={(nid, outputIdx) => handleStartConnector(nid, outputIdx)}
            onCompleteConnector={(nid, inputIdx) => handleCompleteConnector(nid, inputIdx)}

            onNodeSelect={(nid) => handleNodeSelect(nid)}
            onNodeDeselect={(nid) => handleNodeDeselect(nid)}
          />
        );
      })}
      <svg
        style={{
          position: 'absolute',
          height: '100%',
          width: '100%',
          zIndex: 9000,
          top: 0,
          left: 0
        }}
        ref={svgRef}
      >
        {data.connections.map((connector) => {
          // console.log(data);
          // console.log(connector);
          const fromNode = getNodeById(data.nodes, connector.from_node);
          const toNode = getNodeById(data.nodes, connector.to_node);

          const splinestart = computeOutOffsetByIndex(fromNode.x, fromNode.y, computePinIdxfromLabel(fromNode.fields.out, connector.from));
          const splineend = computeInOffsetByIndex(toNode.x, toNode.y, computePinIdxfromLabel(toNode.fields.in, connector.to));

          return (
            <Spline
              start={splinestart}
              end={splineend}
              key={splineIdx++}
              mousePos={mousePos}
              onRemove={() => handleRemoveConnector(connector)}
            />
          );
        })}
        {newConn}
      </svg>
    </div>
  );
};

export default NodeGraph;
