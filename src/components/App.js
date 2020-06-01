import React from 'react';
import { Perlin, Billow, Voronoi, RidgedMulti } from 'libnoise-ts/module/generator';
import NodeGraph from './NodeGraph';
import './App.css';

const App = () => {
  const exampleGraph = {
    nodes: [{
      nid: 0, type: 'Perlin', x: 89, y: 82, fields: { in: [], out: [{ name: 'out' }] }, module: new Perlin(0.25, 2.0, 4, 0.5, Math.random() * Number.MAX_SAFE_INTEGER)
    }, {
      nid: 1, type: 'Scale Bias Output', x: 284, y: 82, fields: { in: [{ name: 'in' }], out: [{ name: 'out' }] }
    }, {
      nid: 2, type: 'Billow', x: 486, y: 188, fields: { in: [], out: [{ name: 'out' }] }, module: new Billow(0.02, 2.0, 4, 0.5, Math.random() * Number.MAX_SAFE_INTEGER)
    }, {
      nid: 3, type: 'Voronoi', x: 686, y: 188, fields: { in: [], out: [{ name: 'out' }] }, module: new Voronoi(0.05, 1.0, false, Math.random() * Number.MAX_SAFE_INTEGER)
    }, {
      nid: 4, type: 'RidgedMulti', x: 686, y: 288, fields: { in: [], out: [{ name: 'out' }] }, module: new RidgedMulti(0.02, 2.0, 4, Math.random() * Number.MAX_SAFE_INTEGER)
    }],
    connections: [{
      from_node: 0, from: 'out', to_node: 1, to: 'in'
    }]
  };

  /* const exampleGraph = {
    nodes: [{
      nid: 0, type: 'Perlin', x: 289, y: 82, fields: { in: [], out: [{ name: 'out' }] }, module: new Perlin(0.25, 2.0, 4, 0.5, Math.random() * Number.MAX_SAFE_INTEGER)
    }],
    connections: []
  }; */

  /* const onNodeMove = (nid, pos) => {};
  const onNodeStartMove = (nid) => {};
  const onNewConnector = (n1, o, n2, i) => {};
  const onRemoveConnector = (connector) => {}; */

  return (
    <div className="App">
      <NodeGraph
        data={exampleGraph}
        /* onNodeMove={(nid, pos) => onNodeMove(nid, pos)}
        onNodeStartMove={(nid) => onNodeStartMove(nid)}
        onNewConnector={(n1, o, n2, i) => onNewConnector(n1, o, n2, i)}
        onRemoveConnector={(connector) => onRemoveConnector(connector)} */
      />
    </div>
  );
};

export default App;
