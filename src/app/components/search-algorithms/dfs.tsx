import SearchTemplate, { Settings } from "../search-template";
import Spot from "../spot";
import * as p5Types from "p5";

export default class DFS extends SearchTemplate {
	private stack!: Spot[];
	private visited!: Set<Spot>;

	constructor(p5: p5Types, settings: Settings, gridAreaSize: [number, number]) {
		super(p5, settings, gridAreaSize);
	}

	protected additionalSetup(): void {
		this.stack = [];
		this.visited = new Set();
		if (this.start) {
			this.stack.push(this.start);
			this.visited.add(this.start);
		}
		this.current = null;
	}

	public run(): void {
		if (this.finished) return;
		if (this.stack.length > 0) {
			this.current = this.stack.pop()!;
			this.nodesVisited++;

			if (this.current === this.end) {
				this.calculatePathCosts();
				this.p5.noLoop();
				this.finished = true;
				console.log("DFS: Path found!");
			}

			const neighbors = this.current.neighbors;

			for (const neighbor of neighbors) {
				if (!this.visited.has(neighbor) && !neighbor.wall) {
					this.visited.add(neighbor);
					neighbor.previous = this.current;
					this.stack.push(neighbor);
				}
			}
		} else {
			console.log("DFS: No solution");
			this.noSolution = true;
			this.p5.noLoop();
			return;
		}

		if (this.settings.dynamicObstacles) {
			this.moveDynamicObstacles();
		}

		this.display();
	}

	protected drawSets(): void {
		this.visited.forEach((spot) => {
			spot.show(this.p5.color(255, 0, 0, 50));
		});

		this.stack.forEach((spot) => {
			spot.show(this.p5.color(0, 255, 0, 50));
		});
	}
}
