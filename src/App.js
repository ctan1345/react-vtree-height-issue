import React, { useRef } from 'react';
import logo from './logo.svg';
import './App.css';
import { VariableSizeTree as Tree } from 'react-vtree';

const tree = {
  name: 'Root #1',
  id: 'root-1',
  children: [
    {
      children: [
        { id: 'child-2', name: 'Child #2' },
        { id: 'child-3', name: 'Child #3' },
      ],
      id: 'child-1',
      name: 'Child #1',
    },
    {
      children: [{ id: 'child-5', name: 'Child #5' }],
      id: 'child-4',
      name: 'Child #4',
    },
  ],
};

function* treeWalker(refresh) {
  const stack = [];

  stack.push({
    nestingLevel: 0,
    node: tree,
  });

  while (stack.length !== 0) {
    const {
      node: { children = [], id, name },
      nestingLevel,
    } = stack.pop();

    const isOpened = yield refresh
      ? {
        // The only difference VariableSizeTree `treeWalker` has comparing to
        // the FixedSizeTree is the `defaultHeight` property in the data
        // object.
        defaultHeight: children.length === 0 ? 20 : 60,
        id,
        isLeaf: children.length === 0,
        isOpenByDefault: true,
        name,
        nestingLevel,
      }
      : id;

    if (children.length !== 0 && isOpened) {
      for (let i = children.length - 1; i >= 0; i--) {
        stack.push({
          nestingLevel: nestingLevel + 1,
          node: children[i],
        });
      }
    }
  }
}

const Node = ({ data: { isLeaf, name, nestingLevel }, height, isOpen, style, toggle }) => (
  <div className="node" style={{ ...style, paddingLeft: nestingLevel * 20, backgroundColor: isLeaf ? "#eee" : "lightblue" }}>
    {!isLeaf && (
      <button type="button" onClick={toggle}>
        {isOpen ? '-' : '+'}
      </button>
    )}
    <div>{name}</div>
  </div>
)

function App() {
  const ref = useRef(null)
  const handleClick = () => {
    console.log('ff')
    return ref.current.recomputeTree({ opennessState: { 'root-1': true, 'child-1': true } })
  }
  return (
    <div className="App">
      <div>
        <button style={{ marginBottom: "20px" }} onClick={handleClick}>Expand by recomputeTree</button>
        <Tree treeWalker={treeWalker} height={800} width={700} ref={ref}>
          {Node}
        </Tree>
      </div>
    </div>
  );
}

export default App;
