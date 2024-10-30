import Canvas from './components/canvases';

export default function Home() {
  return (
    <div className='grid grid-cols-2'>
        <Canvas algo='dfs'/>
        <Canvas algo='bfs'/>
        <Canvas algo='astar'/>
        <Canvas algo='ucs'/>
    </div>
  );
}
