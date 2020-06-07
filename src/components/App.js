import React from 'react';
import {
  Perlin, Billow, Voronoi, RidgedMulti
} from 'libnoise-ts/module/generator';
import NodeGraph from './NodeGraph';
import './App.css';

const App = () => {
  const data = {
    nodes: [{
      nid: 0, name: 'Perlin', type: 'generator', x: 89, y: 82, fields: { in: [], out: [{ name: 'out' }] }, module: new Perlin(0.25, 2.0, 4, 0.5, Math.random() * Number.MAX_SAFE_INTEGER)
    }, {
      nid: 1, name: 'Scale Bias Output', type: 'modifier', x: 284, y: 82, fields: { in: [{ name: 'in' }], out: [{ name: 'out' }] }
    }, {
      nid: 2, name: 'Billow', type: 'generator', x: 486, y: 188, fields: { in: [], out: [{ name: 'out' }] }, module: new Billow(0.02, 2.0, 4, 0.5, Math.random() * Number.MAX_SAFE_INTEGER)
    }, {
      nid: 3, name: 'Voronoi', type: 'generator', x: 686, y: 188, fields: { in: [], out: [{ name: 'out' }] }, module: new Voronoi(0.05, 1.0, false, Math.random() * Number.MAX_SAFE_INTEGER)
    }, {
      nid: 4, name: 'RidgedMulti', type: 'generator', x: 686, y: 288, fields: { in: [], out: [{ name: 'out' }] }, module: new RidgedMulti(0.02, 2.0, 4, Math.random() * Number.MAX_SAFE_INTEGER)
    }],
    connections: []
  };

  return (
    <div className="App">
      <NodeGraph
        data={data}
      />
    </div>
  );
};

export default App;
