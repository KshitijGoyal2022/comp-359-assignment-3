import { SearchInterface } from "./search-interface";
import Spot from "./spot";
import * as p5Types from "p5";

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
	protected grid: Spot[][];
	protected start: Spot | null;
	protected end: Spot | null;
	protected path: Spot[];
	protected w: number;
	protected h: number;
	protected dynamicObstacles: Spot[];
	protected terrainTypes: TerrainTypes;
	protected current: Spot | null;
	protected finished: boolean;
	protected noSolution: boolean;

	protected nodesVisited: number;
	protected totalPathCost: number;
	protected terrainCosts: { [key: string]: number };

	protected gridAreaWidth: number;
	protected gridAreaHeight: number;

	constructor(p5: p5Types, settings: Settings, gridAreaSize: [number, number]) {
		this.p5 = p5;
		this.settings = settings;
		this.cols = settings.cols || 50;
		this.rows = settings.rows || 50;
		this.grid = [];
		this.start = null;
		this.end = null;
		this.path = [];
		this.w = gridAreaSize[0] / this.cols;
		this.h = gridAreaSize[1] / this.rows;
		this.dynamicObstacles = [];
		this.terrainTypes = settings.terrainTypes || this.defaultTerrainTypes();
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
		this.noSolution = false;
	}

	protected defaultTerrainTypes(): TerrainTypes {
		return {
			plain: { color: [255, 255, 255], cost: 1 },
			forest: { color: [34, 139, 34], cost: 5 },
			water: { color: [65, 105, 225], cost: 10 },
			mountain: { color: [139, 137, 137], cost: 20 },
		};
	}

	public initialize(): void {
		this.createGrid();
		this.addNeighbors();
		this.setStartEnd();
		this.initDynamicObstacles();
		this.additionalSetup();
	}

	public abstract getElapsedTime(): number;

	protected abstract additionalSetup(): void;

	protected createGrid(): void {
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

	protected addNeighbors(): void {
		for (let i = 0; i < this.cols; i++) {
			for (let j = 0; j < this.rows; j++) {
				this.grid[i][j].addNeighbors(this.grid);
			}
		}
	}

	protected setStartEnd(): void {
		this.start = this.grid[0][0];
		this.end = this.grid[this.cols - 1][this.rows - 1];
		this.start.wall = false;
		this.end.wall = false;
	}

	protected initDynamicObstacles(): void {
		const numDynamicObstacles = this.settings.numDynamicObstacles || 20;
		for (let n = 0; n < numDynamicObstacles; n++) {
			const i = Math.floor(this.p5.random(this.cols));
			const j = Math.floor(this.p5.random(this.rows));
			const obstacle = this.grid[i][j];
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
			const spot = this.grid[i][j];
			if (!spot.wall && spot !== this.start && spot !== this.end) {
				spot.wall = true;
			}
		}
	}

	public reset(): void {
		this.resetGrid();
		this.initialize();
		this.resetMetrics();
		this.p5.loop();
	}

	protected resetGrid(): void {
		for (let i = 0; i < this.cols; i++) {
			for (let j = 0; j < this.rows; j++) {
				this.grid[i][j].reset();
			}
		}
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

	// move dynamic obstacles
	protected moveDynamicObstacles(): void {
		for (let obstacle of this.dynamicObstacles) {
			obstacle.wall = false;
			let i = obstacle.i + Math.floor(this.p5.random(-1, 2));
			let j = obstacle.j + Math.floor(this.p5.random(-1, 2));
			i = this.p5.constrain(i, 0, this.cols - 1);
			j = this.p5.constrain(j, 0, this.rows - 1);
			obstacle = this.grid[i][j];
			if (obstacle !== this.start && obstacle !== this.end && !obstacle.wall) {
				obstacle.wall = true;
			}
		}
	}

	// display the grid and path
	protected display(): void {
		this.p5.background(0);

		this.p5.push();
		this.p5.translate(0, 0);
		// Draw grid
		for (let i = 0; i < this.cols; i++) {
			for (let j = 0; j < this.rows; j++) {
				const spot = this.grid[i][j];
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

		// this.displayMetrics();
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
				const terrainType = this.getTerrainType(temp);
				const cost = temp.terrain.cost;
				this.totalPathCost += cost;
				this.terrainCosts[terrainType] += cost;
				temp = temp.previous;
			}
		}
	}

	private getTerrainType(spot: Spot): string {
		for (const key in this.terrainTypes) {
			if (this.terrainTypes[key] === spot.terrain) {
				return key;
			}
		}
		return "unknown";
	}

	// protected displayMetrics(): void {
	// 	const metricsStartY = 0;
	// 	this.p5.fill(255);
	// 	this.p5.noStroke();
	// 	this.p5.textSize(14);
	// 	this.p5.textAlign(this.p5.LEFT, this.p5.TOP);

	// 	let yPosition = metricsStartY;
	// 	const lineHeight = 18;

	// 	const totalBlocks = this.cols * this.rows;
	// 	const percentageVisited = ((this.nodesVisited / totalBlocks) * 100).toFixed(
	// 		2
	// 	);

	// 	this.p5.text(`Nodes Visited: ${this.nodesVisited}`, 10, yPosition);
	// 	yPosition += lineHeight;

	// 	this.p5.text(
	// 		`Percentage of Blocks Visited: ${percentageVisited}%`,
	// 		10,
	// 		yPosition
	// 	);
	// 	yPosition += lineHeight;

	// 	this.p5.text(
	// 		`Total Path Cost: ${this.totalPathCost.toFixed(2)}`,
	// 		10,
	// 		yPosition
	// 	);
	// 	yPosition += lineHeight;

	// 	this.p5.text(`Terrain Cost Breakdown:`, 10, yPosition);
	// 	yPosition += lineHeight;

	// 	for (const terrain in this.terrainCosts) {
	// 		const cost = this.terrainCosts[terrain];
	// 		this.p5.text(
	// 			`  ${
	// 				terrain.charAt(0).toUpperCase() + terrain.slice(1)
	// 			}: ${cost.toFixed(2)}`,
	// 			10,
	// 			yPosition
	// 		);
	// 		yPosition += lineHeight;
	// 	}
	// }

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
	public hasNoSolution() {
		return this.noSolution;
	}
}
