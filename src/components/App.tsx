import Grid from './Grid'
import createDragArea from './DragArea'
import './App.css'

function App() {
  document.addEventListener("pointerdown", createDragArea);
  return (
    <>
      <div id="drag-area-container"></div>
      <Grid rows={20} cols={20}/>
      <button>
        Run Dijkstras
      </button>
    </>
  )
}

export default App
