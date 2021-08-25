/**
 * Author: Arshia Mathur
 */

import React from 'react';
import { Grid } from 'semantic-ui-react';
import "./Board.css";
import Piece from './Piece';


class Board extends React.Component {


    constructor(props) {
        super(props);
        this.state = { arr: props.arr, clickable: props.clickable };

    }
    onDragOver = (ev) => {

        ev.preventDefault();

    }
    /**
     * onDrop is called when a player drops a piece on a valid square. 
     * @param {*} ev 
     * @param {*} word 
     */
    onDrop = (ev) => {

        ev.preventDefault();
        if (this.props.clickable) {

            const dataID = ev.dataTransfer.getData("text");
            const currentID = ev.target.id;
            const temp = this.props.arr;
            for (var i = 0; i < 64; i++) {
                if (temp[i].type === Piece && temp[i].props.id === dataID) {

                    //Moves takes in a fromId, toId and ClearID,  this clear id is used to erase the pink divs that are to identify available moves
                    var clear;
                    var difference = i - currentID;
                    if (difference === 7) {
                        clear = 9;
                    }
                    else if (difference === 9) {
                        clear = 7;
                    }

                    //Prevents user from being able to drag piece to improper locations
                    if ((difference === 9 || difference === 7) && temp[currentID].type !== Piece) {
                        this.props.playerMoved(i, currentID, i - clear);
                    }

                }
            }


        }


    }
    /**
     * generateColumns populates the grid with columns, there can be a maximum of 8 columns per row, each box displays an element of 
     * the pieces array in the parent component final.js
     * @returns columns: array of columns with values
     */
    generateColumns = () => {
        const columns = [];

        let check = true;
        for (let i = 0; i < 64; i++) {

            if (i > 0 && i % 8 === 0) {
                check = !check;
            }
            var id = "id" + i;
            if (check) {
                columns.push(<Grid.Column className="box1" style={{ width: "70px", height: "70px", margin: "2px", background: "#CDCDCD", }} onDragOver={e => this.onDragOver(e)} onDrop={e => this.onDrop(e)} id={id} key={id}>
                    {this.props.arr[i]}
                </Grid.Column>);

            }
            else {

                columns.push(<Grid.Column className="box2" style={{ width: "70px", height: "70px", margin: "2px", border: "1px solid #CDCDCD", background: "white", }} id={id} key={id} >
                    {this.props.arr[i]}
                </Grid.Column>);

            }
            check = !check;
        }

        return columns;
    }

    render() {
        return (
            <div className="board">
                <Grid celled="internally" divided columns={8} >
                    {this.generateColumns()}

                </Grid>


            </div>
        )

    }

}

export default Board;


