import './Cell.scss'
import React from "react";
import { GridState } from './Grid';

enum Type {
    IDLE,
    ACTIVE,
    SOURCE,
    DESTINATION
}

type CellProps = {
    index: number,
    getGridData: () => GridState,
    updateGridData: (stateUpdate: object) => void
};

type CellState = {
    type: Type
}

const Text = [
    '',
    '',
    'SRC',
    'DEST',
    ''
]

class Cell extends React.Component<CellProps,CellState> {  
    constructor(props: CellProps) {
        super(props);
        this.state = {
            type: Cell.getCellType(props),
        }
        
        this.toggleType = this.toggleType.bind(this);
    }
    
    getNext(type: Type): number{
        let typeSize: number= Object.keys(Type).length/2;
        let typeIdx: number= type.valueOf();
        return (typeIdx + 1)%typeSize;
    }

    setSourceCell(): void{
        let gridData = this.props.getGridData();
        if (gridData.source >= 0) {
            const sourceCell = gridData.source;
            const actives = gridData.actives;
            
            this.props.updateGridData({
                actives: actives.add(sourceCell)
            })
        }
        if (gridData.destination === this.props.index) {
            this.props.updateGridData({
                destination: -1
            })
        }
        this.props.updateGridData({
            source: this.props.index
        })
    }

    setDestinationCell(): void{
        let gridData = this.props.getGridData();
        if (gridData.destination >= 0) {
            const destinationCell = gridData.destination;
            const actives = gridData.actives;
            
            this.props.updateGridData({
                actives: actives.add(destinationCell)
            })
        }
        if (gridData.source === this.props.index) {
            this.props.updateGridData({
                source: -1
            })
        }
        this.props.updateGridData({
            destination: this.props.index
        })
    }

    setActiveCell(): void{
        let gridData = this.props.getGridData();
        if (gridData.source === this.props.index) {
            this.props.updateGridData({
                source: -1
            })
        } else if (gridData.destination === this.props.index) {
            this.props.updateGridData({
                destination: -1
            })
        }
        console.log("actives: " + gridData.actives);
        
        console.log("set active: " + gridData.actives.add(this.props.index));
        
        this.props.updateGridData({
            actives: gridData.actives.add(this.props.index)
        })
    }

    setIdleCell(): void{
        let gridData = this.props.getGridData();
        if (gridData.source === this.props.index) {
            this.props.updateGridData({
                source: -1
            })
        } else if (gridData.destination === this.props.index) {
            this.props.updateGridData({
                destination: -1
            })
        }
        gridData.actives.delete(this.props.index);
        this.props.updateGridData({
            actives: gridData.actives
        })
    }


    toggleType() {
        let currentType = this.state.type;
        let newType = this.getNext(currentType); 

        console.log("toggleType: new type: " + newType);
        
        if(newType === Type.SOURCE) {
            this.setSourceCell();
        } else if (newType === Type.DESTINATION) {
            this.setDestinationCell();
        } else if (newType ===  Type.ACTIVE) {
            this.setActiveCell();
        } else {
            this.setIdleCell();
        }

        this.setState({
            type: newType
        });
    }

    static getCellType(props: CellProps): Type{
        const gridData = props.getGridData();
        if (gridData.source === props.index) {
            return Type.SOURCE;
        }
        if (gridData.destination === props.index) {
            return Type.DESTINATION;
        }
        if (gridData.actives.has(props.index)) {
            return Type.ACTIVE;
        }
        return Type.IDLE;
    }

    static getDerivedStateFromProps(props: Readonly<CellProps>, state: Readonly<CellState>) {
        const typeBasedOnGrid = Cell.getCellType(props);
        if (state.type !== typeBasedOnGrid) {
            // console.log("shouldupdate type mismatch " + props.index);
            return {
                type: typeBasedOnGrid
            };
        }
        return null;
    }
    
    render() {
        // console.log("rendering"  +  this.props.index);    
        // console.log(`Cell ${this.props.index} State: ${JSON.stringify(this.state)}`);
        // console.log(`Cell ${this.props.index} Props: ${JSON.stringify(this.props)}`)
        let type = this.state.type;
        return (
            <div id={`grid-cell-${this.props.index}`} 
                 data-index={this.props.index}
                 className={`grid-cell grid-cell-${Type[type].toLowerCase()}`}
                 onClick={this.toggleType}>
                    <span className="text">
                        {Text[type]}
                    </span>
            </div>
        )
    }
}

export {Cell, Type}
