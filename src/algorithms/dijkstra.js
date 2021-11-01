// Performs Dijkstra's algorithm; returns *all* nodes in the order
// in which they were visited. Also makes nodes point back to their
// previous node, effectively allowing us to compute the shortest path
// by backtracking from the finish node.
export function dijkstra(grid, startNode, finishNode) {
  const visitedNodesInOrder = [];
  startNode.distance = 0;
  const unvisitedNodes = getAllNodes(grid);
  while (!!unvisitedNodes.length) {
    sortNodesByDistance(unvisitedNodes);
    const closestNode = unvisitedNodes.shift();
    if (closestNode.isWall) continue;
    if (closestNode.distance === Infinity) return visitedNodesInOrder;
    closestNode.isVisited = true;
    visitedNodesInOrder.push(closestNode);
    if (closestNode === finishNode) return visitedNodesInOrder;
    updateUnvisitedNeighbors(closestNode, grid);
  }
}

function sortNodesByDistance(unvisitedNodes) {
  unvisitedNodes.sort((nodeA, nodeB) => nodeA.distance - nodeB.distance);
}

function updateUnvisitedNeighbors(node, grid) {
  const unvisitedNeighbors = getUnvisitedNeighbors(node, grid);
  const {col, row} = node;
  for (const neighbor of unvisitedNeighbors) {
    if (neighbor.row == row + 1 && neighbor.col == col + 1) {
      if (neighbor.distance == Infinity) {
        neighbor.distance = node.distance + 1;
        neighbor.previousNode = node;
      }
    }
    else if (neighbor.row == row - 1 && neighbor.col == col - 1) {
      if (neighbor.distance == Infinity) {
        neighbor.distance = node.distance + 1;
        neighbor.previousNode = node;
      }
    }
    else if (neighbor.row == row + 1 && neighbor.col == col - 1) {
      if (neighbor.distance == Infinity) {
        neighbor.distance = node.distance + 1;
        neighbor.previousNode = node;
      }
    }
    else if (neighbor.row == row - 1 && neighbor.col == col + 1) {
      if (neighbor.distance == Infinity) {
        neighbor.distance = node.distance + 1;
        neighbor.previousNode = node;
    }
    } else {
      if (neighbor.distance == Infinity) {
        neighbor.distance = node.distance + 0.5;
        neighbor.previousNode = node;
      }
    }
  }
}

function getUnvisitedNeighbors(node, grid) {
  const neighbors = [];
  const {col, row} = node;
  if (row > 0) neighbors.push(grid[row - 1][col]);
  if (col < grid[0].length - 1) neighbors.push(grid[row][col + 1]);
  if (row < grid.length - 1) neighbors.push(grid[row + 1][col]);
  if (col > 0) neighbors.push(grid[row][col - 1]);
  
  if (row > 0 && col > 0) neighbors.push(grid[row - 1][col - 1]);
  if (col > 0 && row < grid.length - 1) neighbors.push(grid[row + 1][col - 1]);
  if (col < grid[0].length - 1 && row > 0) neighbors.push(grid[row - 1][col + 1]);
  if (row < grid.length - 1 && col < grid.length - 1) neighbors.push(grid[row + 1][col + 1]);
  
  return neighbors.filter(neighbor => !neighbor.isVisited);
}

function getAllNodes(grid) {
  const nodes = [];
  for (const row of grid) {
    for (const node of row) {
      nodes.push(node);
    }
  }
  return nodes;
}

export function getNodesInShortestPathOrder(finishNode) {
  const nodesInShortestPathOrder = [];
  let currentNode = finishNode;
  while (currentNode !== null) {
    nodesInShortestPathOrder.unshift(currentNode);
    currentNode = currentNode.previousNode;
  }
  return nodesInShortestPathOrder;
}
