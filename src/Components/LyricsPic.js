import React, { Component } from "react";
import { Link } from "react-router-dom";

import '../Styles/lyricsPic.scss'
class LyricsPic extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dimensions: null,
        };
    }

    componentDidMount() {
        this.setState({
            dimensions: {
                width: this.card.offsetWidth,
                height: this.card.offsetHeight,
            },
        });
    }

    download_img = (el) => {
        var canvas = document.getElementById('canvas');
        var image = canvas.toDataURL("image/jpg");
        el.target.href = image;
    };

    render() {
        //const data = this.props.location.data
        const { dimensions } = this.state;
        let svg = null
        let picCanvs = null;

        let data = {
            image: 'https://i.scdn.co/image/ab67616d00001e02cb4ec52c48a6b071ed2ab6bc',
            name: "Gangsta",
            artists: "Kehlani",
            choosenLyr: ["I need a gangsta", "To love me better", "Than all the others do", "To always forgive me", "Ride or die with me", "That's just what gangsters do"],
            spotifyUrl: "https://open.spotify.com/track/1W7zkKgRv9mrLbfdQ8XyH3"
        };

        console.log(dimensions);

        let lyrics =
            <div className='lyrics'>
                {data.choosenLyr.map((item, index) => {
                    return (
                        <span key={index}>
                            {item}
                            <br />
                        </span>
                    )
                })} </div>

        let card =
            <div className='card' id='card' xmlns="http://www.w3.org/1999/xhtml" ref={el => { this.card = el }}>
                <img src={data.image} className="image" />
                {lyrics}
                <h5 className='song-info'>{data.name}</h5>
                <h5 className='song-info'>{data.artists}</h5>
            </div>

        if (dimensions) {

            console.log("ok")

            this.canvas.width = dimensions.width;
            this.canvas.height = dimensions.height;
            this.canvas.style.width = dimensions.width + "px";
            this.canvas.style.height = dimensions.height + "px";
            var ctx = this.canvas.getContext('2d')

            var getPixelRatio = function (context) {
                var backingStore = context.backingStorePixelRatio ||
                    context.webkitBackingStorePixelRatio ||
                    context.mozBackingStorePixelRatio ||
                    context.msBackingStorePixelRatio ||
                    context.oBackingStorePixelRatio ||
                    context.backingStorePixelRatio || 1;
                return (window.devicePixelRatio || 1) / backingStore;
            };
            var ratio = getPixelRatio(ctx);
            this.canvas.width = dimensions.width * ratio;
            this.canvas.height = dimensions.height * ratio;

            var ctx = this.canvas.getContext('2d')
            ctx.scale(ratio, ratio)

            ctx.fillStyle = "black";
            ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

            var imageObj = new Image();
            imageObj.crossOrigin = "anonymous";
            imageObj.onload = () => {
                ctx.drawImage(imageObj, 15, 15, 250, 250 * imageObj.height / imageObj.width);
            }
            imageObj.src = "https://cors-anywhere.herokuapp.com/" + data.image;

            //!!!!!!!importent, need write method for canvas line breaker.
            document.fonts.ready.then(() => {
                ctx.font = '13px "Roboto Mono"';
                ctx.fillStyle = "#fff";
                let currentHeight = 277;
                data.choosenLyr.map((item, index) => {
                    currentHeight = currentHeight + 16
                    ctx.fillText(item, 15, currentHeight, 250)
                });
                ctx.textAlign = "right";
                ctx.fillText(data.name, 265, currentHeight + 24, 250);
                ctx.fillText(data.artists, 265, currentHeight + 24 + 17, 250)
            })

            var canvas = document.getElementById('canvas');

            console.log(canvas.width)

        }





        return (
            <div className='background' >
                {card}
                <canvas id="canvas" className="canvas-poster-hidca" ref={el => { this.canvas = el }} style={{ display: 'block' }}></canvas>
                <a id="download" download='pic.png' onClick={el=>this.download_img(el)} className="f6 link dim br3 ba bw1 ph3 pv2 mb2 dib white mb4 mh3 mt4">Download Lyrics Pic</a>
            </div>
        )
    }

}


export default LyricsPic;


