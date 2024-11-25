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

	const [seed, setSeed] = useState<number>();

	useEffect(() => {
		setSeed(Math.floor(Math.random() * (10000 - 1 + 1)) + 1)
	}, [])


	return (seed &&
		<div className="grid gap-6 auto-rows-auto w-full grid-cols-3 overflow-y-auto">
			{algorithms?.map((algorithm, index) => (
				<div key={index} className="flex w-full min-h-[800px]">
					<Canvas algorithm={algorithm} settings={settings} seed={seed} />
				</div>
			))}
		</div>
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

		// Parse terrain types (cost and color)
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
		// Parse algorithms array
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
		<div className="bg-black p-10 h-screen overflow-hidden">
			<div className="h-full overflow-auto">
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