import { Color } from 'p5/index';
import SearchTemplate from '../search-template';

interface Cell {
  row: number;
  col: number;
  g: number; // Cumulative cost from the start cell
  parent: Cell | null; // Reference to the parent cell for backtracking
}


export default class UCS extends SearchTemplate {
  private openList: Cell[] = [];
  private closedSet: Set<string> = new Set();
  private targetReached: boolean = false;
  private noPath: boolean = false;
  private start: Cell | null = null;
  private end: Cell | null = null;
  private currentPath: Cell[] = [];

  initializeStartEnd(): void {
    for (let i = 0; i < this.c.length; i++) {
      for (let j = 0; j < this.c[0].length; j++) {
        if (this.c[i][j]?.toString() === this.p5.color(0, 255, 0).toString()) {
          this.start = { row: i, col: j, g: 0, parent: null }; // Set parent as null for start cell
        }
        if (this.c[i][j]?.toString() === this.p5.color(255, 0, 0).toString()) {
          this.end = { row: i, col: j, g: 0, parent: null };
        }
      }
    }
  
    if (this.start) {
      this.openList.push(this.start);
      this.markVisited(this.start.row, this.start.col);
      this.currentPath.push(this.start);
    }
  }
  

  run(c: (Color | null)[][]): void {
    super.run(c);
    this.initializeStartEnd();
  }

  getNeighbors(cell: Cell): Cell[] {
    const { row, col, g } = cell;
    const neighbors: Cell[] = [];
  
    const addNeighbor = (newRow: number, newCol: number) => {
      if (
        newRow >= 0 && newRow < this.c.length &&
        newCol >= 0 && newCol < this.c[0].length &&
        !this.visited[newRow][newCol] &&
        this.c[newRow][newCol]?.toString() !== this.p5.color(0, 0, 0).toString()
      ) {
        const neighbor = { row: newRow, col: newCol, g: g + 1, parent: cell }; // Set parent for backtracking
        neighbors.push(neighbor);
      }
    };
  
    addNeighbor(row - 1, col); // Up
    addNeighbor(row + 1, col); // Down
    addNeighbor(row, col - 1); // Left
    addNeighbor(row, col + 1); // Right
  
    return neighbors;
  }
  

  check(): void {
    if (this.openList.length > 0 && !this.targetReached) {
      // Sort open list by cumulative cost (g)
      this.openList.sort((a, b) => a.g - b.g);
      const current = this.openList.shift();

      if (current) {
        this.processCell(current);
      }
    } else if (!this.targetReached) {
      this.noPath = true;
      this.finished = true;
    } else {
      this.finished = true;
    }
  }

  processCell(cell: Cell): void {
    const { row, col } = cell;
  
    if (this.end && row === this.end.row && col === this.end.col) {
      this.targetReached = true;
  
      // Backtrack to create the final optimal path
      let current: Cell | null = cell;
      while (current) {
        this.finalPath.push({ row: current.row, col: current.col });
        current = current.parent; // Move to the parent cell
      }
      this.finalPath.reverse(); // Reverse to get path from start to end
      return;
    }
  
    this.markVisited(row, col);
    this.currentPath.push(cell);
  
    const neighbors = this.getNeighbors(cell);
    for (const neighbor of neighbors) {
      const neighborId = `${neighbor.row}-${neighbor.col}`;
      if (!this.closedSet.has(neighborId)) {
        this.openList.push(neighbor);
        this.markVisited(neighbor.row, neighbor.col);
      }
    }
  }
  

  draw(): void {
    for (const { row, col } of this.currentPath) {
      if (!this.targetReached) {
        this.c[row][col] = this.p5.color(128, 128, 128); // Gray for active path during search
      }
    }
  
    if (this.targetReached) {
      for (const { row, col } of this.finalPath) {
        this.c[row][col] = this.p5.color(0, 0, 255); // Blue for final optimal path
      }
      this.currentPath = []; // Clear current path to avoid gray overlay on final path
    } else if (this.noPath) {
      console.log("No path found.");
    }
  }
  
}
