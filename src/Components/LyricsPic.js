import React, { Component } from "react";
import { Link } from "react-router-dom";
import Cropper from 'react-cropper'
import 'cropperjs/dist/cropper.css'

import '../Styles/lyricsPic.scss'
import editSvg from "../Styles/edit.svg"
import Modal from './Presentational/Modal'


const MAX_FILE_SIZE = 5 * 1024 * 1024

class LyricsPic extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dimensions: null,
            src: null,
            classModalFile: null,
            classResultImgUrl: null,
            isModalOpen: false,
            image:null
        };
    }

    componentDidMount() {
        if (this.props.location.data) {
            this.setState({
                dimensions: {
                    width: this.card.offsetWidth,
                    height: this.card.offsetHeight,
                },
                image:this.props.location.data.image
            });
        }
    }

    download_img = (el) => {
        let time = new Date().getTime()
        var canvas = document.getElementById('canvas');
        var image = canvas.toDataURL("image/jpg");
        var strDataURI = image.substr(22, image.length);
        var blob = this.dataURLtoBlob(image);
        var objurl = URL.createObjectURL(blob);
        el.target.download = this.props.location.data.name + "_" + time + ".png"
        el.target.href = objurl;
    };


    dataURLtoBlob = (dataurl) => {
        var arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
            bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
        while (n--) {
            u8arr[n] = bstr.charCodeAt(n);
        }
        return new Blob([u8arr], { type: mime });
    }

    goBack(e) {
        e.preventDefault();
        this.props.history.goBack();
    }


    closeModal = () => {
        this.setState({
            isModalOpen: !this.state.isModalOpen
        });
    }

    handleClassFileChange = e => {

        const file = e.target.files[0]

        const fileReader = new FileReader()
        fileReader.onload = e => {
            const dataURL = e.target.result
            this.setState({ src: dataURL },
                () => {
                    this.setState({
                        isModalOpen: !this.state.isModalOpen
                    })
                })
        }
        if (file) {
            if (file.size <= MAX_FILE_SIZE) {
                fileReader.readAsDataURL(file)
            } else {
                console.log('file too big')
            }
        }
    }

    handleGetResultImgUrl = () => {
        let url = this.cropper.getCroppedCanvas().toDataURL("image/jpg")
        var blob = this.dataURLtoBlob(url);
        var objurl = URL.createObjectURL(blob);
        
        this.setState({
            image: objurl,
            isModalOpen: !this.state.isModalOpen

        })

    }

    render() {
        const {
            classModalVisible,
            classModalFile,
            classResultImgUrl,
            dimensions
        } = this.state
        const data = this.props.location.data


        let card = null;
        let downloadBtn = null;
        let modalContent = null;

        // let data = {
        //     image: "https://i.scdn.co/image/ab67616d0000b273445f0f337a07012336328ea0",
        //     name: "Gangsta",
        //     artists: "Kehlani",
        //     choosenLyr: ["I need a gangsta, to love me better", "Than all the others do, That's just what gangsters do", "To always forgive me", "Ride or die with me", "That's just what gangsters do"],
        //     spotifyUrl: "https://open.spotify.com/track/1W7zkKgRv9mrLbfdQ8XyH3"
        // };

        if (data) {
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
                    <div className="imgcontainer">
                        <img src={this.state.image} className="image" />
                        <input
                            type="file"
                            accept="image/jpeg,image/jpg,image/png"
                            className="share-menu"
                            onChange={this.handleClassFileChange}
                        />
                        <img src={editSvg} className="imghover" />

                    </div>

                    {lyrics}
                    <h5 className='song-info'>{data.name}</h5>
                    <h5 className='song-info'>{data.artists}</h5>
                </div>

            downloadBtn = <a id="download" onClick={el => this.download_img(el)} className="f6 link dim br3 ba bw1 ph3 pv2 mb2 dib white mb4 mh3 mt4">Download Lyrics Pic</a>
        };

        if (dimensions) {

            this.canvas.width = dimensions.width * 2;
            this.canvas.height = dimensions.height * 2;
            this.canvas.style.width = dimensions.width * 2 + "px";
            this.canvas.style.height = dimensions.height * 2 + "px";
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

            this.canvas.width = dimensions.width * ratio * 2;
            this.canvas.height = dimensions.height * ratio * 2;
            this.canvas.style.width = dimensions.width * 2 + "px";
            this.canvas.style.height = dimensions.height * 2 + "px";

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
            imageObj.src = this.state.image;

            //line breaker.
            document.fonts.ready.then(() => {
                ctx.font = '26px "Roboto Mono"';
                ctx.fillStyle = "#fff";
                let currentHeight = imageSize + padding + 21;
                data.choosenLyr.map((item, index) => {



                    let lyricsWidth = Math.round(ctx.measureText(item).width);

                    if (lyricsWidth >= imageSize) {
                        let itemWordNum = item.split(" ").length
                        while (item !== "") {
                            let wordNum = Math.round(imageSize / lyricsWidth * item.split(" ").length);
                            if (wordNum >= itemWordNum) {
                                currentHeight = currentHeight + 33;
                                ctx.fillText(item, padding, currentHeight, imageSize);
                                item = "";
                                break
                            } else {
                                currentHeight = currentHeight + 33;
                                let newline = item.split(" ").slice(0, wordNum).join(" ");
                                ctx.fillText(newline, padding, currentHeight, imageSize);
                                item = item.split(" ").slice(wordNum, lyricsWidth).join(" ");
                                lyricsWidth = Math.round(ctx.measureText(item).width);
                            }
                        }
                    } else {
                        currentHeight = currentHeight + 33;
                        ctx.fillText(item, padding, currentHeight, imageSize)
                    }


                });
                ctx.textAlign = "right";
                ctx.font = '23px "Roboto Mono"';
                ctx.fillText(data.name, imageSize + padding, dimensions.height * 2 - 60, imageSize);
                ctx.fillText(data.artists, imageSize + padding, dimensions.height * 2 - 30, imageSize)
            });



        };


        modalContent =
            <div className="cropper-container">
                <Cropper
                    src={this.state.src}
                    style={{height: 300, width: '100%'}}
                    className="cropper"
                    ref={cropper => (this.cropper = cropper)}
                    viewMode={1}
                    zoomable={true}
                    aspectRatio={1}
                    guides={true}
                    background={false}
                />
                <a className="f6 link dim br3 ba ph3 pv2 mb2 dib white mb4 mh3 mt4" onClick={e => { this.handleGetResultImgUrl() }}> &lt;-- upload</a>
            </div>


        return (
            <div className='background' >
                {card}
                <canvas id="canvas" className="canvas-poster-hidca" ref={el => { this.canvas = el }} style={{ display: 'none' }}></canvas>
                {downloadBtn}
                <a className="f6 link dim br3 ba ph3 pv2 mb2 dib white mb4 mh3 mt4" onClick={e => { this.goBack(e) }}> &lt;-- Back</a>

                <Modal
                    isModalOpen={this.state.isModalOpen}
                    closeModal={this.closeModal}
                >
                    {modalContent}
                </Modal>

            </div>
        )
    }

}


export default LyricsPic;


