'use client';
import { useRef} from 'react';
import Sketch from 'react-p5';
import P5, { Color } from 'p5/index';

const Canvas = () => {
  const viewRef = useRef<HTMLDivElement>(null);

  let cols: number, rows: number;
  const size = 20;

  // Flags to keep track of whether green and red have been placed
  let hasGreen = false;
  let hasRed = false;

  const c: (Color | null)[][] = []; // Initialize as a 2D array where cells can be null

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
        if (c[i][j]?.toString() === p5.color(0, 255, 0).toString())
          hasGreen = false;
        if (c[i][j]?.toString() === p5.color(255, 0, 0).toString())
          hasRed = false;
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

  return (
    <div>
      <div className='w-full flex flex-col justify-between bg-gray-50'>
        <div ref={viewRef} className='flex-grow'>
          <Sketch setup={setup as never} draw={draw as never} />
        </div>
      </div>
    </div>
  );
};

export default Canvas;
