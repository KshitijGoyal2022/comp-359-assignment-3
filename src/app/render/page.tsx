"use client";
import { hexToRgb } from "@/components/ui/algorithm-selection-modal";
import { Settings, TerrainTypes } from "../components/search-template";
import { PathFindingAlgorithms } from "../components/canvases";
const Canvas = dynamic(() => import("../components/canvases"), {
	ssr: false,
});
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import dynamic from "next/dynamic";

const DynamicGrid = ({
	algorithms,
	settings,
}: {
	algorithms?: PathFindingAlgorithms[];
	settings: Settings;
}) => {
	const [seed, setSeed] = useState<number | null>();

	useEffect(() => {
		setSeed(Math.floor(Math.random() * (100000 - 1 + 1)) + 1);
	}, []);

	return (
		seed && (
			<div
				className="grid gap-6 w-full grid-cols-[repeat(auto-fit,minmax(500px,1fr))]"
				style={{
					maxHeight: "calc(100vh - 80px)", // Adjusted for header height
					overflowY: "auto",
					paddingBottom: "20px",
				}}
			>
				{algorithms?.map((algorithm, index) => (
					<div key={index} className="flex">
						<Canvas algorithm={algorithm} settings={settings} seed={seed} />
					</div>
				))}
			</div>
		)
	);
};

export default function RenderPage() {
	const [searchInstance, setSearchInstance] = useState<
		(Settings & { algorithms: PathFindingAlgorithms[] }) | null
	>(null);

	const decodeSettingsFromParams = (
		params: URLSearchParams
	): Settings & { algorithms: PathFindingAlgorithms[] } => {
		const settings: Settings & { algorithms: PathFindingAlgorithms[] } = {
			cols: parseInt(params.get("cols") || "10"),
			rows: parseInt(params.get("rows") || "10"),
			wallProbability: parseFloat(params.get("wallProbability") || "0.3"),
			dynamicObstacles: params.get("dynamicObstacles") === "true",
			numDynamicObstacles: parseInt(params.get("numDynamicObstacles") || "20"),
			terrainTypes: {
				plain: { color: [255, 255, 255], cost: 1 },
				forest: { color: [34, 139, 34], cost: 5 },
				water: { color: [65, 105, 225], cost: 10 },
				mountain: { color: [139, 137, 137], cost: 20 },
			},
			terrainThresholds: {
				plain: parseFloat(params.get("terrainThresholds[plain]") || "0.7"),
				forest: parseFloat(params.get("terrainThresholds[forest]") || "0.85"),
				water: parseFloat(params.get("terrainThresholds[water]") || "0.9"),
			},
			speed: parseFloat(params.get("speed") || "1"),
			algorithms: [],
		};

		["plain", "forest", "water", "mountain"].forEach((terrain) => {
			const cost = parseInt(
				params.get(`terrainTypes[${terrain}][cost]`) || "1"
			);
			const colorHex = params.get(`terrainTypes[${terrain}][color]`) || "red";
			if (settings.terrainTypes) {
				settings.terrainTypes[terrain as keyof TerrainTypes] = {
					cost,
					color: hexToRgb(colorHex),
				};
			}
		});

		settings.algorithms = [];
		let index = 0;
		while (params.has(`algorithms[${index}]`)) {
			settings.algorithms.push(
				(params.get(`algorithms[${index}]`) || "") as PathFindingAlgorithms
			);
			index++;
		}

		return settings;
	};

	const params = useSearchParams();

	useEffect(() => {
		const decoded = decodeSettingsFromParams(params);
		setSearchInstance(decoded);
	}, [params]);

	return (
		<div className="bg-black min-h-screen">
			{/* Header */}
			<header
				className="flex items-center justify-between px-4 py-3 bg-gray-800 text-white fixed top-0 left-0 right-0 z-10"
				style={{ height: "60px" }}
			>
				<button
					className="text-white bg-gray-700 px-3 py-1 rounded hover:bg-gray-600"
					onClick={() => window.history.back()}
				>
					Back
				</button>
				<h1 className="text-xl font-semibold">Find the path!</h1>
				<div></div> {/* Placeholder for alignment */}
			</header>

			{/* Content */}
			<div
				className="p-10"
				style={{
					marginTop: "60px", // Prevent overlap with the header
					height: "calc(100vh - 60px)", // Adjust for header height
					overflowY: "auto",
				}}
			>
				{searchInstance && (
					<DynamicGrid
						algorithms={searchInstance?.algorithms}
						settings={searchInstance}
					/>
				)}
			</div>
		</div>
	);
}
