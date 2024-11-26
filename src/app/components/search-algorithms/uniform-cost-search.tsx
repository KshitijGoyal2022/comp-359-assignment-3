import SearchTemplate, { Settings } from "../search-template";
import Spot from "../spot";
import * as p5Types from "p5";

export default class UniformCostSearch extends SearchTemplate {
	private frontier!: Spot[];
	private explored!: Spot[];

	constructor(p5: p5Types, settings: Settings, gridAreaSize: [number, number]) {
		super(p5, settings, gridAreaSize);
	}

	protected additionalSetup(): void {
		this.frontier = [];
		this.explored = [];
		if (this.start) {
			this.start.cost = 0;
			this.frontier.push(this.start);
		}
		this.current = null;
	}

	public run(): void {
		if (this.finished) return;
		if (this.frontier.length > 0) {
			this.frontier.sort((a, b) => a.cost - b.cost);
			this.current = this.frontier.shift()!;
			this.nodesVisited++;

			if (this.current === this.end) {
				this.calculatePathCosts();
				this.p5.noLoop();
				this.finished = true;
				console.log("Uniform Cost Search: Path found!");
			}

			this.explored.push(this.current);

			const neighbors = this.current.neighbors;

			for (const neighbor of neighbors) {
				if (!this.explored.includes(neighbor) && !neighbor.wall) {
					const tempCost = this.current.cost + neighbor.terrain.cost;

					if (tempCost < neighbor.cost || !this.frontier.includes(neighbor)) {
						neighbor.cost = tempCost;
						neighbor.previous = this.current;

						if (!this.frontier.includes(neighbor)) {
							this.frontier.push(neighbor);
						}
					}
				}
			}
		} else {
			console.log("Uniform Cost Search: No solution");
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
		for (const spot of this.explored) {
			spot.show(this.p5.color(255, 0, 0, 50));
		}

		for (const spot of this.frontier) {
			spot.show(this.p5.color(0, 255, 0, 50));
		}
	}
}
