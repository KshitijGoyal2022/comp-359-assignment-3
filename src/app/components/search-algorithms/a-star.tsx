// AStarSearch.ts

import SearchTemplate, { Settings } from "../search-template";
import Spot from "../spot";
import * as p5Types from "p5";

export default class AStarSearch extends SearchTemplate {
	private openSet!: Spot[];
	private closedSet!: Spot[];

	constructor(p5: p5Types, settings: Settings, gridAreaSize: [number, number]) {
		super(p5, settings, gridAreaSize);
	}

	protected additionalSetup(): void {
		this.openSet = [];
		this.closedSet = [];
		if (this.start) {
			this.openSet.push(this.start);
		}
		this.current = null;
	}

	private heuristic(a: Spot, b: Spot): number {
		return this.p5.dist(a.i, a.j, b.i, b.j);
	}

	public run(): void {
		if (this.finished) return;
		if (this.openSet.length > 0) {
			let winner = 0;
			for (let i = 0; i < this.openSet.length; i++) {
				if (this.openSet[i].f < this.openSet[winner].f) {
					winner = i;
				}
			}

			this.current = this.openSet[winner];
			this.nodesVisited++;

			if (this.current === this.end) {
				this.calculatePathCosts();
				this.p5.noLoop();
				this.finished = true;
				console.log("A* Search: Path found!");
			}

			this.openSet.splice(winner, 1);
			this.closedSet.push(this.current);

			const neighbors = this.current.neighbors;

			for (const neighbor of neighbors) {
				if (!this.closedSet.includes(neighbor) && !neighbor.wall) {
					const tempG =
						this.current.g +
						this.heuristic(this.current, neighbor) * neighbor.terrain.cost;

					let newPath = false;
					if (this.openSet.includes(neighbor)) {
						if (tempG < neighbor.g) {
							neighbor.g = tempG;
							newPath = true;
						}
					} else {
						neighbor.g = tempG;
						newPath = true;
						this.openSet.push(neighbor);
					}

					if (newPath) {
						neighbor.hCost = this.heuristic(neighbor, this.end!);
						neighbor.f = neighbor.g + neighbor.hCost;
						neighbor.previous = this.current;
					}
				}
			}
		} else {
			console.log("A* Search: No solution");
			this.p5.noLoop();
			return;
		}

		if (this.settings.dynamicObstacles) {
			this.moveDynamicObstacles();
		}

		this.display();
	}

	protected drawSets(): void {
		for (const spot of this.closedSet) {
			spot.show(this.p5.color(255, 0, 0, 50));
		}

		for (const spot of this.openSet) {
			spot.show(this.p5.color(0, 255, 0, 50));
		}
	}
}
