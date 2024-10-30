import SearchInterface from "./search-interface";
import p5, { Color } from 'p5/index';


export default abstract class SearchTemplate implements SearchInterface{
    c: (Color | null)[][] = [];
    visited: boolean[][] = [];
    finalPath: {row: number, col: number}[] = [];
    finished: boolean;

    p5: p5;
    windowWidth: number;
    windowHeight: number;
    speed: number;
    time: Date;
    finishTime: Date;

    constructor(p5: p5, windowWidth: number, windowHeight: number){
        this.p5 = p5;
        this.windowWidth = windowWidth;
        this.windowHeight = windowHeight;
        this.speed = 1;
        this.time = new Date();
        this.finishTime = new Date();
        this.finished = false;
    }

    run(c: (p5.Color | null)[][]): void{
        this.c = c;
        this.visited = Array(c.length).fill(null).map(() => Array(c[0].length).fill(false));
        this.finalPath = [];
        this.finished = false;
        this.time = new Date();
        this.finishTime = new Date();
    }

    activateCheck(): void{
        this.time = new Date();
    }

    deactivateCheck(): void{
        this.finishTime = new Date();
    }

    setSpeed(speed: number): void{
        this.speed = speed;
    }

    markVisited(row: number, col: number): void{
        this.visited[row][col] = true;
    }

    addToFinalPath(row: number, col: number): void{
        this.finalPath.push({row: row, col: col});
    }

    colorFinalPath(): void{
        for(let i = 0; i < this.finalPath.length; i++){
            const row = this.finalPath[i].row;
            const col = this.finalPath[i].col;
            this.c[row][col] = this.p5.color(255, 0, 0);
        }
    }

    abstract check(): void;
    abstract draw(): void;

}