export default function astar(grid, start, end) {
    const openList = [];
    const closedList = [];
  
    start.g = 0;
    start.h = heuristic(start, end);
    start.f = start.g + start.h;
  
    openList.push(start);
  
    while (openList.length > 0) {
      // Find the node with the lowest f value
      let current = openList[0];
      let currentIndex = 0;
      for (let i = 1; i < openList.length; i++) {
        if (openList[i].f < current.f) {
          current = openList[i];
          currentIndex = i;
        }
      }
  
      // Remove current from open list and add to closed list
      openList.splice(currentIndex, 1);
      closedList.push(current);
  
      // If found the end node
      if (current.x === end.x && current.y === end.y) {
        return reconstructPath(current);
      }
  
      const neighbors = getNeighbors(grid, current);
  
      for (const neighbor of neighbors) {
        if (closedList.some(node => node.x === neighbor.x && node.y === neighbor.y)) {
          continue;
        }
  
        const gCost = current.g + 1; // Assuming each step cost 1
  
        if (!openList.some(node => node.x === neighbor.x && node.y === neighbor.y) || gCost < neighbor.g) {
          neighbor.g = gCost;
          neighbor.h = heuristic(neighbor, end);
          neighbor.f = neighbor.g + neighbor.h;
          neighbor.parent = current;
  
          if (!openList.some(node => node.x === neighbor.x && node.y === neighbor.y)) {
            openList.push(neighbor);
          }
        }
      }
    }
  
    return null; // No path found
  }
  
  function heuristic(node1, node2) {
    // Manhattan distance
    return Math.abs(node1.x - node2.x) + Math.abs(node1.y - node2.y);
  }
  
  function getNeighbors(grid, node) {
    const neighbors = [];
    const x = node.x;
    const y = node.y;
  
    // Check adjacent cells (up, down, left, right)
    const possibleNeighbors = [
      {dx: 0, dy: 1},
      {dx: 0, dy: -1},
      {dx: 1, dy: 0},
      {dx: -1, dy: 0},
    ];
  
    for(const diff of possibleNeighbors) {
        const nx = x + diff.dx;
        const ny = y + diff.dy;
        if (nx >= 0 && nx < grid.length && ny >= 0 && ny < grid[0].length && grid[nx][ny] === 0) {
            neighbors.push({x:nx, y:ny});
        }
    }
    return neighbors;
  }
  
  
  function reconstructPath(node) {
    const path = [];
    let current = node;
    while (current) {
      path.unshift({ x: current.x, y: current.y });
      current = current.parent;
    }
    return path;
  }
  
  // Example usage
  const grid = [
    [0, 0, 0, 0, 0],
    [0, 1, 1, 1, 0],
    [0, 0, 0, 0, 0],
    [0, 1, 1, 1, 0],
    [0, 0, 0, 0, 0],
  ];
  
  const start = { x: 0, y: 0 };
  const end = { x: 4, y: 4 };
  
  const path = astar(grid, start, end);
  
  if (path) {
    console.log("Path found:", path);
  } else {
    console.log("No path found.");
  }
  