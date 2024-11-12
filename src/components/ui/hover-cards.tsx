import { PathFindingAlgorithms } from "@/app/components/canvases";
import { HoverEffect } from "../ui/card-hover-effect";

export function HoverCards({
	selected,
	onSelect,
}: {
	selected: PathFindingAlgorithms[];
	onSelect: (id: PathFindingAlgorithms) => void;
}) {
	return (
		<div className="w-screen px-8">
			<HoverEffect items={projects} onSelect={onSelect} selected={selected} />
		</div>
	);
}
export const projects = [
	{
		title: "A* Pathfinding",
		id: PathFindingAlgorithms.AStar,
		description:
			"A*  is a computer algorithm that is widely used in pathfinding and graph traversal. The algorithm efficiently plots a walkable path between multiple nodes, or points, on the graph. A non-efficient way to find a path.",
	},
	{
		title: "Breadth First Search",
		id: PathFindingAlgorithms.BFS,
		description:
			"Breadth-first search is an algorithm for searching a tree data structure for a node that satisfies a given property. It starts at the tree root and explores all nodes at the present depth prior to moving on to the nodes at the next depth level.",
	},
	{
		title: "Depth First Search",
		id: PathFindingAlgorithms.DFS,
		description:
			"Depth-first search (DFS) is an algorithm for traversing or searching tree or graph data structures. The algorithm starts at the root node (selecting some arbitrary node as the root node in the case of a graph) and explores as far as possible along each branch before backtracking.",
	},
	{
		title: "Uniform Cost Search",
		id: PathFindingAlgorithms.UniformCost,
		description:
			"Uniform-Cost Search is a variant of Dijikstra’s algorithm. Here, instead of inserting all vertices into a priority queue, we insert only the source, then one by one insert when needed. In every step, we check if the item is already in the priority queue (using the visited array). If yes, we perform the decrease key, else we insert it.",
	},
	{
		title: "Greedy Best First Search",
		id: PathFindingAlgorithms.GreedySearch,
		description:
			"Greedy Best-First Search is an informed search algorithm that relies on heuristic information to guide the search process. Greedy Best-First Search is suitable when the heuristic provides a good estimate, and the lack of optimality is acceptable.",
	},
	// {
	// 	title: "Microsoft",
	// 	description:
	// 		"A multinational technology company that develops, manufactures, licenses, supports, and sells computer software, consumer electronics, personal computers, and related services.",
	// },
];
