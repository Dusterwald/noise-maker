import React from 'react';
import NodeGraph from './components/NodeGraph';
import './App.css';

function App() {
  const exampleGraph = {
    nodes: [
      {
        nid: 0, type: 'Timer', x: 89, y: 82, fields: { in: [{ name: 'reset' }, { name: 'pause' }, { name: 'max' }], out: [{ name: 'out' }] }
      },
      {
        nid: 1, type: 'MathMult', x: 284, y: 82, fields: { in: [{ name: 'in' }, { name: 'factor' }], out: [{ name: 'out' }] }
      },
      {
        nid: 2, type: 'Vector3', x: 486, y: 188, fields: { in: [{ name: 'xyz' }, { name: 'x' }, { name: 'y' }, { name: 'z' }], out: [{ name: 'xyz' }, { name: 'x' }, { name: 'y' }, { name: 'z' }] }
      }
    ],
    connections: [
      {
        from_node: 0, from: 'field_name', to_node: 1, to: 'field_name'
      }
    ]
  };

  const onNodeMove = (nid, pos) => {};
  const onNodeStartMove = (nid) => {};
  const onNewConnector = (n1, o, n2, i) => {};
  const onRemoveConnector = (connector) => {};

  return (
    <div className="App">
      <header className="App-header">
        <NodeGraph
          data={exampleGraph}
          onNodeMove={(nid, pos) => onNodeMove(nid, pos)}
          onNodeStartMove={(nid) => onNodeStartMove(nid)}
          onNewConnector={(n1, o, n2, i) => onNewConnector(n1, o, n2, i)}
          onRemoveConnector={(connector) => onRemoveConnector(connector)}
        />
      </header>
    </div>
  );
}

export default App;
