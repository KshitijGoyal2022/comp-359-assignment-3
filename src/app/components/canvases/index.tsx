// SketchComponent.tsx
"use client";
import React, { useState } from "react";
import AStarSearch from "../search-algorithms/a-star";
import * as p5Types from "p5";
import SearchTemplate, { Settings } from "../search-template";
import UniformCostSearch from "../search-algorithms/uniform-cost-search";
import DFS from "../search-algorithms/dfs";
import BFS from "../search-algorithms/bfs";
import GreedySearch from "../search-algorithms/greedy-search";
import dynamic from "next/dynamic";
import Grid from "../grid";

const Sketch = dynamic(() => import("react-p5"), {
	ssr: false,
});

export enum PathFindingAlgorithms {
	AStar = "A*",
	UniformCost = "UniformCost",
	DFS = "DFS",
	BFS = "BFS",
	GreedySearch = "GreedySearch",
}

type Props = {
	algorithm: PathFindingAlgorithms;
	settings?: Settings;
};

const defaultSettings: Settings = {
	cols: 50,
	rows: 50,
	wallProbability: 0.3,
	dynamicObstacles: true,
	numDynamicObstacles: 20,
};

const Canvas: React.FC<Props> = (props) => {
	const { algorithm, settings = defaultSettings } = props;

	const [searchInstance, setSearchInstance] = useState<SearchTemplate | null>(
		null
	);

	const setup = (p5: p5Types, canvasParentRef: Element) => {
		const width = settings.cols * 10;
		const height = settings.rows * 10;
		// TODO read the settings from the user and size
		p5.createCanvas(width, height).parent(canvasParentRef);

		let searchAlgo: SearchTemplate;

		const grid = new Grid(p5, settings, [width, height]);

		if (algorithm === PathFindingAlgorithms.AStar) {
			searchAlgo = new AStarSearch(p5, settings, grid);
		} else if (algorithm === PathFindingAlgorithms.UniformCost) {
			searchAlgo = new UniformCostSearch(p5, settings, grid);
		} else if (algorithm === PathFindingAlgorithms.DFS) {
			searchAlgo = new DFS(p5, settings, grid);
		} else if (algorithm === PathFindingAlgorithms.BFS) {
			searchAlgo = new BFS(p5, settings, grid);
		} else {
			searchAlgo = new GreedySearch(p5, settings, grid);
		}

		setSearchInstance(searchAlgo);

		p5.mousePressed = () => {
			if (searchInstance) {
				searchInstance.handleMousePressed(p5.mouseX, p5.mouseY);
			}
		};

		p5.keyPressed = () => {
			if (p5.key === " ") {
				if (searchInstance) {
					searchInstance.reset();
				}
			}
		};
	};

	const draw = (p5: p5Types) => {
		if (searchInstance) {
			searchInstance.run();
		}
		document.getElementById(
			"views" + algorithm
		)!.innerHTML = `Total nodes visited: ${searchInstance?.getTotalNodesVisited()}`;

		document.getElementById(
			"percentage" + algorithm
		)!.innerHTML = `Percentage nodes visited: ${searchInstance
			?.getTotalNotesVisitedPercentage()
			.toFixed(2)}%`;

		document.getElementById(
			"total_cost" + algorithm
		)!.innerHTML = `Total Path cost: ${searchInstance?.getTotalPathCost()}`;

		document.getElementById("status" + algorithm)!.innerHTML = `${searchInstance?.hasFinished() ? "Finished" : "Running"
			}`;
		document.getElementById("status" + algorithm)!.className =
			searchInstance?.hasFinished()
				? "ml-1 text-green-500 font-bold"
				: "ml-1 text-red-500 font-bold";

		const terrainCosts = searchInstance?.getTerrainCosts();
		const breakdown = document.getElementById("breakdown" + algorithm);
		breakdown!.innerHTML = "";
		// add p into breakdown
		for (const terrain in terrainCosts) {
			const cost = terrainCosts[terrain];
			breakdown!.innerHTML += `${terrain.charAt(0).toUpperCase() + terrain.slice(1)
				}: ${cost.toFixed(2)}<br>`;
		}

		if (searchInstance?.hasFinished()) p5.noLoop();
	};

	return (
		<div className="flex flex-col items-center justify-center space-y-4 bg-neutral-950 border border-transparent border-neutral-800 p-6 rounded-lg shadow-lg max-w-lg mx-auto text-gray-200">
			<Sketch
				setup={setup}
				draw={draw}
				className={"border border-gray-700 rounded-lg mb-4"}
			/>
			<div className="text-center space-y-2">
				<h1 className="text-2xl font-semibold text-gray-100">{algorithm}</h1>
				<div className="flex flex-col items-center text-gray-400">
					<p id={"views" + algorithm} className="text-sm">
						<strong>Total views:</strong> <span className="ml-1">0</span>
					</p>
					<p id={"percentage" + algorithm} className="text-sm">
						<strong>Percentage nodes visited:</strong>{" "}
						<span className="ml-1">0%</span>
					</p>
					<p id={"total_cost" + algorithm} className="text-sm">
						<strong>Total Path cost:</strong> <span className="ml-1">0</span>
					</p>
					<p className="text-sm">
						<strong>Status</strong>{" "}
						<span
							id={"status" + algorithm}
							className="ml-1 text-red-500 font-bold"
						>
							0
						</span>
					</p>
				</div>
			</div>

			<div className="w-full text-left bg-neutral-800 p-4 rounded-md">
				<h2 className="text-lg font-medium text-gray-300">
					Terrain Cost Breakdown
				</h2>
				<p id={"breakdown" + algorithm} className="text-gray-400 text-sm">
					{/* Breakdown details go here */}
				</p>
			</div>
		</div>
	);
};

export default Canvas;
