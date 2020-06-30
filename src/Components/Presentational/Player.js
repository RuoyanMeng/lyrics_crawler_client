import React, { Component } from 'react';
import '../../Styles/main.scss'


class Player extends Component {
    constructor(props) {
        super(props);

        this.state = {
            togglePlay: 0,
            currentTime: 0
        }

    }

    togglePlay = () => {

        if (this.state.togglePlay === 0) {
            this.setState({
                togglePlay: 1
            })
        } else {
            this.setState({
                togglePlay: 0
            })
        }
        this.props.player.togglePlay()
    }

    previousTrack = () => {
        this.props.player.previousTrack()
    }

    nextTrack = () => {
        this.props.player.nextTrack()
    }

    getPosition = () => {
        this.props.player.getCurrentState().then(state => {
            if (!state) {
                console.error('User is not playing music through the Web Playback SDK');
                return;
            }
            let position = Math.round((state.position / state.duration) * 1000);

            this.setState({
                currentTime: position,
                audioDuration: state.duration
            })

        })
    }
    handleMouseDown = () => {
        clearInterval(this.nIntervId);
        this.props.player.pause()
    }

    handleChange = (e) => {

        let value = e.currentTarget.value;
        this.setState({
            currentTime: value,
        })

    }

    handleMouseUp = () => {

        let debounceFn = this.debounce(this.seekPosition, 1000)
        debounceFn(this.state.currentTime);

    }

    seekPosition = (value) => {

        this.props.player.seek(Math.round(value * this.state.audioDuration / 1000)).then(() => {
            this.props.player.resume().then(() => {
                this.nIntervId = setInterval(() => this.getPosition(), 400)
            });
        });

    }

    debounce = (fn, delay) => {
        let timer;
        return function () {
            var _this = this;
            var args = arguments;
            if (timer) {
                clearTimeout(timer);
            }
            timer = setTimeout(function () {
                clearTimeout(timer);
                timer = null;
                fn.apply(_this, args);
            }, delay);
        };
    }



    componentDidMount() {

        this.nIntervId = setInterval(() => this.getPosition(), 400)

    }

    componentWillUnmount() {
        clearInterval(this.nIntervId);
    }




    render() {
        const { player } = this.props
        let togglePlayBtn = null;

        let previousBtn =
            <svg
                onClick={this.previousTrack}
                className="icon controlBtn"
                xmlns="http://www.w3.org/2000/svg"
                xmlnsXlink="http://www.w3.org/1999/xlink"
                viewBox="0 0 150 150"
                preserveAspectRatio="xMidYMin meet"
            >
                <path d="M 135.898438 0.0703125 C 132.84375 0.0703125 129.550781 1.324219 126.128906 3.683594 L 42.820312 61.078125 C 37.457031 64.769531 34.535156 69.742188 34.535156 75.078125 C 34.535156 80.414062 37.507812 85.386719 42.871094 89.082031 L 126.253906 146.433594 C 129.683594 148.792969 133.113281 150 136.164062 150 L 136.167969 150 C 139.4375 150 141.914062 148.660156 143.847656 146.058594 C 145.753906 143.484375 146.488281 139.832031 146.488281 135.414062 L 146.488281 14.742188 C 146.492188 5.695312 142.605469 0.0703125 135.898438 0.0703125 Z M 135.898438 0.0703125 " />
                <path d="M 16.140625 0.0117188 L 12.125 0 C 7.605469 0 3.511719 3.679688 3.511719 8.207031 L 3.511719 141.761719 C 3.511719 146.285156 7.46875 150 11.992188 150 L 12.132812 150 L 16.066406 149.976562 C 20.589844 149.976562 24.605469 146.28125 24.605469 141.757812 L 24.605469 8.214844 C 24.605469 3.691406 20.660156 0.0117188 16.140625 0.0117188 Z M 16.140625 0.0117188 " />
            </svg>

        let onBtn =
            <svg
                onClick={this.togglePlay}
                className='w2 icon'
                xmlns="http://www.w3.org/2000/svg"
                xmlnsXlink="http://www.w3.org/1999/xlink"
                xmlSpace="preserve"
                viewBox="0 0 50 50"
                preserveAspectRatio="xMidYMin meet"
            >
                <path d="M 24.980469 0 C 11.203125 0 0 11.203125 0 24.980469 C 0 38.75 11.203125 49.957031 24.980469 49.957031 C 38.75 49.957031 49.957031 38.75 49.957031 24.980469 C 49.957031 11.203125 38.75 0 24.980469 0 Z M 21.195312 34.058594 C 21.195312 35.316406 20.175781 36.332031 18.921875 36.332031 C 17.667969 36.332031 16.652344 35.316406 16.652344 34.058594 L 16.652344 15.894531 C 16.652344 14.640625 17.667969 13.625 18.921875 13.625 C 20.175781 13.625 21.195312 14.640625 21.195312 15.894531 Z M 33.304688 34.058594 C 33.304688 35.316406 32.289062 36.332031 31.03125 36.332031 C 29.78125 36.332031 28.761719 35.316406 28.761719 34.058594 L 28.761719 15.894531 C 28.761719 14.640625 29.78125 13.625 31.03125 13.625 C 32.289062 13.625 33.304688 14.640625 33.304688 15.894531 Z M 33.304688 34.058594 " />

            </svg>

        let pauseBtn =
            <svg className='icon w2'
                onClick={this.togglePlay}
                xmlns="http://www.w3.org/2000/svg"
                xmlnsXlink="http://www.w3.org/1999/xlink"
                xmlSpace="preserve"
                viewBox="0 0 150 150"
                preserveAspectRatio="xMidYMin meet">
                <g id="surface1">
                    <path d="M 75 0 C 33.644531 0 0 33.644531 0 75 C 0 116.355469 33.644531 150 75 150 C 116.355469 150 150 116.355469 150 75 C 150 33.644531 116.355469 0 75 0 Z M 112.25 80.78125 L 63.160156 111.464844 C 62.054688 112.152344 60.800781 112.5 59.546875 112.5 C 58.410156 112.5 57.269531 112.214844 56.238281 111.644531 C 54.074219 110.441406 52.726562 108.160156 52.726562 105.683594 L 52.726562 44.316406 C 52.726562 41.839844 54.074219 39.554688 56.238281 38.355469 C 58.410156 37.152344 61.058594 37.222656 63.160156 38.535156 L 112.25 69.21875 C 114.242188 70.464844 115.453125 72.648438 115.453125 75 C 115.453125 77.351562 114.242188 79.535156 112.25 80.78125 Z M 112.25 80.78125 " />
                </g>
            </svg>

        let nextBtn =
            <svg
                onClick={this.nextTrack}
                className='icon controlBtn'
                xmlns="http://www.w3.org/2000/svg"
                xmlnsXlink="http://www.w3.org/1999/xlink"
                xmlSpace="preserve"
                viewBox="0 0 150 150"
                preserveAspectRatio="xMidYMin meet"

            >
                <path d="M 108.121094 61.042969 L 24.730469 3.683594 C 21.304688 1.320312 17.742188 0.0742188 14.691406 0.0742188 C 7.992188 0.0742188 3.550781 5.695312 3.550781 14.734375 L 3.550781 135.34375 C 3.550781 139.757812 4.835938 143.449219 6.738281 146.019531 C 8.671875 148.621094 11.695312 150 14.964844 150 C 18.011719 150 21.4375 148.75 24.859375 146.390625 L 108.175781 89.03125 C 113.535156 85.339844 116.46875 80.371094 116.46875 75.035156 C 116.46875 69.703125 113.488281 64.734375 108.121094 61.042969 Z M 108.121094 61.042969 " />
                <path d="M 138.410156 0 L 134.960938 0.0078125 C 130.449219 0.0078125 126.539062 3.6875 126.539062 8.210938 L 126.539062 141.675781 C 126.539062 146.199219 130.382812 149.914062 134.902344 149.914062 L 138.566406 149.960938 C 143.0625 149.9375 146.449219 146.191406 146.449219 141.683594 L 146.449219 8.199219 C 146.449219 3.679688 142.925781 0 138.410156 0 Z M 138.410156 0 " />
            </svg>


        if (this.state.togglePlay == 0) {
            togglePlayBtn = onBtn
        } else {
            togglePlayBtn = pauseBtn
        }

        //progress-bar







        return (
            <div className='player'>
                <div className="flex justify-around footer">
                    <div className="w-25 pa4  " >
                        {previousBtn}
                    </div>
                    <div className="w-25 pa4 " >
                        {togglePlayBtn}
                    </div>
                    <div className="w-25 pa4 " >
                        {nextBtn}
                    </div>
                </div>
                <div className="progress-bar flex justify-around">
                    <input type="range" min="0" max="1000" 
                    value={this.state.currentTime} 
                    onTouchEnd = {this.handleMouseUp}
                    onTouchStart = {this.handleMouseDown} 
                    onMouseUp={this.handleMouseUp} 
                    onMouseDown={this.handleMouseDown} 
                    onInput={this.handleChange} 
                    step="any" ></input>
                </div>
            </div>


        )

    }





}

export default Player;