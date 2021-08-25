/**
 * Author: Arshia Mathur
 */

import React from "react";
import { Button, Header } from "semantic-ui-react";
import './Final.css';
import Piece from './Piece';
import Board from './Board';

const RED = "red";
const BLACK = "black";
class Final extends React.Component {

    /**
     * Contructor function set initial states
     * @param {*} props 
     * player: true if player's turn, false if computer's turn
     * pieces: An array of the whole board, length 64
     * deletedBlack: keeps track of number of black pieces deleted
     * deletedRed: keeps track of number of red pieces deleted
     * currentSelect: index and id of currently selected piece
     * clickable: true if no kill move is present, false otherwise
     * mmoves: list of completed moves
     * killed: Keeps track of if a kill move has just occured
     */
    constructor(props) {
        super(props);
        this.state = { player: true, pieces: [], deletedBlack: 0, deletedRed: 0, currentSelect: [], clickable: true, moves: [], killed: false };
        this.playerHandler = this.playerHandler.bind(this);
        this.playerMoved = this.playerMoved.bind(this);

    }

    /**
     * If piece is no longer selected or hovered over, this function will remove the future path for the piece
     * @param {*} info 
     */
    notSelected = (info) => {
        const id = info[0];
        const index = info[1];
        const temp = this.state.pieces;
        const topRight = index - 7;
        const topLeft = index - 9;
        if (temp[topRight]!=null && temp[topRight].type === "div") {
            temp[topRight] = "";
        }
        if (temp[topLeft]!= null && temp[topLeft].type === "div") {
            temp[topLeft] = "";
        }
        this.setState({ pieces: temp });

    }
    /**
     * playerHandler is triggered when a piece is clicked or hovered over, it displays the piece's next possible moves
     * @param {*} ev 
     */
    playerHandler = (ev) => {
        if (this.state.player && this.state.clickable) {
            const oldSelect = this.state.currentSelect;
            if (oldSelect.length > 0) {//if there is a selected piece in current select, not selected is called to remove 
                this.notSelected(oldSelect);
            }

            var currentID = ev.target.id;
            var temp = this.state.pieces;

            var found = false;
            var i = 0;
            while (!found && i < 64) {
                if (this.state.pieces[i] !== "" && this.state.pieces[i].props.id === currentID) {
                    found = true;
                }
                else {
                    i++;
                }
            }

            const topRight = i - 7;
            const topLeft = i - 9;
            if ((i + 1) % 8 !== 0 && temp[topRight] === "") {
                const id = topRight;
                temp[topRight] = <div className="openSpace" id={id} onClick={e => this.playerMoved(i, topRight, topLeft)}></div>;
            }
            if ((i) % 8 !== 0 && temp[topLeft] === "") {
                const id = topLeft;
                temp[topLeft] = <div className="openSpace" id={id} onClick={e => this.playerMoved(i, topLeft, topRight)}></div>;
            }

            this.setState({ pieces: temp, currentSelect: [currentID, i] });


        }

    }
    /**
     * PlayerModev is called when a player click on an open block or drop a piece onto an open block on the board. The pieces array is updated
     * @param {*} fromIndex 
     * @param {*} toIndex 
     * @param {*} clearIndex 
     */
    playerMoved = (fromIndex, toIndex, clearIndex) => {

        var temp = this.state.pieces;
        const tempMoves = this.state.moves;
        //only push to revert array if not killed
        if (!this.state.killed) {
            tempMoves.push([fromIndex, toIndex]);
        }
        //reasign array values
        temp[toIndex] = temp[fromIndex];
        temp[fromIndex] = "";
        if (temp[clearIndex].type !== Piece || !temp[clearIndex].props.id.includes(RED)) {
            temp[clearIndex] = "";
        }

        ///reasign to computer player
        var newPlayer = !this.state.player;
        this.setState({ player: newPlayer, pieces: temp, currentSelect: [], clickable: true, moves: tempMoves, killed: false });

        //comp makes move after 2 seconds
        if (newPlayer === false) {
            setTimeout(() => { this.compHandler(); }, 2000);

        }

    }
    /**
     * compHandler is called when player == false.  This function identifies any available moves and calls compMover with the indices of the moveable pieces
     */

    compHandler = async () => {
        this.setState({ player: true });

        const jumped = this.compJump(BLACK);
        if (!jumped) {
            var movable = false;
            var i = 0;
            var bottomLeft;
            var bottomRight;
            while (!movable && i < 56) {
                bottomLeft = i + 7;
                bottomRight = i + 9;
                if (this.state.pieces[i] !== "" && this.state.pieces[i].props.id.includes(BLACK)) {
                    if (i % 8 !== 0 && this.state.pieces[bottomLeft] === "") {
                        await this.compMover(i, bottomLeft);
                        movable = true;
                    }
                    else if ((i + 1) % 8 !== 0 && this.state.pieces[bottomRight] === "") {
                        await this.compMover(i, bottomRight);
                        movable = true;
                    }
                }

                i++;

            }
        }
        this.playerJump(RED);
    }

    /**
     * CompMover is called when the computer has an available move to make. Its assigns value at fromIndex to value at ToIndex in the pieces array
     * @param {*} fromIndex 
     * @param {*} toIndex 
     */
    compMover = async (fromIndex, toIndex) => {

        var temp = this.state.pieces;
        const tempMoves = this.state.moves;
        //only assign non kills to moves array
        if (!this.state.killed) {
            tempMoves.push([fromIndex, toIndex]);
        }

        temp[toIndex] = temp[fromIndex];
        temp[fromIndex] = "";
        this.setState({ player: true, pieces: temp, moves: tempMoves, killed: false });
    }

    /**
     * PlayerJump checks to see if the player has any possible jump moves. If it does, it sets killed to equal true and therefore player has no choice except to complete
     * the jump move
     * @param {*} colour 
     * @returns 
     */
    playerJump = (colour) => {
        const temp = this.state.pieces;
        var topRightJump;
        var topRightMoveTo;
        var topLeftJump;
        var topLeftMoveTo;
        for (var i = 16; i < 64; i++) {
            topRightJump = i - 7;
            topRightMoveTo = i - 14;
            topLeftJump = i - 9;
            topLeftMoveTo = i - 18;
            if (temp[i] !== "" && temp[i].props.id.includes(colour)) {
                if (this.checkForSide(topRightJump) && temp[topRightJump] !== "" && !temp[topRightJump].props.id.includes(colour) && temp[topRightMoveTo] === "") {
                    temp[topRightMoveTo] = <div className="openSpace" onClick={e => this.playerMoved(i, topRightMoveTo, topRightJump)}></div>;
                    this.setState({ pieces: temp, deletedBlack: this.state.deletedBlack + 1, clickable: false, moves: [], killed: true });

                    break;
                }

                else if (this.checkForSide(topLeftJump) && temp[topLeftJump] !== "" && !temp[topLeftJump].props.id.includes(colour) && temp[topLeftMoveTo] === "") {
                    temp[topLeftMoveTo] = <div className="openSpace" onClick={e => this.playerMoved(i, topLeftMoveTo, topLeftJump)}></div>;
                    this.setState({ pieces: temp, deletedBlack: this.state.deletedBlack + 1, clickable: false, moves: [], killed: true });
                    break;

                }
            }
        }
        return;

    }

    /**
     * compJump Checks to see if computer is able to make a jump move. Returns true if possible and false otherwise. If true then computer is forced to make the jump move
     * @param {*} colour 
     * @returns 
     */
    compJump = (colour) => {
        const temp = this.state.pieces

        var bottomLeftJump;
        var bottomLeftMoveTo;
        var bottomRightJump;
        var bottomRightMoveTo;

        for (var i = 0; i < 48; i++) {
            bottomLeftJump = i + 7;
            bottomLeftMoveTo = i + 14;
            bottomRightJump = i + 9;
            bottomRightMoveTo = i + 18;

            if (temp[i] !== "" && temp[i].props.id.includes(colour)) {
                if (this.checkForSide(bottomLeftJump) && temp[bottomLeftJump] !== "" && !temp[bottomLeftJump].props.id.includes(colour) && temp[bottomLeftMoveTo] === "") {
                    this.compMover(i, bottomLeftMoveTo);
                    temp[bottomLeftJump] = "";
                    this.setState({ pieces: temp, deletedRed: this.state.deletedRed + 1, moves: [], killed: true });

                    return true;
                }

                else if (this.checkForSide(bottomRightJump) && temp[bottomRightJump] !== "" && !temp[bottomRightJump].props.id.includes(colour) && temp[bottomRightMoveTo] === "") {
                    this.compMover(i, bottomRightMoveTo);
                    temp[bottomRightJump] = "";
                    this.setState({ pieces: temp, deletedRed: this.state.deletedRed + 1, moves: [], killed: true });

                    return true;

                }
            }
        }
        return false;

    }

    /**
     * checkforSide checks to see if index is a side piece, it will be either a multiple of 8 or a multiple of 8 subtract 1 since the array starts at 0
     * @param {*} index 
     * @returns 
     */
    checkForSide = (index) => {
        if (index % 8 !== 0 && (index + 1) % 8 !== 0) {
            return true;
        }
        return false;

    }

    /**
     * This function allows the player to revert their last move on their turn. 
     */
    revertMove = () => {
        if (this.state.player) {

            const tempPieces = this.state.pieces;
            const tempMoves = this.state.moves;
            if (tempMoves.length >= 2) {

                const compMove = tempMoves.pop();
                tempPieces[compMove[0]] = tempPieces[compMove[1]];
                tempPieces[compMove[1]] = "";
                const playerMove = tempMoves.pop();
                tempPieces[playerMove[0]] = tempPieces[playerMove[1]];
                tempPieces[playerMove[1]] = "";
                this.setState({ pieces: tempPieces });
            }

        }

    }

    /**
     * CreatePieces is the onclick to the start button. It renders all of the game pieces. 
     * Pieces have different attributes based on if they are black(computer) or red(player)
     */
    createPieces = () => {
        const pieces = [];
        const grid = [['black', ' ', 'black', ' ', 'black', '', 'black', ''], ['', 'black', '', 'black', '', 'black', '', 'black'], ['black', '', 'black', '', 'black', '', 'black', ''],
        ['', '', '', '', '', '', '', ''], ['', '', '', '', '', '', '', ''],
        ['', 'red', '', 'red', '', 'red', '', 'red'], ['red', '', 'red', '', 'red', '', 'red', ''], ['', 'red', '', 'red', '', 'red', '', 'red']
        ];

        for (var i = 0; i < 8; i++) {
            for (var j = 0; j < 8; j++) {
                var id = grid[i][j] + (i * 8 + j);
                if (grid[i][j] === "black") {
                    pieces.push(
                        <Piece id={id} colour={"#808080"} > </Piece>
                    );
                }
                else if (grid[i][j] === "red") {
                    pieces.push(
                        <Piece id={id} colour={"#E26B6B"} clickable={true} handler={this.playerHandler}> </Piece>
                    );
                }
                else {
                    pieces.push("");
                }
            }
        }

        this.setState({ pieces: pieces });
    }

    render() {
        return (
            <div className="game">
                <Header >Welcome to Checkers!</Header>
                <Header> Black Pieces Jumped: {this.state.deletedBlack}    Red Pieces Jumped: {this.state.deletedRed}</Header>
                <Board clickable={this.state.clickable} arr={this.state.pieces} playerMoved={this.playerMoved}></Board>

                <Button onClick={e => { this.createPieces() }}> START</Button>
                <Button onClick={e => { this.revertMove() }}>Revert Move</Button>

            </div>

        )
    }
}

export default Final;