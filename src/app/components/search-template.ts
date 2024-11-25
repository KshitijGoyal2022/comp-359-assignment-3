import { SearchInterface } from "./search-interface";
import Spot from "./spot";
import * as p5Types from "p5";
import Grid from "./grid";

export interface TerrainType {
  color: [number, number, number];
  cost: number;
}

export interface TerrainTypes {
  [key: string]: TerrainType;
}

export interface Settings {
  cols: number;
  rows: number;
  wallProbability: number;
  dynamicObstacles: boolean;
  numDynamicObstacles: number;
  terrainTypes?: TerrainTypes;
  terrainThresholds?: {
    plain: number;
    forest: number;
    water: number;
  };
  speed?: number;
}

export default abstract class SearchTemplate implements SearchInterface {
  protected p5: p5Types;
  protected settings: Settings;
  protected cols: number;
  protected rows: number;
  protected grid: Grid;
  protected start: Spot | null;
  protected end: Spot | null;
  protected path: Spot[];
  protected w: number;
  protected h: number;
  protected dynamicObstacles: Spot[];
  protected current: Spot | null;
  protected finished: boolean;

  protected nodesVisited: number;
  protected totalPathCost: number;
  protected terrainCosts: { [key: string]: number };

  protected gridAreaWidth: number;
  protected gridAreaHeight: number;

  protected terrainTypes: TerrainTypes;

  constructor(p5: p5Types, settings: Settings, grid: Grid) {
    this.p5 = p5;
    this.settings = settings;
    this.grid = grid;
    this.cols = grid.getCols();
    this.rows = grid.getRows();
    this.w = grid.getCellWidth();
    this.h = grid.getCellHeight();
    this.start = null;
    this.end = null;
    this.path = [];
    this.dynamicObstacles = [];
    this.current = null;
    this.initialize();
    this.gridAreaWidth = p5.width; // 600 pixels
    this.gridAreaHeight = p5.height; // 600 pixels

    this.nodesVisited = 0;
    this.totalPathCost = 0;
    this.terrainCosts = {
      plain: 0,
      forest: 0,
      water: 0,
      mountain: 0,
    };
    this.finished = false;
    this.terrainTypes = grid.getTerrainTypes();
  }

  public initialize(): void {
    this.setStartEnd();
    this.initDynamicObstacles();
    this.additionalSetup();
  }

  protected abstract additionalSetup(): void;

  protected setStartEnd(): void {
    this.start = this.grid.getSpot(0, 0);
    this.end = this.grid.getSpot(this.cols - 1, this.rows - 1);
    this.start.wall = false;
    this.end.wall = false;
  }

  protected initDynamicObstacles(): void {
    const numDynamicObstacles = this.settings.numDynamicObstacles || 20;
    for (let n = 0; n < numDynamicObstacles; n++) {
      const i = Math.floor(this.p5.random(this.cols));
      const j = Math.floor(this.p5.random(this.rows));
      const obstacle = this.grid.getSpot(i, j);
      if (obstacle !== this.start && obstacle !== this.end && !obstacle.wall) {
        this.dynamicObstacles.push(obstacle);
      }
    }
  }

  public abstract run(): void;

  public setSpeed(speed: number): void {
    this.settings.speed = speed;
  }

  public toggleDynamicObstacles(enable: boolean): void {
    this.settings.dynamicObstacles = enable;
  }

  public handleMousePressed(x: number, y: number): void {
    const i = Math.floor(x / this.w);
    const j = Math.floor(y / this.h);
    if (i >= 0 && i < this.cols && j >= 0 && j < this.rows) {
      const spot = this.grid.getSpot(i, j);
      if (!spot.wall && spot !== this.start && spot !== this.end) {
        spot.wall = true;
      }
    }
  }

  public reset(): void {
    this.grid.resetGrid();
    this.initialize();
    this.resetMetrics();
    this.p5.loop();
  }

  protected resetMetrics(): void {
    this.nodesVisited = 0;
    this.totalPathCost = 0;
    this.terrainCosts = {
      plain: 0,
      forest: 0,
      water: 0,
      mountain: 0,
    };
  }

  protected moveDynamicObstacles(): void {
    for (let obstacle of this.dynamicObstacles) {
      obstacle.wall = false;
      let i = obstacle.i + Math.floor(this.p5.random(-1, 2));
      let j = obstacle.j + Math.floor(this.p5.random(-1, 2));
      i = this.p5.constrain(i, 0, this.cols - 1);
      j = this.p5.constrain(j, 0, this.rows - 1);
      obstacle = this.grid.getSpot(i, j);
      if (obstacle !== this.start && obstacle !== this.end && !obstacle.wall) {
        obstacle.wall = true;
      }
    }
  }

  protected display(): void {
    this.p5.background(0);

    this.p5.push();
    this.p5.translate(0, 0);
    // Draw grid
    for (let i = 0; i < this.cols; i++) {
      for (let j = 0; j < this.rows; j++) {
        const spot = this.grid.getSpot(i, j);
        if (spot.wall) {
          spot.show(this.p5.color(0));
        } else {
          spot.show(this.p5.color(...spot.terrain.color));
        }
      }
    }

    this.drawSets();

    if (this.current) {
      this.path = [];
      let temp = this.current;
      this.path.push(temp);
      while (temp.previous) {
        this.path.push(temp.previous);
        temp = temp.previous;
      }

      this.p5.noFill();
      this.p5.stroke(255, 255, 0);
      this.p5.strokeWeight(this.w / 2);
      this.p5.beginShape();
      for (const spot of this.path) {
        this.p5.vertex(
          spot.i * this.w + this.w / 2,
          spot.j * this.h + this.h / 2
        );
      }
      this.p5.endShape();
    }
  }

  protected abstract drawSets(): void;

  protected calculatePathCosts(): void {
    this.totalPathCost = 0;
    this.terrainCosts = {
      plain: 0,
      forest: 0,
      water: 0,
      mountain: 0,
    };

    if (this.current) {
      let temp = this.current;
      while (temp.previous) {
        const terrainType = this.getTerrainType(temp.terrain);
        const cost = temp.terrain.cost;
        this.totalPathCost += cost;
        this.terrainCosts[terrainType] += cost;
        temp = temp.previous;
      }
    }
  }

  private getTerrainType(terrain: TerrainType): string {
    for (const key in this.terrainTypes) {
      if (
        this.terrainTypes[key].color.toString() === terrain.color.toString() &&
        this.terrainTypes[key].cost === terrain.cost
      ) {
        return key;
      }
    }
    return "unknown";
  }

  public getTotalNodesVisited(): number {
    return this.nodesVisited;
  }
  public getTotalNotesVisitedPercentage(): number {
    const totalBlocks = this.cols * this.rows;
    return (this.nodesVisited / totalBlocks) * 100;
  }
  public getTotalPathCost(): number {
    return this.totalPathCost;
  }

  public getTerrainCosts(): { [key: string]: number } {
    return this.terrainCosts;
  }
  public hasFinished() {
    return this.finished;
  }
}
