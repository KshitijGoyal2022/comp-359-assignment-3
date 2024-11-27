import SearchTemplate, { Settings } from "../search-template";
import Spot from "../spot";
import * as p5Types from "p5";

export default class BFS extends SearchTemplate {
	private queue!: Spot[];
	private visited!: Set<Spot>;
	private startTime: number | null;
	private endTime: number | null;

	constructor(p5: p5Types, settings: Settings, gridAreaSize: [number, number]) {
		super(p5, settings, gridAreaSize);
		this.startTime = null;
		this.endTime = null;
	}

	protected additionalSetup(): void {
		this.queue = [];
		this.visited = new Set();
		if (this.start) {
			this.queue.push(this.start);
			this.visited.add(this.start);
		}
		this.current = null;
	}

	public run(): void {
		if (this.startTime === null) {
			this.startTime = this.p5.millis();
		}
		if (this.finished) return;
		if (this.queue.length > 0) {
			this.current = this.queue.shift()!;
			this.nodesVisited++;

			if (this.current === this.end) {
				this.calculatePathCosts();
				this.p5.noLoop();
				this.finished = true;
				this.endTime = this.p5.millis();
				console.log("BFS: Path found!");
			}

			const neighbors = this.current.neighbors;

			for (const neighbor of neighbors) {
				if (!this.visited.has(neighbor) && !neighbor.wall) {
					this.visited.add(neighbor);
					neighbor.previous = this.current;
					this.queue.push(neighbor);
				}
			}
		} else {
			console.log("BFS: No solution");
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
		this.visited.forEach((spot) => {
			spot.show(this.p5.color(255, 0, 0, 50));
		});

		this.queue.forEach((spot) => {
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
