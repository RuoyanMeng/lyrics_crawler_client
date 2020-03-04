import React, { Component } from 'react';

import '../../Styles/selector.scss'

class Selector extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            active:false
        }
    }

    clickHandler = () =>{
        let active = !this.state.active;
        this.setState({
            active: active
        })
        this.props.choosenLyrics(this.props.lyrics,active)
    }

    render() {
        return (
                <p className={this.state.active ? 'active' : ''} onClick={this.clickHandler}>
                    {this.props.lyrics}
                </p>
        )
    }
};

export default Selector;