'use client';
import { useRef } from 'react';
import Sketch from 'react-p5';
import P5, { Color } from 'p5/index';
import SearchTemplate from '../search-template';

import DFS from '../search-algorithms/dfs';
import BFS from '../search-algorithms/bfs';
import UCS from '../search-algorithms/uniform-cost-search';
import GreedyBestFirst from '../search-algorithms/greedy-search';
import AStar from '../search-algorithms/a-star';

interface CanvasProps {
  algo: string;
}

const Canvas = ({ algo }: CanvasProps) => {
  const dict: Record<string, new (p5: P5, windowWidth: number, windowHeight: number) => SearchTemplate> = {
    dfs: DFS,
    bfs: BFS,
    ucs: UCS,
    greedy: GreedyBestFirst,
    astar: AStar,
  };

  const AlgorithmClass = dict[algo];
  const viewRef = useRef<HTMLDivElement>(null);

  let cols: number, rows: number;
  const size = 20;

  let hasGreen = false;
  let hasRed = false;
  let algorithm: SearchTemplate | null = null;

  const c: (Color | null)[][] = [];

  function setup(p5: P5, canvasParentRef: Element) {
    const width = 400;
    const height = 400;

    p5.createCanvas(width, height).parent(canvasParentRef);
    p5.background(255);

    cols = Math.floor(width / size);
    rows = Math.floor(height / size);

    for (let i = 0; i < cols; i++) {
      c[i] = Array(rows).fill(null);
    }

    // Instantiate the selected algorithm class
    algorithm = AlgorithmClass ? new AlgorithmClass(p5, width, height) : null;

    p5.mouseClicked = () => handleMousePress(p5);
  }

  function draw(p5: P5) {
    for (let i = 0; i < cols; i++) {
      for (let j = 0; j < rows; j++) {
        if (c[i][j]) {
          p5.fill(c[i][j]!);
        } else {
          p5.fill(255);
        }
        p5.rect(i * size, j * size, size, size);
      }
    }
  }

  function handleMousePress(p5: P5) {
    const i = Math.floor(p5.mouseX / size);
    const j = Math.floor(p5.mouseY / size);

    if (i >= 0 && i < cols && j >= 0 && j < rows) {
      if (c[i][j]) {
        if (c[i][j]?.toString() === p5.color(0, 255, 0).toString()) hasGreen = false;
        if (c[i][j]?.toString() === p5.color(255, 0, 0).toString()) hasRed = false;
        c[i][j] = null;
      } else {
        let color: Color | null = null;

        if (!hasGreen) {
          color = p5.color(0, 255, 0);
          hasGreen = true;
        } else if (!hasRed) {
          color = p5.color(255, 0, 0);
          hasRed = true;
        } else {
          color = p5.color(0, 0, 0);
        }

        c[i][j] = color;
      }
    }

    p5.redraw();
  }

  function animateAlgorithm() {
    if (algorithm && !algorithm.finished) {
      algorithm.check();
      algorithm.draw();
      requestAnimationFrame(animateAlgorithm);
    }
  }

  function startAlgorithm() {
    if (algorithm) {
      algorithm.run(c);
      requestAnimationFrame(animateAlgorithm);
    }
  }

  return (
    <div>
      <div className="w-full flex flex-col justify-between bg-gray-50">
        <div ref={viewRef} className="flex-grow">
          <Sketch setup={setup as never} draw={draw as never} />
        </div>
        <button onClick={startAlgorithm} className="mt-4 p-2 bg-blue-500 text-white w-[200px]">
          Start Algorithm
        </button>
      </div>
    </div>
  );
};

export default Canvas;
