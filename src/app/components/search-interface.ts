export interface SearchInterface {
	initialize(): void;
	run(): void;
	setSpeed(speed: number): void;
	toggleDynamicObstacles(enable: boolean): void;
	handleMousePressed(x: number, y: number): void;
	reset(): void;
	getElapsedTime(): number;
}
