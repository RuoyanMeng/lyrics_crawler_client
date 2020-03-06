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
        if(this.props.location.data){
            this.setState({
                dimensions: {
                    width: this.card.offsetWidth,
                    height: this.card.offsetHeight,
                },
            });
        }
    }

    download_img = (el) => {
        let time = new Date().getTime()
        var canvas = document.getElementById('canvas');
        var image = canvas.toDataURL("image/jpg");
        el.target.download = this.props.location.data.name + "_"+ time + ".png"
        //el.target.download = "_"+ time + ".png"
        el.target.href = image;
    };

    goBack(e) {
        e.preventDefault();
        this.props.history.goBack();
    }

    render() {
        const data = this.props.location.data
        
        const { dimensions } = this.state;
        console.log(dimensions)
        let card =null;
        let downloadBtn = null;

        // let data = {
        //     image: "https://i.scdn.co/image/ab67616d0000b273445f0f337a07012336328ea0",
        //     name: "Gangsta",
        //     artists: "Kehlani",
        //     choosenLyr: ["I need a gangsta, to love me better", "Than all the others do, That's just what gangsters do", "To always forgive me", "Ride or die with me", "That's just what gangsters do"],
        //     spotifyUrl: "https://open.spotify.com/track/1W7zkKgRv9mrLbfdQ8XyH3"
        // };
        
        if(data){
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

        card =
            <div className='card' id='card' xmlns="http://www.w3.org/1999/xhtml" ref={el => { this.card = el }}>
                <img src={data.image} className="image" />
                {lyrics}
                <h5 className='song-info'>{data.name}</h5>
                <h5 className='song-info'>{data.artists}</h5>
            </div>

        downloadBtn = <a id="download"  onClick={el=>this.download_img(el)} className="f6 link dim br3 ba bw1 ph3 pv2 mb2 dib white mb4 mh3 mt4">Download Lyrics Pic</a>
        }else{

        }
        
        if (dimensions) {

            this.canvas.width = dimensions.width*2;
            this.canvas.height = dimensions.height*2;
            this.canvas.style.width = dimensions.width*2 + "px";
            this.canvas.style.height = dimensions.height*2 + "px";
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

            this.canvas.width = dimensions.width * ratio *2;
            this.canvas.height = dimensions.height * ratio *2;
            this.canvas.style.width = dimensions.width *2+ "px";
            this.canvas.style.height = dimensions.height *2+ "px";

            var ctx = this.canvas.getContext('2d')
            ctx.scale(ratio, ratio)

            ctx.fillStyle = "black";
            ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

            let padding = 30;
            let imageSize = 500;

            //load image
            var imageObj = new Image();
            imageObj.crossOrigin = "anonymous";
            imageObj.onload = () => {
                ctx.drawImage(imageObj, padding, padding, imageSize, imageSize * imageObj.height / imageObj.width);
            }
            imageObj.src = "https://cors-anywhere.herokuapp.com/" + data.image;

            //line breaker.
            document.fonts.ready.then(() => {
                ctx.font = '26px "Roboto Mono"';
                ctx.fillStyle = "#fff";
                let currentHeight = imageSize+padding+21;
                data.choosenLyr.map((item, index) => {

                    

                    let lyricsWidth = Math.round(ctx.measureText(item).width);

                    if (lyricsWidth>=imageSize){
                        let itemWordNum = item.split(" ").length
                        while (item!==""){
                            let wordNum = Math.round(imageSize/lyricsWidth*item.split(" ").length);
                            if(wordNum >= itemWordNum){
                                currentHeight = currentHeight + 33;
                                ctx.fillText(item, padding, currentHeight, imageSize);
                                item = "";
                                break
                            }else{
                                currentHeight = currentHeight + 33;
                                let newline = item.split(" ").slice(0,wordNum).join(" ");
                                ctx.fillText(newline, padding, currentHeight, imageSize);
                                item = item.split(" ").slice(wordNum, lyricsWidth).join(" ");
                                lyricsWidth = Math.round(ctx.measureText(item).width);
                            }
                        }
                    }else{
                        currentHeight = currentHeight + 33;
                        ctx.fillText(item, padding, currentHeight, imageSize)
                    }


                });
                ctx.textAlign = "right";
                ctx.font = '23px "Roboto Mono"';
                ctx.fillText(data.name, imageSize+padding, dimensions.height *2 - 60, imageSize);
                ctx.fillText(data.artists, imageSize+padding , dimensions.height *2 - 30, imageSize)
            })

            

        }





        return (
            <div className='background' >
                {card}
                <canvas id="canvas" className="canvas-poster-hidca" ref={el => { this.canvas = el }} style={{ display: 'none' }}></canvas>
                {downloadBtn}
                <a className="f6 link dim br3 ba ph3 pv2 mb2 dib white mb4 mh3 mt4" onClick={e => { this.goBack(e) }}> &lt;-- Back</a>

            </div>
        )
    }

}


export default LyricsPic;


