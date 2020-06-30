import React, { Component } from "react";
import { Link } from "react-router-dom";

import api from '../Api/Api'
import '../Styles/main.scss'
import Player from './Presentational/Player'
import Tooltip from './Presentational/Tooltip'
import Toast from './Presentational/Toast'
import Modal from './Presentational/Modal'
import Selector from './Presentational/Selector'
import loaderIcon from '../Styles/loader.svg'
import questionIcon from '../Styles/question.svg'
import logoSpotify from '../Styles/icon_Spotify.png'
import shareIcon from '../Styles/share.svg'


class Main extends Component {

    constructor(props) {
        super(props);
        this.state = {
            currentUrl: window.location.href,
            access_token: null,
            player: null,
            currentPlaying: null,
            showToast: false,
            toastMessage: null,
            toastOption: null,
            isModalOpen: false,
            lyricsPicContent: []
        };
    }

    componentDidMount() {

        let player = null

        let token = this.state.currentUrl.split('&')[0].split('=')[1]

        if (token) {
            api.current_play(token)
                .then(resp => {
                    let song_info = null;
                    let artists = [];
                    for (let i = 0; i < resp.data.item.artists.length; i++) {
                        artists[i] = resp.data.item.artists[i].name
                    }
                    if (resp.data.item.uri.includes('local')) {
                        let album = {
                            url: logoSpotify,
                            height: 300
                        }
                        song_info = {
                            name: resp.data.item.name,
                            album_name: null,
                            album_image: [album],
                            artists: artists,
                            spotifyUrl: null
                        }
                    } else {
                        song_info = {
                            name: resp.data.item.name,
                            album_name: resp.data.item.album.name,
                            album_image: resp.data.item.album.images,
                            artists: artists,
                            spotifyUrl: resp.data.item.external_urls.spotify
                        }
                    }

                    this.setState({
                        currentPlaying: song_info
                    })
                    this.handleLyrics(song_info)

                })
                .catch(err => {
                    console.log(err)
                })

            if (!window.Spotify) {

                const script = document.createElement("script");
                script.src = "https://sdk.scdn.co/spotify-player.js";
                script.async = true;
                document.body.appendChild(script);


                window.onSpotifyWebPlaybackSDKReady = () => {

                    // You can now initialize Spotify.Player and use the SDK

                    if (window.Spotify) {
                        player = new window.Spotify.Player({
                            name: "hello",
                            getOAuthToken: callback => {
                                callback(token);
                            },
                            volume: 0.1
                        });

                        player.addListener('initialization_error', ({ message }) => { console.error(message); });
                        player.addListener('authentication_error', ({ message }) => { console.error(message); });
                        player.addListener('account_error', ({ message }) => { console.error(message); });
                        player.addListener('playback_error', ({ message }) => { console.error(message); });

                        // Playback status updates
                        player.addListener('player_state_changed',({ position, duration, track_window })=> {
                            if (track_window) {

                                let artists = [];
                                for (let i = 0; i < track_window.current_track.artists.length; i++) {
                                    artists[i] = track_window.current_track.artists[i].name
                                }
                                let song_info = {
                                    name: track_window.current_track.name,
                                    album_name: track_window.current_track.album.name,
                                    album_image: track_window.current_track.album.images,
                                    artists: artists
                                }
                                if (song_info.name == this.state.currentPlaying.name) {
                                    this.setState({
                                        player: player,
                                        currentPlaying: song_info
                                    });
                                } else {
                                    this.setState({
                                        lyrics_current: null,
                                        player: player,
                                        currentPlaying: song_info
                                    });
                                    this.handleLyrics(song_info)
                                }

                            } else {
                                this.setState({
                                    player: null
                                });
                            }

                        });

                        // Ready
                        player.addListener('ready', ({ device_id }) => {

                            console.log('Ready with Device ID');
                        });

                        // Not Ready
                        player.addListener('not_ready', ({ device_id }) => {
                            console.log('Device ID has gone offline');
                        });

                        // Connect to the player!
                        player.connect();


                    }
                };
            }
        }


    }

    componentWillUnmount() {

    }

    handleLyrics = (song_info) => {
        let name = song_info.name.split(' (')[0]
        name = song_info.name.split(' -')[0]
        let artist = song_info.artists[0]
        let album = song_info.album_name
        api.getLyrics(name, artist, album)
            .then(resp => {
                this.setState({
                    lyrics_current: resp.data
                })
            })
            .catch(err => {
                console.log(err)
            })
    }

    sendFeedback = () => {

        let song_info = {
            name: this.state.currentPlaying.name,
            album_name: this.state.currentPlaying.album_name,
            artists: this.state.currentPlaying.artists
        }
        api.sendFeedback(this.state.currentPlaying)
            .then(() => {
                this.setState({
                    showToast: true,
                    toastOption: "success",
                    toastMessage: "Feedback sent!"
                }, () => {
                    setTimeout(() =>
                        this.setState({ showToast: false })
                        , 2000)
                })
            })
            .catch(err => {
                console.log(err)
                this.setState({
                    showToast: true,
                    toastOption: "warning",
                    toastMessage: "Oops!" + err
                }, () => {
                    setTimeout(() =>
                        this.setState({ showToast: false })
                        , 2000)
                })
            })
    }


    openModal = () => {
        this.setState({
            isModalOpen: true
        });

    }

    closeModal = () => {
        this.setState({
            isModalOpen: false
        });
    }


    choosenLyrics = (lyrics, active) => {
        //push() have return value, so don't use it in setState
        let n1 = this.state.lyricsPicContent
        if (active) {
            n1.push(lyrics)
            this.setState({
                lyricsPicContent: n1
            })
        } else {
            n1 = n1.filter((lyric) => lyric !== lyrics)
            this.setState({
                lyricsPicContent: n1
            })
        }
    }



    render() {
        let main = null;
        let loader = <img className='w3' src={loaderIcon}></img>

        let tooltipPosition = /Android|webOS|iPhone|iPad/i.test(navigator.userAgent) ? 'top' : 'bottom';

        let modalContent = null;

        if (this.state.currentPlaying) {

            let artists = this.state.currentPlaying.artists;
            let lyrics = null;
            let lyricsPicUrl = null;
            let ablumImageUrl = null;
            this.state.currentPlaying.album_image.map((item) => {
                if (item.height === 300) {
                    ablumImageUrl = item.url
                }
                else if (item.height === 640) {
                    lyricsPicUrl = item.url
                }
            })


            if (this.state.lyrics_current) {
                if (this.state.lyrics_current === 'Oops! No results found') {
                    let question = <Tooltip message={'Click here to report lyrics missing '} position={tooltipPosition}><img className='w2 icon' src={questionIcon} onClick={this.sendFeedback}></img></Tooltip>
                    lyrics =
                        <div className='pv3'>
                            <h4 className=' f5 center fw5 mt3 white'>Oops! No results found</h4>
                            {question}
                            <Toast toastOption={this.state.toastOption} message={this.state.toastMessage} visible={this.state.showToast} />
                        </div>

                    modalContent =
                        <div>
                            <p>Under Construnction, :)</p>
                        </div>
                } else {
                    let lyricsPicData = {
                        image: lyricsPicUrl,
                        name: this.state.currentPlaying.name,
                        artists: artists.join(', '),
                        choosenLyr: this.state.lyricsPicContent,
                        spotifyUrl: this.state.currentPlaying.spotifyUrl
                    }
                    lyrics =
                        <div className='white pv3' style={{marginBottom:100}}>
                            {this.state.lyrics_current.split("\n").map((item, index) => {
                                return (
                                    <span key={index}>
                                        {item}
                                        <br />
                                    </span>
                                )
                            })}
                        </div>

                    modalContent =
                        <div>
                            <div>
                                {this.state.lyrics_current.split("\n").map((item, index) => {
                                    if (index === 1) {
                                        item = "----> Select lyrics here <----"
                                    }
                                    return (
                                        //have parenthesis to avoid undefined error
                                        //must set key or id to aviod undefined error
                                        <Selector key={index} lyrics={item} choosenLyrics={this.choosenLyrics} />
                                    )
                                })}
                            </div>
                            <Link to={{ pathname: '/lyrics-pic', data: lyricsPicData }}><a className="f6 link dim br3 ba bw1 ph3 pv2 mb2 dib white mb4 mh3" >Generate Lyrics Pic</a></Link>

                        </div>
                }
            }
            else {
                lyrics =
                    <div className='pv3'>
                        {loader}
                    </div>
            }

            if (this.state.player) {
                main =
                    <div className='main'>
                        <div className=" pa3 ">
                            <div className="pt6">
                                <img src={ablumImageUrl} className="mw-100" />
                                <h1 className=' f5 center fw3 mt3 white'>{this.state.currentPlaying.name}</h1>
                                <h1 className=' f5 center fw3 mt3 white'>{artists.join(', ')}</h1>
                            </div>
                            <hr className='br1' style={{ backgroundColor: '#1db954', height: '3px', width: '100%', border: '0' }}></hr>

                            <div className="h4">
                                {lyrics}
                            </div>
                        </div>

                        <label className='share-menu' onClick={this.openModal}><img className='icon' src={shareIcon} /></label>
                        <Player player={this.state.player}></Player>
                    </div>

            }
            else {
                main =
                    <div className='main'>
                        <div className=" pa3 mr2">
                            <div>
                                <h1 className=' f4 center fw5 mt3 white pb2 pt6'>To enable the web player</h1>
                                <h1 className=' f5 center fw5 mt3 white'>1. Open Spotify and play something.</h1>
                                <h1 className=' f5 center fw5 mt3 white'>2. Click Connect to a device in the bottom-right.</h1>
                                <h1 className=' f5 center fw5 mt3 white pb4'>3. Select the device "hello".</h1>

                                <img src={ablumImageUrl} className="mw-100" />
                                <h1 className=' avenir f5 center fw3 mt3 white'>{this.state.currentPlaying.name}</h1>
                                <h1 className=' avenir f5 center fw3 mt3 white'>{artists.join(', ')}</h1>
                            </div>
                            <hr className='br1' style={{ backgroundColor: '#1db954', height: '3px', width: '100%', border: '0' }}></hr>
                            <div className="pa1 h4">
                                {lyrics}
                            </div>
                            <label className='share-menu' onClick={this.openModal}><Tooltip className="share-menu" message={'Click here to sharing lyrics'} position={"left"}><img className='icon' src={shareIcon} /></Tooltip></label>
                        </div>
                    </div>
            }
        }
        else {

            let uri = this.state.currentUrl.includes('localhost') ? 'http://localhost:5000/login/web' : 'https://lyrics-crawler-server.herokuapp.com/login/web'
            main =
                <div className='main'>
                    <h1 className=' f3 center fw5 mt3 white pt7'>Hey, before you start,</h1>
                    <h1 className=' f3 center fw5 mt3 white pb4 pt2'>make sure you're playing music on Spotify</h1>
                    <a className='f6 link dim br2 pv2 dib white' style={{ backgroundColor: "#1db954", width: '200px' }} href={uri}>Login to Spotify</a>
                </div>
        }


        return (
            <div >
                {main}
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

export default Main;