import React, { ReactElement } from "react";
import {Cell, Type} from './Cell.tsx'

type GridProps = {
    rows:number,
    cols: number
}

export type GridState = {
    source: number,
    destination: number,
    actives: Set<number>
}

class Grid extends React.Component<GridProps, GridState> {

    constructor(props: GridProps) {
        super(props);
        this.state = {
            source: -1,
            destination: -1,
            actives: new Set()
        }

        this.getGridData = this.getGridData.bind(this);
        this.dragSelectCells = this.dragSelectCells.bind(this);
        this.updateGridData = this.updateGridData.bind(this);
        window.addEventListener("pointermove", this.dragSelectCells);
    }

    shouldComponentUpdate(nextProps: Readonly<GridProps>, nextState: Readonly<{}>, nextContext: any): boolean {
        return true;
    }
    
    componentDidUpdate() {
        // console.log("Grid Updated");
    }

    getGridData(): any{
        return this.state;
    }

    dragSelectCells() {
        const dragArea = document.getElementById("drag-select-area");
        
        if (dragArea) {
            const cells = Array.from(document.getElementsByClassName("grid-cell"));
            let toUpdateState = false;
            const activeCells = this.state.actives;

            cells.forEach(cell => {
                const cellIdx: number = parseInt(cell.getAttribute("data-index") || "-1");
                const doesIntersect = this.doesCellIntersect(cell, dragArea);
                const isActive = activeCells.has(cellIdx);

                if ( doesIntersect && !isActive) {
                    toUpdateState = true;
                    activeCells.add(cellIdx);
                } else if (!doesIntersect && isActive){
                    toUpdateState = true;
                    activeCells.delete(cellIdx);
                }
            });

            if (toUpdateState) {
                this.updateGridData({
                    actives: activeCells
                })
            }
            // console.log(activeCells.length);
            
            // intersection criteria
        }
    }

    doesCellIntersect(cell: Element, dragArea: Element) {
        const cellBox = cell.getBoundingClientRect();
        const dragBox = dragArea.getBoundingClientRect();

        return (cellBox.left <= dragBox.right) &&
               (cellBox.right >= dragBox.left) &&
               (cellBox.top <= dragBox.bottom) &&
               (cellBox.bottom >= dragBox.top)
    }

    updateGridData(stateUpdate: object): void{
        // console.log("updateGridData:State Update: ");
        // console.log(stateUpdate);
        
        this.setState(stateUpdate);
        // console.log("updateGridData:Grid State: ");
        // console.log(this.state);   
    }
    
    
    render() {
        const rowCount:number = this.props.rows;
        const colCount:number = this.props.cols;
        const rows:Array<number> = Array.from({ length:rowCount }, (_, i) => i);
        const cols:Array<number> = Array.from({ length:colCount }, (_, i) => i);
        // console.log("render:Grid State: ");
        // console.log(this.state);
        
        return (
            <table>
                <tbody>
                    {rows.map((row) => 
                        <tr id={`row-${row}`}>
                            {cols.map((col) => {
                                let index = colCount*row + col;
                                return <td>
                                    <Cell updateGridData={this.updateGridData} 
                                          getGridData={this.getGridData}
                                          index={index}
                                          key={index}/>
                                </td>
                            }   
                            )}
                        </tr>
                    )}
                </tbody>
            </table>
        )
    }
}

export default Grid;