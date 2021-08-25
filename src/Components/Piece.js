/**
 * Author: Arshia Mathur
 */


import React from "react";

const RED = "red";

class Piece extends React.Component {
    constructor(props) {
        super(props);
        this.state = { id: props.id, colour: props.colour, clickable: props.clickable };
    }



    /**
     * OnDragStart takes in an event and an id, and displays path for piece to move to once it is being dragged
     * @param {*} ev 
     * @param {*} id 
     */
    onDragStart = (ev, id) => {

        ev.dataTransfer.setData("text/plain", id);
        if (ev.target.id.includes(RED)) {
            this.props.handler(ev);
        }


    }
    /**If piece is red, then shows corresponding path that it can go */
    mouseover = (ev) => {
        if (ev.target.id.includes(RED)) {
            this.props.handler(ev);
        }

    }

    render() {
        const styling = {
            height: 44,
            width: 44,
            borderRadius: 22,
            backgroundColor: this.state.colour,
            pointerevents: "auto",

        }
        return (

            <div id={this.state.id} onMouseOver={e => { this.mouseover(e) }} draggable={this.state.colour === "#808080" ? false : true} onDragStart={e => this.onDragStart(e, this.state.id)}
                style={styling} onClick={this.props.handler}></div>


        )
    }
}


export default Piece;