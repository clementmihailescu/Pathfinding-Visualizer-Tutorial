import React from 'react';
import { useState, useEffect } from 'react';
import {dijkstra, getNodesInShortestPathOrder} from '../algorithms/dijkstra';
import './PathfindingVisualizer.css';

const START_NODE_ROW = 5;
const START_NODE_COL = 5;
const FINISH_NODE_ROW = 15;
const FINISH_NODE_COL = 20;
const SIZE_ROW = 30;
const SIZE_COLUMN = 30;

const PathfindingVisualizer = () => {

  const [ mouseIsPressed, setMousePressed ] = useState(false)
  const [ grid, setGrid ] = useState([])

  useEffect(() => {
    const grid = getInitialGrid();
    setGrid(grid);
  }, [])
  
  function handleMouseDown(row, col) {
    const newGrid = getNewGridWithWallToggled(grid, row, col);
    setMousePressed(true)
    setGrid(newGrid)
  }

  function handleMouseEnter(row, col) {
    if (!mouseIsPressed) return;
    const newGrid = getNewGridWithWallToggled(grid, row, col);
    setGrid(newGrid);
  }

  function handleMouseUp() {
    setMousePressed(false);
  }

  function animateDijkstra(visitedNodesInOrder, nodesInShortestPathOrder) {
    for (let i = 0; i <= visitedNodesInOrder.length; i++) {
      if (i === visitedNodesInOrder.length) {
        setTimeout(() => {
          animateShortestPath(nodesInShortestPathOrder);
        }, 10 * i);
        return;
      }
      setTimeout(() => {
        const node = visitedNodesInOrder[i];
        document.getElementById(`node-${node.row}-${node.col}`).className =
          'node node-visited';
      }, 10 * i);
    }
  }

  function animateShortestPath(nodesInShortestPathOrder) {
    for (let i = 0; i < nodesInShortestPathOrder.length; i++) {
      setTimeout(() => {
        const node = nodesInShortestPathOrder[i];
        document.getElementById(`node-${node.row}-${node.col}`).className =
          'node node-shortest-path';
      }, 50 * i);
    }
  }

  function visualizeDijkstra() {
    const startNode = grid[START_NODE_ROW][START_NODE_COL];
    const finishNode = grid[FINISH_NODE_ROW][FINISH_NODE_COL];
    const visitedNodesInOrder = dijkstra(grid, startNode, finishNode);
    const nodesInShortestPathOrder = getNodesInShortestPathOrder(finishNode);
    animateDijkstra(visitedNodesInOrder, nodesInShortestPathOrder);
  }

  return (
    <>
      <button onClick={visualizeDijkstra}>
        Visualize Dijkstra's Algorithm
      </button>
      <div className="grid">
        {grid.map((row, rowIdx) => {
          return (
            <div key={rowIdx}>
              {row.map((node, index) => {
                const {row, col, isFinish, isStart, isWall} = node;

                const extraClassName = isFinish
                                        ? 'node-finish'
                                        : isStart
                                        ? 'node-start'
                                        : isWall
                                        ? 'node-wall'
                                        : '';
                return (
                  <div
                    key={index}
                    id={`node-${row}-${col}`}
                    className={`node ${extraClassName}`}
                    onMouseDown={() => handleMouseDown(row, col)}
                    onMouseEnter={() => handleMouseEnter(row, col)}
                    onMouseUp={() => handleMouseUp()}
                  >
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
    </>
  );
};

export default PathfindingVisualizer;

const getInitialGrid = () => {
  const grid = [];
  for (let row = 0; row < SIZE_ROW; row++) {
    const currentRow = [];
    for (let col = 0; col < SIZE_COLUMN; col++) {
      currentRow.push(createNode(col, row));
    }
    grid.push(currentRow);
  }
  return grid;
};

const createNode = (col, row) => {
  return {
    col,
    row,
    isStart: row === START_NODE_ROW && col === START_NODE_COL,
    isFinish: row === FINISH_NODE_ROW && col === FINISH_NODE_COL,
    distance: Infinity,
    isVisited: false,
    isWall: false,
    previousNode: null,
  };
};

const getNewGridWithWallToggled = (grid, row, col) => {
  const newGrid = grid.slice();
  const node = newGrid[row][col];
  const newNode = {
    ...node,
    isWall: !node.isWall,
  };
  newGrid[row][col] = newNode;
  return newGrid;
};
