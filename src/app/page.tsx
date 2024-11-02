"use client";
import React from "react";
import { AlgorithmSelectionModal } from "@/components/ui/algorithm-selection-modal";

import Canvas from "./components/canvases";
import { Vortex } from "../components/ui/vortex";
export default function Home() {
	return (
		<div className="">
			{/* <Canvas algo='dfs'/>
        <Canvas algo='bfs'/>
        <Canvas algo='astar'/>
        <Canvas algo='ucs'/> */}
			<div className="w-screen h-screen mx-auto rounded-md overflow-hidden">
				<Vortex
					backgroundColor="black"
					className="flex items-center flex-col justify-center px-2 md:px-10 py-4 w-full h-full"
				>
					<h2 className="text-white text-2xl md:text-6xl font-bold text-center">
						Want to find a path?
						<br />
						Visualize it!
					</h2>
					<p className="text-white text-sm md:text-2xl max-w-xl mt-6 text-center">
						Our interactive system allows you to visualize some of the most
						famous path finding algorithms.
					</p>
					<div className="flex flex-col sm:flex-row items-center gap-4 mt-6">
						<AlgorithmSelectionModal />
					</div>
				</Vortex>
			</div>
		</div>
	);
}
