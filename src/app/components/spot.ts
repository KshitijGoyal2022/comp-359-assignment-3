import * as p5Types from "p5";

interface TerrainType {
	color: [number, number, number];
	cost: number;
}

interface TerrainTypes {
	[key: string]: TerrainType;
}

interface Settings {
	wallProbability: number;
	terrainThresholds?: {
		plain: number;
		forest: number;
		water: number;
	};
}

export default class Spot {
	p5: p5Types;
	i: number;
	j: number;
	w: number;
	h: number;
	f: number;
	g: number;
	hCost: number;
	neighbors: Spot[];
	previous?: Spot;
	wall: boolean;
	terrain: TerrainType;
	cost: number;

	constructor(
		p5: p5Types,
		i: number,
		j: number,
		w: number,
		h: number,
		terrainTypes: TerrainTypes,
		settings: Settings
	) {
		this.p5 = p5;
		this.i = i;
		this.j = j;
		this.w = w;
		this.h = h;
		this.f = 0;
		this.g = 0;
		this.hCost = 0;
		this.neighbors = [];
		this.previous = undefined;
		this.wall = false;
		this.terrain = this.randomTerrain(terrainTypes, settings);
		this.cost = Infinity;

		if (this.p5.random(1) < settings.wallProbability) {
			this.wall = true;
		}
	}

	private randomTerrain(
		terrainTypes: TerrainTypes,
		settings: Settings
	): TerrainType {
		const r = this.p5.random(1);
		const terrainThresholds = settings.terrainThresholds || {
			plain: 0.7,
			forest: 0.85,
			water: 0.95,
		};

		if (r < terrainThresholds.plain) {
			return terrainTypes.plain;
		} else if (r < terrainThresholds.forest) {
			return terrainTypes.forest;
		} else if (r < terrainThresholds.water) {
			return terrainTypes.water;
		} else {
			return terrainTypes.mountain;
		}
	}

	public addNeighbors(grid: Spot[][]): void {
		const i = this.i;
		const j = this.j;
		const cols = grid.length;
		const rows = grid[0].length;

		this.neighbors = [];

		if (i < cols - 1) {
			this.neighbors.push(grid[i + 1][j]);
		}
		if (i > 0) {
			this.neighbors.push(grid[i - 1][j]);
		}
		if (j < rows - 1) {
			this.neighbors.push(grid[i][j + 1]);
		}
		if (j > 0) {
			this.neighbors.push(grid[i][j - 1]);
		}
		// Diagonals
		if (i > 0 && j > 0) {
			this.neighbors.push(grid[i - 1][j - 1]);
		}
		if (i < cols - 1 && j > 0) {
			this.neighbors.push(grid[i + 1][j - 1]);
		}
		if (i > 0 && j < rows - 1) {
			this.neighbors.push(grid[i - 1][j + 1]);
		}
		if (i < cols - 1 && j < rows - 1) {
			this.neighbors.push(grid[i + 1][j + 1]);
		}
	}

	public show(col: p5Types.Color): void {
		this.p5.fill(col);
		this.p5.noStroke();
		this.p5.rect(this.i * this.w, this.j * this.h, this.w - 1, this.h - 1);
	}

	public reset(): void {
		this.f = 0;
		this.g = 0;
		this.hCost = 0;
		this.cost = Infinity;
		this.previous = undefined;
	}
}
