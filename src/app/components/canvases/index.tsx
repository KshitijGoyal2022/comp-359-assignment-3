// SketchComponent.tsx

import React, { useState } from "react";
import Sketch from "react-p5";
import AStarSearch from "../search-algorithms/a-star";
import * as p5Types from "p5";
import SearchTemplate, { Settings } from "../search-template";
import UniformCostSearch from "../search-algorithms/uniform-cost-search";
import DFS from "../search-algorithms/dfs";
import BFS from "../search-algorithms/bfs";
import GreedySearch from "../search-algorithms/greedy-search";

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

		if (algorithm === PathFindingAlgorithms.AStar) {
			searchAlgo = new AStarSearch(p5, settings, [width, height]);
		} else if (algorithm === PathFindingAlgorithms.UniformCost) {
			searchAlgo = new UniformCostSearch(p5, settings, [width, height]);
		} else if (algorithm === PathFindingAlgorithms.DFS) {
			searchAlgo = new DFS(p5, settings, [width, height]);
		} else if (algorithm === PathFindingAlgorithms.BFS) {
			searchAlgo = new BFS(p5, settings, [width, height]);
		} else {
			searchAlgo = new GreedySearch(p5, settings, [width, height]);
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
			"views"
		)!.innerHTML = `Total nodes visited: ${searchInstance?.getTotalNodesVisited()}`;

		document.getElementById(
			"percentage"
		)!.innerHTML = `Percentage nodes visited: ${searchInstance
			?.getTotalNotesVisitedPercentage()
			.toFixed(2)}%`;

		document.getElementById(
			"total_cost"
		)!.innerHTML = `Total Path cost: ${searchInstance?.getTotalPathCost()}`;

		const terrainCosts = searchInstance?.getTerrainCosts();
		for (const terrain in terrainCosts) {
			const cost = terrainCosts[terrain];
			const breakdown = document.getElementById("breakdown");
			breakdown.innerHTML = "";
			// add p into breakdown
			for (const terrain in terrainCosts) {
				const cost = terrainCosts[terrain];
				breakdown!.innerHTML += `${
					terrain.charAt(0).toUpperCase() + terrain.slice(1)
				}: ${cost.toFixed(2)}<br>`;
			}
		}
	};

	return (
		<div>
			<Sketch setup={setup} draw={draw} />
			<p id="views">Total views: </p>
			<p id="percentage">Percentage nodes visited</p>
			<p id="total_cost">Total Path cost: </p>
			<p>Terrain cost breakdown:</p>
			<p id="breakdown"></p>
		</div>
	);
};

export default Canvas;
