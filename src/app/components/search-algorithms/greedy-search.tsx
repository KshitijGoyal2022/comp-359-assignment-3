import SearchTemplate, { Settings } from "../search-template";
import Spot from "../spot";
import * as p5Types from "p5";

export default class GreedySearch extends SearchTemplate {
	private openSet!: Spot[];
	private closedSet!: Set<Spot>;

	constructor(p5: p5Types, settings: Settings, gridAreaSize: [number, number]) {
		super(p5, settings, gridAreaSize);
	}

	protected additionalSetup(): void {
		this.openSet = [];
		this.closedSet = new Set();
		if (this.start) {
			this.openSet.push(this.start);
		}
		this.current = null;
	}

	private heuristic(a: Spot, b: Spot): number {
		return this.p5.dist(a.i, a.j, b.i, b.j);
	}

	public run(): void {
		if (this.openSet.length > 0) {
			this.openSet.sort((a, b) => {
				const aHeuristic = this.heuristic(a, this.end!);
				const bHeuristic = this.heuristic(b, this.end!);
				return aHeuristic - bHeuristic;
			});

			this.current = this.openSet.shift()!;
			this.nodesVisited++;

			if (this.current === this.end) {
				this.calculatePathCosts();
				this.p5.noLoop();
				console.log("Greedy Best-First Search: Path found!");
			}

			this.closedSet.add(this.current);

			const neighbors = this.current.neighbors;

			for (const neighbor of neighbors) {
				if (!this.closedSet.has(neighbor) && !neighbor.wall) {
					neighbor.previous = this.current;
					this.openSet.push(neighbor);
					this.closedSet.add(neighbor);
				}
			}
		} else {
			console.log("Greedy Best-First Search: No solution");
			this.p5.noLoop();
			return;
		}

		if (this.settings.dynamicObstacles) {
			this.moveDynamicObstacles();
		}

		this.display();
	}

	protected drawSets(): void {
		this.closedSet.forEach((spot) => {
			spot.show(this.p5.color(255, 0, 0, 50));
		});

		this.openSet.forEach((spot) => {
			spot.show(this.p5.color(0, 255, 0, 50));
		});
	}
}
