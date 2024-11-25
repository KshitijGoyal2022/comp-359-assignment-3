import Spot from "./spot";
import * as p5Types from "p5";
import { TerrainTypes, Settings } from "./search-template";

export default class Grid {
  private p5: p5Types;
  private settings: Settings;
  private cols: number;
  private rows: number;
  private w: number;
  private h: number;
  private grid: Spot[][];
  private terrainTypes: TerrainTypes;

  constructor(p5: p5Types, settings: Settings, gridAreaSize: [number, number]) {
    this.p5 = p5;
    this.settings = settings;
    this.cols = settings.cols || 50;
    this.rows = settings.rows || 50;
    this.w = gridAreaSize[0] / this.cols;
    this.h = gridAreaSize[1] / this.rows;
    this.terrainTypes = settings.terrainTypes || this.defaultTerrainTypes();

    this.grid = [];
    this.createGrid();
    this.addNeighbors();
  }

  private defaultTerrainTypes(): TerrainTypes {
    return {
      plain: { color: [255, 255, 255], cost: 1 },
      forest: { color: [34, 139, 34], cost: 5 },
      water: { color: [65, 105, 225], cost: 10 },
      mountain: { color: [139, 137, 137], cost: 20 },
    };
  }

  private createGrid(): void {
    for (let i = 0; i < this.cols; i++) {
      this.grid[i] = new Array(this.rows);
    }
    for (let i = 0; i < this.cols; i++) {
      for (let j = 0; j < this.rows; j++) {
        this.grid[i][j] = new Spot(
          this.p5,
          i,
          j,
          this.w,
          this.h,
          this.terrainTypes,
          this.settings
        );
      }
    }
  }

  private addNeighbors(): void {
    for (let i = 0; i < this.cols; i++) {
      for (let j = 0; j < this.rows; j++) {
        this.grid[i][j].addNeighbors(this.grid);
      }
    }
  }

  public getGrid(): Spot[][] {
    return this.grid;
  }

  public getSpot(i: number, j: number): Spot {
    return this.grid[i][j];
  }

  public getCols(): number {
    return this.cols;
  }

  public getRows(): number {
    return this.rows;
  }

  public getCellWidth(): number {
    return this.w;
  }

  public getCellHeight(): number {
    return this.h;
  }

  public resetGrid(): void {
    for (let i = 0; i < this.cols; i++) {
      for (let j = 0; j < this.rows; j++) {
        this.grid[i][j].reset();
      }
    }
  }

  public getTerrainTypes(): TerrainTypes {
    return this.terrainTypes;
  }
}
