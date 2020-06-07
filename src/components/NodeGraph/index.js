import React, { useState, useRef } from 'react';
import { Perlin } from 'libnoise-ts/module/generator';
import { ScaleBias } from 'libnoise-ts/module/modifier';
import { computeOutOffsetByIndex, computeInOffsetByIndex } from './lib/util';
import Spline from './lib/Spline';
import Node from './lib/Node';
import './node.css';

const NodeGraph = ({
  data
}) => {
  // const [dataS, setDataS] = useState(data);
  const [nodes, setNodes] = useState(data?.nodes);
  const [connections, setConnections] = useState(data?.connections);
  const [source, setSource] = useState([]);
  const [dragging, setDragging] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [nodeId, setNodeId] = useState(10);

  const svgRef = useRef();

  const computePinIdxfromLabel = (pins, pinLabel) => pins.findIndex((x) => x.name === pinLabel);

  const getNodeById = (n, nid) => n.find((x) => x.nid === nid);

  const addNode = (node) => {
    setNodes([
      ...nodes,
      node
    ]);
  };

  const onMouseMove = (e) => {
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

  const onContextMenu = (e) => {
    e.stopPropagation();
    e.preventDefault();
    console.log('Right click', e.clientX, e.clientY);
    addNode({
      nid: nodeId,
      name: 'Perlin',
      type: 'generator',
      x: e.clientX,
      y: e.clientY,
      fields: { in: [], out: [{ name: 'out' }] },
      module: new Perlin(0.25, 2.0, 4, 0.5, Math.random() * Number.MAX_SAFE_INTEGER)
    });
    setNodeId(nodeId + 1);
  };

  const handleNodeStart = (nid) => {
    // eslint-disable-next-line no-unused-expressions
    // onNodeStartMove?.(nid);
  };

  const handleNodeStop = (nid, pos) => {
    // eslint-disable-next-line no-unused-expressions
    // onNodeMove?.(nid, pos);
  };

  const handleNodeMove = (idx, pos) => {
    /* const dataT = dataS;
    dataT.nodes[idx].x = pos.x;
    dataT.nodes[idx].y = pos.y;

    setDataS((old) => ({
      ...old,
      ...dataT
    })); */
    const mn = nodes[idx];
    mn.x = pos.x;
    mn.y = pos.y;
    setNodes([
      ...nodes.filter((n) => n.nid !== mn.nid),
      mn
    ]);
  };

  const handleStartConnector = (nid, outputIdx) => {
    const newSrc = [nid, outputIdx];

    setDragging(true);
    setSource(newSrc); // Not sure if this will work...
  };

  const handleCompleteConnector = (nid, inputIdx) => {
    if (dragging) {
      const fromNode = getNodeById(nodes, source[0]);
      const fromPinName = fromNode.fields.out[source[1]].name;
      const toNode = getNodeById(nodes, nid);
      //console.log(toNode.fields, inputIdx);
      const toPinName = toNode.fields.in[inputIdx].name;

      // eslint-disable-next-line no-unused-expressions
      // onNewConnector?.(fromNode.nid, fromPinName, toNode.nid, toPinName);

      // Only try to create a connection if it isn't to the same node!
      // Also check that there isn't already a connection going to that node
      if (fromNode.nid !== toNode.nid && !connections.some((c) => c.to_node === toNode.nid && c.to === toPinName)) {
        if (toNode.name === 'Scale Bias Output') {
          const module = new ScaleBias(fromNode.module, 0.5, 0);
          const nNodes = [
            ...nodes.filter((n) => n.nid !== toNode.nid),
            {
              ...toNode,
              module
            }
          ];
          const nConnections = [
            ...connections,
            {
              from_node: fromNode.nid, from: fromPinName, to_node: toNode.nid, to: toPinName
            }
          ];
          setNodes(nNodes);
          setConnections(nConnections);
          console.log(nConnections);
        }
      }
    }
    setDragging(false);
  };

  const handleRemoveConnector = (connector) => {
    // eslint-disable-next-line no-unused-expressions
    // onRemoveConnector?.(connector);
    // console.log(connector);
    setConnections([
      ...connections.filter((c) => c !== connector)
    ]);
  };

  const handleNodeSelect = (nid) => {
    // eslint-disable-next-line no-unused-expressions
    // onNodeSelect?.(nid);
  };

  const handleNodeDeselect = (nid) => {
    // eslint-disable-next-line no-unused-expressions
    // onNodeDeselect?.(nid);
  };

  let newConn = null;
  let i = 0;

  // console.log(dragging);
  if (dragging) {
    // console.log(source);
    const sourceNode = getNodeById(nodes, source[0]);
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
  //console.log(dataS);

  return (
    <div
      className={dragging ? 'dragging' : ''}
      onMouseMove={onMouseMove}
      onMouseUp={onMouseUp}
      onContextMenu={onContextMenu}
    >
      {nodes.map((node) => (
        <Node
          index={i++}
          nid={node.nid}
          title={node.name}
          inputs={node.fields.in}
          outputs={node.fields.out}
          pos={{ x: node.x, y: node.y }}
          key={node.nid}
          connections={connections}
          module={node.module}
          type={node.type}

          onNodeStart={(nid) => handleNodeStart(nid)}
          onNodeStop={(nid, pos) => handleNodeStop(nid, pos)}
          onNodeMove={(idx, pos) => handleNodeMove(idx, pos)}

          onStartConnector={(nid, outputIdx) => handleStartConnector(nid, outputIdx)}
          onCompleteConnector={(nid, inputIdx) => handleCompleteConnector(nid, inputIdx)}

          onNodeSelect={(nid) => handleNodeSelect(nid)}
          onNodeDeselect={(nid) => handleNodeDeselect(nid)}
        />
      ))}
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
        {connections.map((connector) => {
          // console.log(data);
          // console.log(connector);
          const fromNode = getNodeById(nodes, connector.from_node);
          const toNode = getNodeById(nodes, connector.to_node);

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
