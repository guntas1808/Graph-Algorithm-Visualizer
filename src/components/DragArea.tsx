import React from "react";
import { createRoot, Root } from 'react-dom/client';

type DragAreaProps = {
    x: number,
    y: number,
    root: Root
}

type DragAreaState = {
    width: number,
    height: number,
    x: number,
    y: number,
}

class DragArea extends React.Component<DragAreaProps, DragAreaState> {
    constructor(props: DragAreaProps) {
        super(props);
        this.state = {
            height: 0,
            width: 0,
            x: props.x,
            y: props.y
        };

        this.resize = this.resize.bind(this);
        this.clear = this.clear.bind(this);
        window.addEventListener("pointermove", this.resize);
        window.addEventListener("pointerup", this.clear);
        // console.log("creating drag area");
    }

    resize(event: PointerEvent) {
        let x = event.pageX;
        let y = event.pageY;
        let diffX = x - this.props.x;
        let diffY = y - this.props.y;

        let left = diffX > 0 ? this.props.x : x;
        let top = diffY > 0 ? this.props.y : y;
        // console.log({
        //     pageX: x,
        //     pageY: y,
        //     diffX: diffX,
        //     diffY: diffY
        // })
        // console.log(this.state);

        this.setState({
            height: Math.abs(diffY),
            width: Math.abs(diffX),
            x: left,
            y: top
        });
    }

    clear(event: PointerEvent) {
        // console.log("destroying dragarea");
        
        window.removeEventListener("pointermove", this.resize);
        window.removeEventListener("pointerup", this.clear);
        this.props.root.unmount();
    }

    render () {
        return <div id="drag-select-area"
                    className="drag-area" 
                    style={{
                        left: this.state.x + "px",
                        top: this.state.y + "px",
                        height: this.state.height + "px",
                        width: this.state.width + "px"
                    }}>
                </div>
    }
}

const createDragArea = async function (event: PointerEvent) {
    event.preventDefault();
    const x = event.pageX;
    const y = event.pageY;
    const container = document.getElementById("drag-area-container");

    if (container) {
        const root = createRoot(container);

        const dragArea = <DragArea x={x} y={y} root={root}></DragArea>;
        root.render(dragArea);
    }
}

export default createDragArea
