import React, { Component } from 'react';

import '../../Styles/toast.scss'
import tickIcon from '../../Styles/tick.svg'
import warningIcon from '../../Styles/warning.svg'

class Toast extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            visible: false
        }
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.visible !== nextProps.visible) {
            this.setState({
                visible: nextProps.visible
            })
        }
    }

    getIcon() {
        switch (this.props.toastOption) {
            case 'warning': return warningIcon
            case 'success': return tickIcon
        }
    }

    render() {
        let classes = `toast ${this.props.toastOption} `
        classes += this.state.visible ? 'visible' : ''
        console.log(classes)
        return (
            <div className={classes}>
                <figure>
                    <img src={this.getIcon()} />
                </figure>
                <p>{this.props.message}</p>
            </div>
        )
    }





}

export default Toast;


