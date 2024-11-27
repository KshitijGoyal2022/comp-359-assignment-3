import SearchTemplate, { Settings } from "../search-template";
import Spot from "../spot";
import * as p5Types from "p5";

export default class GreedySearch extends SearchTemplate {
	private openSet!: Spot[];
	private closedSet!: Set<Spot>;
	private startTime: number | null;
	private endTime: number | null;

	constructor(p5: p5Types, settings: Settings, gridAreaSize: [number, number]) {
		super(p5, settings, gridAreaSize);
		this.startTime = null;
		this.endTime = null;
	}

	protected additionalSetup(): void {
		this.openSet = [];
		this.closedSet = new Set();
		if (this.start) {
			this.openSet.push(this.start);
		}
		this.current = null;
		this.startTime = this.p5.millis();
		this.endTime = null;
	}

	private heuristic(a: Spot, b: Spot): number {
		return this.p5.dist(a.i, a.j, b.i, b.j);
	}

	public run(): void {
		if (this.startTime === null) {
			this.startTime = this.p5.millis();
		}
		if (this.finished) return;
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
				this.finished = true;
				this.endTime = this.p5.millis();
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
			this.noSolution = true;
			this.p5.noLoop();
			this.endTime = this.p5.millis();
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

	public getElapsedTime(): number {
		if (this.startTime !== null) {
			const currentTime =
				this.finished && this.endTime !== null
					? this.endTime
					: this.p5.millis();
			const elapsedTime = (currentTime - this.startTime) / 1000;
			return elapsedTime;
		}
		return -1;
	}
}
