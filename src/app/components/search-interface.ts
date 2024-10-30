import p5, { Color } from 'p5/index';


export default interface SearchInterface {
    c: (Color | null)[][];
    visited: boolean[][];
    finalPath: {row: number, col: number}[];
    finished: boolean;

    p5: p5;
    windowWidth: number;
    windowHeight: number;
    speed: number;
    time: Date;
    finishTime: Date;

    run(c: (Color | null)[][]): void;
    activateCheck(): void;
    deactivateCheck(): void;
    
    setSpeed(speed: number): void;
    markVisited(row: number, col: number): void;
    addToFinalPath(row: number, col: number): void;
    colorFinalPath(): void;
}