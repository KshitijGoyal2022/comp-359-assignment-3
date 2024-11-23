"use client";
import React, { useState } from "react";
import {
	Modal,
	ModalBody,
	ModalContent,
	ModalFooter,
	ModalTrigger,
} from "../ui/animated-modal";
import { HoverCards } from "./hover-cards";
import { PathFindingAlgorithms } from "@/app/components/canvases";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Settings, TerrainTypes } from "@/app/components/search-template";
import { useRouter } from "next/navigation";

const SelectionPage = ({
	onNext,
	selected,
	onSelect,
}: {
	onNext: () => void;
	selected: PathFindingAlgorithms[];
	onSelect: (id: PathFindingAlgorithms) => void;
}) => {
	return (
		<>
			<ModalBody className="overflow-y-auto">
				<ModalContent>
					<h4 className="text-lg md:text-2xl text-neutral-100 font-bold text-center mb-8">
						Select yout algorithms{" "}
						<span className="px-1 py-0.5 rounded-md bg-neutral-800 border-neutral-700 border">
							now!
						</span>{" "}
						✈️
					</h4>

					<div className="py-10 flex flex-wrap gap-x-6 gap-y-6 items-start justify-start ">
						<HoverCards onSelect={onSelect} selected={selected} />
					</div>
				</ModalContent>
				<ModalFooter className="gap-4">
					{/* <button className="px-2 py-1 bg-gray-200 text-black dark:bg-black dark:border-black dark:text-white border border-gray-300 rounded-md text-sm w-28">
							Cancel
						</button> */}
					<button
						disabled={selected.length === 0}
						onClick={onNext}
						className="bg-black text-white dark:bg-white dark:text-black text-sm px-2 py-1 rounded-md border border-black w-28"
					>
						Next
					</button>
				</ModalFooter>
			</ModalBody>
		</>
	);
};

const rgbToHex = (rgb: [number, number, number]) =>
	`#${rgb.map((x) => x.toString(16).padStart(2, "0")).join("")}`;

export const hexToRgb = (hex: string): [number, number, number] => [
	parseInt(hex.slice(1, 3), 16),
	parseInt(hex.slice(3, 5), 16),
	parseInt(hex.slice(5, 7), 16),
];

const SettingsPage = ({
	onStart,
	onBack,
	settings,
	onChange,
	handleTerrainChange,
}: {
	onStart: () => void;
	onBack: () => void;
	settings: Settings;
	onChange: (field: keyof Settings, value: any) => void;
	handleTerrainChange: (
		terrain: keyof TerrainTypes,
		field: "color" | "cost",
		value: any
	) => void;
}) => {
	return (
		<>
			<ModalBody>
				<ModalContent>
					<h4 className="text-lg md:text-2xl text-neutral-100 font-bold text-center mb-8">
						Select yout settings{" "}
						<span className="px-1 py-0.5 rounded-md bg-neutral-800 border-neutral-700 border">
							now!
						</span>{" "}
						⚙️
					</h4>

					<div className="grid grid-cols-2 gap-8 max-w-[800px] mx-auto">
						{/* Left Side: Dimensions and Terrain Thresholds */}
						<div className="space-y-4">
							<div className="space-y-2">
								<h4 className="font-medium leading-none text-gray-100">
									Dimensions
								</h4>
								<p className="text-sm text-gray-400">
									Set the dimensions for the grid.
								</p>
							</div>
							<div className="grid gap-2">
								<div className="grid grid-cols-3 items-center gap-4">
									<Label htmlFor="cols" className="text-gray-200 col-span-2">
										Columns
									</Label>
									<Input
										id="cols"
										type="number"
										value={settings.cols}
										onChange={(e) => onChange("cols", parseInt(e.target.value))}
										className=" h-8 bg-gray-800 text-gray-100 border-gray-700"
									/>
								</div>
								<div className="grid grid-cols-3 items-center gap-4">
									<Label htmlFor="rows" className="text-gray-200 col-span-2">
										Rows
									</Label>
									<Input
										id="rows"
										type="number"
										value={settings.rows}
										onChange={(e) => onChange("rows", parseInt(e.target.value))}
										className=" h-8 bg-gray-800 text-gray-100 border-gray-700"
									/>
								</div>
								<div className="grid grid-cols-3 items-center gap-4">
									<Label
										htmlFor="wallProbability"
										className="text-gray-200 col-span-2"
									>
										Wall Probability (0-1)
									</Label>
									<Input
										id="wallProbability"
										type="number"
										step="0.1"
										value={settings.wallProbability}
										onChange={(e) =>
											onChange("wallProbability", parseFloat(e.target.value))
										}
										className=" h-8 bg-gray-800 text-gray-100 border-gray-700"
									/>
								</div>
							</div>

							<div className="space-y-2 mt-6">
								<h4 className="font-medium leading-none text-gray-100">
									Terrain Thresholds
								</h4>
								<p className="text-sm text-gray-400">
									Set thresholds for different terrains.
								</p>
							</div>
							<div className="grid gap-2">
								<div className="grid grid-cols-3 items-center gap-4">
									<Label htmlFor="plain" className="text-gray-200 col-span-2">
										Plain
									</Label>
									<input
										id="plain"
										type="range"
										min="0"
										max="1"
										step="0.01"
										value={settings.terrainThresholds?.plain || 0}
										onChange={(e) =>
											onChange("terrainThresholds", {
												...settings.terrainThresholds,
												plain: parseFloat(e.target.value),
											})
										}
										className="h-8 bg-gray-800 text-gray-100 border-gray-700"
									/>
								</div>
								<div className="grid grid-cols-3 items-center gap-4">
									<Label htmlFor="forest" className="text-gray-200 col-span-2">
										Forest
									</Label>
									<input
										id="forest"
										type="range"
										min="0"
										max="1"
										step="0.01"
										value={settings.terrainThresholds?.forest || 0}
										onChange={(e) =>
											onChange("terrainThresholds", {
												...settings.terrainThresholds,
												forest: parseFloat(e.target.value),
											})
										}
										className="h-8 bg-gray-800 text-gray-100 border-gray-700"
									/>
								</div>
								<div className="grid grid-cols-3 items-center gap-4">
									<Label htmlFor="water" className="text-gray-200 col-span-2">
										Water
									</Label>
									<input
										id="water"
										type="range"
										min="0"
										max="1"
										step="0.01"
										value={settings.terrainThresholds?.water || 0}
										onChange={(e) =>
											onChange("terrainThresholds", {
												...settings.terrainThresholds,
												water: parseFloat(e.target.value),
											})
										}
										className="h-8 bg-gray-800 text-gray-100 border-gray-700"
									/>
								</div>
							</div>
						</div>

						{/* Right Side: Terrain Types (Colors and Costs) */}
						<div className="space-y-4">
							<div className="space-y-2">
								<h4 className="font-medium leading-none text-gray-100">
									Terrain Types
								</h4>
								<p className="text-sm text-gray-400">
									Set color and cost for each terrain type.
								</p>
							</div>
							{settings.terrainTypes &&
								Object.entries(settings.terrainTypes).map(
									([terrain, { color, cost }]) => (
										<div key={terrain} className="space-y-4">
											<h5 className="text-gray-200 font-semibold capitalize">
												{terrain}
											</h5>
											<div className="grid grid-cols-3 items-center gap-4">
												<Label className="text-gray-200 col-span-2">Cost</Label>
												<Input
													type="number"
													value={cost}
													onChange={(e) =>
														handleTerrainChange(
															terrain as keyof TerrainTypes,
															"cost",
															parseInt(e.target.value)
														)
													}
													className="h-8 bg-gray-800 text-gray-100 border-gray-700"
												/>
											</div>
											<div className="grid grid-cols-3 items-center gap-4">
												<Label className="text-gray-200 col-span-2">
													Color
												</Label>
												<input
													type="color"
													value={rgbToHex(color)}
													onChange={(e) =>
														handleTerrainChange(
															terrain as keyof TerrainTypes,
															"color",
															e.target.value
														)
													}
													className="h-8 w-full bg-gray-800 border border-gray-700"
												/>
											</div>
											{/** Divider */}
											<hr className="border-gray-700" />
										</div>
									)
								)}
						</div>
					</div>
				</ModalContent>
				<ModalFooter className="gap-4">
					<button
						onClick={onBack}
						className="px-2 py-1 bg-gray-200 text-black dark:bg-black dark:border-black dark:text-white border border-gray-300 rounded-md text-sm w-28"
					>
						Cancel
					</button>
					<button
						onClick={onStart}
						className="bg-black text-white dark:bg-white dark:text-black text-sm px-2 py-1 rounded-md border border-black w-28"
					>
						Start
					</button>
				</ModalFooter>
			</ModalBody>
		</>
	);
};

export function AlgorithmSelectionModal() {
	const [page, setPage] = React.useState(0);
	const router = useRouter();

	const [settings, setSettings] = useState<Settings>({
		cols: 50,
		rows: 50,
		wallProbability: 0.3,
		dynamicObstacles: true,
		numDynamicObstacles: 20,
		terrainTypes: {
			plain: { color: [255, 255, 255], cost: 1 },
			forest: { color: [34, 139, 34], cost: 5 },
			water: { color: [65, 105, 225], cost: 10 },
			mountain: { color: [139, 137, 137], cost: 20 },
		},
		terrainThresholds: { plain: 0.7, forest: 0.85, water: 0.9 },
		speed: 1,
	});

	const onChange = (field: keyof Settings, value: any) => {
		setSettings((prev) => ({ ...prev, [field]: value }));
	};

	const handleTerrainChange = (
		terrain: keyof TerrainTypes,
		field: "color" | "cost",
		value: any
	) => {
		setSettings((prev) => ({
			...prev,
			terrainTypes: {
				...prev.terrainTypes,
				[terrain]: {
					...prev.terrainTypes[terrain],
					[field]: field === "color" ? hexToRgb(value) : value,
				},
			},
		}));
	};

	const [selectedAlgorithms, setSelectedAlgorithms] = React.useState<
		PathFindingAlgorithms[]
	>([]);

	const callbackSelectAlgorithm = (id: PathFindingAlgorithms) => {
		setSelectedAlgorithms((prev) => {
			if (prev.includes(id)) {
				return prev.filter((item) => item !== id);
			}
			return [...prev, id];
		});
	};

	const convertSettingsToParams = (settings: Settings) => {
		const params = new URLSearchParams();

		params.append("cols", settings.cols.toString());
		params.append("rows", settings.rows.toString());
		params.append("wallProbability", settings.wallProbability.toString());
		params.append("dynamicObstacles", settings.dynamicObstacles.toString());
		params.append(
			"numDynamicObstacles",
			settings.numDynamicObstacles.toString()
		);
		params.append("speed", settings.speed?.toString() || "");

		// Serialize terrain thresholds
		if (settings.terrainThresholds) {
			Object.entries(settings.terrainThresholds).forEach(([key, value]) =>
				params.append(`terrainThresholds[${key}]`, value.toString())
			);
		}

		// Serialize terrain types (colors and costs)
		Object.entries(settings.terrainTypes).forEach(
			([terrain, { color, cost }]) => {
				params.append(`terrainTypes[${terrain}][cost]`, cost.toString());
				params.append(`terrainTypes[${terrain}][color]`, rgbToHex(color));
			}
		);

		// Serialize algorithms array
		selectedAlgorithms.forEach((algo, index) =>
			params.append(`algorithms[${index}]`, algo)
		);

		return params.toString();
	};

	// Handle the "Start" button click
	const handleStart = () => {
		const params = convertSettingsToParams(settings);
		router.push(`/render?${params}`);
	};
	return (
		<div className="flex items-center justify-center">
			<Modal>
				<ModalTrigger className="bg-white dark:bg-black dark:text-white text-black flex justify-center group/modal-btn">
					<span className="group-hover/modal-btn:translate-x-40 text-center transition duration-500">
						Select algorithms
					</span>
					<div className="-translate-x-40 group-hover/modal-btn:translate-x-0 flex items-center justify-center absolute inset-0 transition duration-500 text-black z-20">
						✈️
					</div>
				</ModalTrigger>
				{page === 0 && (
					<SelectionPage
						onNext={() => setPage(1)}
						selected={selectedAlgorithms}
						onSelect={callbackSelectAlgorithm}
					/>
				)}
				{page === 1 && (
					<SettingsPage
						onStart={handleStart}
						onBack={() => setPage(0)}
						settings={settings}
						onChange={onChange}
						handleTerrainChange={handleTerrainChange}
					/>
				)}
			</Modal>
		</div>
	);
}
