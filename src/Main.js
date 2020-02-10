import React, { Component, Fragment } from "react";
import PropTypes from "prop-types";

import api from './api/Api'
import '../src/styles/main.css'
import client_id from './APIKEY.js';
import Player from './Player.js'

const BASE_URL = 'https://accounts.spotify.com'


class Main extends Component {

    constructor(props) {
        super(props);
        this.state = {
            currentUrl: window.location.href,
            access_token: null,
            player: null,
            currentPlaying: null
        };
    }

    componentDidMount() {

        let player = null

        let token = this.state.currentUrl.split('&')[0].split('=')[1]
        console.log(token)

        if (token) {
            api.current_play(token)
                .then(resp => {

                    let song_info = {
                        name: resp.data.item.name,
                        album_image: resp.data.item.album.images[1],
                        artists: resp.data.item.artists
                    }
                    this.setState({
                        currentPlaying: song_info
                    })
                    console.log(this.state.currentPlaying)
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
                            volume: 0.2
                        });

                        player.addListener('initialization_error', ({ message }) => { console.error(message); });
                        player.addListener('authentication_error', ({ message }) => { console.error(message); });
                        player.addListener('account_error', ({ message }) => { console.error(message); });
                        player.addListener('playback_error', ({ message }) => { console.error(message); });

                        // Playback status updates
                        player.addListener('player_state_changed', state => {
                            console.log(state);
                            if (state) {
                                let song_info = {
                                    name: state.track_window.current_track.name,
                                    album_image: state.track_window.current_track.album.images[0],
                                    artists: state.track_window.current_track.artists
                                }
                                this.setState({
                                    player: player,
                                    currentPlaying: song_info
                                });
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

    componentWillMount() {

    }

    componentWillUnmount() {

    }

    togglePlay = () => {
        console.log('clicked')
        this.state.player.togglePlay().then(() => {
            console.log('Toggled playback!');
        });
    }

    previousTrack = () => {
        this.state.player.previousTrack().then(() => {
            console.log('Set to previous track!');
        });
    }

    nextTrack = () => {
        this.state.player.nextTrack().then(() => {
            console.log('Skipped to next track!');
        });
    }

    handleLyrics = (song_info) => {
        let name = song_info.name
        let artist = song_info.artists[0].name

        api.getLyrics(name, artist)
            .then(resp => {
                console.log(resp.data)
                this.setState({
                    lyrics_current: resp.data
                })
            })
            .catch(err => {
                console.log(err)
            })
    }



    render() {

        let player = null
        let togglePlayBtn = null;

        let previousBtn =
            <div className=" w-25 pa5 " onClick={this.previousTrack}>
                <svg
                    className="w1 icon"
                    xmlns="http://www.w3.org/2000/svg"
                    xmlnsXlink="http://www.w3.org/1999/xlink"
                    viewBox="0 0 150 150"
                    preserveAspectRatio="xMidYMin meet"
                >
                    <path d="M 135.898438 0.0703125 C 132.84375 0.0703125 129.550781 1.324219 126.128906 3.683594 L 42.820312 61.078125 C 37.457031 64.769531 34.535156 69.742188 34.535156 75.078125 C 34.535156 80.414062 37.507812 85.386719 42.871094 89.082031 L 126.253906 146.433594 C 129.683594 148.792969 133.113281 150 136.164062 150 L 136.167969 150 C 139.4375 150 141.914062 148.660156 143.847656 146.058594 C 145.753906 143.484375 146.488281 139.832031 146.488281 135.414062 L 146.488281 14.742188 C 146.492188 5.695312 142.605469 0.0703125 135.898438 0.0703125 Z M 135.898438 0.0703125 " />
                    <path d="M 16.140625 0.0117188 L 12.125 0 C 7.605469 0 3.511719 3.679688 3.511719 8.207031 L 3.511719 141.761719 C 3.511719 146.285156 7.46875 150 11.992188 150 L 12.132812 150 L 16.066406 149.976562 C 20.589844 149.976562 24.605469 146.28125 24.605469 141.757812 L 24.605469 8.214844 C 24.605469 3.691406 20.660156 0.0117188 16.140625 0.0117188 Z M 16.140625 0.0117188 " />
                </svg>
            </div>

        let nextBtn =
            <div className=" w-25 pa5 items-center" onClick={this.nextTrack}>
                <svg
                    className='w1 icon'
                    xmlns="http://www.w3.org/2000/svg"
                    xmlnsXlink="http://www.w3.org/1999/xlink"
                    xmlSpace="preserve"
                    viewBox="0 0 150 150"
                    preserveAspectRatio="xMidYMin meet"

                >
                    <path d="M 108.121094 61.042969 L 24.730469 3.683594 C 21.304688 1.320312 17.742188 0.0742188 14.691406 0.0742188 C 7.992188 0.0742188 3.550781 5.695312 3.550781 14.734375 L 3.550781 135.34375 C 3.550781 139.757812 4.835938 143.449219 6.738281 146.019531 C 8.671875 148.621094 11.695312 150 14.964844 150 C 18.011719 150 21.4375 148.75 24.859375 146.390625 L 108.175781 89.03125 C 113.535156 85.339844 116.46875 80.371094 116.46875 75.035156 C 116.46875 69.703125 113.488281 64.734375 108.121094 61.042969 Z M 108.121094 61.042969 " />
                    <path d="M 138.410156 0 L 134.960938 0.0078125 C 130.449219 0.0078125 126.539062 3.6875 126.539062 8.210938 L 126.539062 141.675781 C 126.539062 146.199219 130.382812 149.914062 134.902344 149.914062 L 138.566406 149.960938 C 143.0625 149.9375 146.449219 146.191406 146.449219 141.683594 L 146.449219 8.199219 C 146.449219 3.679688 142.925781 0 138.410156 0 Z M 138.410156 0 " />
                </svg>
            </div>

        let pauseBtn =
            < div className="w-25 pa5" onClick={this.togglePlay}>
                <svg
                    className='w1 icon'
                    xmlns="http://www.w3.org/2000/svg"
                    xmlnsXlink="http://www.w3.org/1999/xlink"
                    xmlSpace="preserve"
                    viewBox="0 0 50 50"
                    width='100%'
                    height='100%'
                    preserveAspectRatio="xMidYMin meet"
                >
                    <path d="M 24.980469 0 C 11.203125 0 0 11.203125 0 24.980469 C 0 38.75 11.203125 49.957031 24.980469 49.957031 C 38.75 49.957031 49.957031 38.75 49.957031 24.980469 C 49.957031 11.203125 38.75 0 24.980469 0 Z M 21.195312 34.058594 C 21.195312 35.316406 20.175781 36.332031 18.921875 36.332031 C 17.667969 36.332031 16.652344 35.316406 16.652344 34.058594 L 16.652344 15.894531 C 16.652344 14.640625 17.667969 13.625 18.921875 13.625 C 20.175781 13.625 21.195312 14.640625 21.195312 15.894531 Z M 33.304688 34.058594 C 33.304688 35.316406 32.289062 36.332031 31.03125 36.332031 C 29.78125 36.332031 28.761719 35.316406 28.761719 34.058594 L 28.761719 15.894531 C 28.761719 14.640625 29.78125 13.625 31.03125 13.625 C 32.289062 13.625 33.304688 14.640625 33.304688 15.894531 Z M 33.304688 34.058594 " />

                </svg>
            </div>

        let p =
            <div className="flex justify-around">
                {previousBtn}
                {pauseBtn}
                {nextBtn}

            </div>



        let main = null
        if (this.state.currentPlaying) {

            let artists = []
            let lyrics = null

            for (let i = 0; i < this.state.currentPlaying.artists.length; i++) {
                artists[i] = this.state.currentPlaying.artists[i].name
            }

            //lyrics layout need to be improve
            if (this.state.lyrics_current) {
                lyrics =
                    <div className='white'>
                        {this.state.lyrics_current.split("\n").map(function(item) {
                            return (
                            <span>
                            {item}
                            <br />
                            </span>
                        )
                    })}
                    </div>
            }
            else {
                lyrics =
                    <div>
                        Loading....
                </div>
            }

            if (this.state.player) {
                main =
                    <div>
                        <div className=" pa3 mr2 ">
                            <div className="pt6">
                                <img src={this.state.currentPlaying.album_image.url} className="mw-100" />
                                <h1 className='avenir f5 center fw3 mt3 white'>{this.state.currentPlaying.name}</h1>
                                <h1 className='avenir f5 center fw3 mt3 white'>{artists.join(', ')}</h1>
                            </div>
                            <hr className='br1' style={{ backgroundColor: '#1db954', height: '3px', width: '100%', border: '0' }}></hr>
                            {p}
                        </div>
                        <div className="pa2 h5">
                            <a className='f6 link dim br2 ph3 pv2 mb2 dib white' style={{ backgroundColor: "#1db954" }} onClick={() => {this.handleLyrics(this.state.currentPlaying)}}>Lyrics</a>
                            {lyrics}
                        </div>
                    </div>

            }
            else {
                main =
                    <div>
                        <div className=" pa3 mr2">
                            <div>
                                <h1 className='avenir f4 center fw5 mt3 white pb2 pt6'>To enable the web player</h1>
                                <h1 className='avenir f5 center fw5 mt3 white'>1. Open Spotify and play something.</h1>
                                <h1 className='avenir f5 center fw5 mt3 white'>2. Click Connect to a device in the bottom-right.</h1>
                                <h1 className='avenir f5 center fw5 mt3 white pb4'>3. Select the device "hello".</h1>

                                <img src={this.state.currentPlaying.album_image.url} className="mw-100" />
                                <h1 className='avenir f5 center fw3 mt3 white'>{this.state.currentPlaying.name}</h1>
                                <h1 className='avenir f5 center fw3 mt3 white'>{artists.join(', ')}</h1>
                            </div>
                            <hr className='br1' style={{ backgroundColor: '#1db954', height: '3px', width: '100%', border: '0' }}></hr>
                            <div className="pa2 h5">
                                <a className='f6 link dim br2 ph3 pv2 mb2 dib white pb3' style={{ backgroundColor: "#1db954" }} onClick={() => {this.handleLyrics(this.state.currentPlaying)}}>Lyrics</a>
                                {lyrics}
                            </div>
                        </div>
                    </div>

            }


        }
        else {
            
            let uri = this.state.currentUrl.includes('localhost') ? 'http://localhost:5000/login':'https://lyrics-crawler-server.herokuapp.com/login'
            main =
                <div>
                    <h1 className='avenir f3 center fw5 mt3 white pt7'>Hey, before you start,</h1>
                    <h1 className='avenir f3 center fw5 mt3 white pb4 pt2'>make sure you're playing music on Spotify</h1>
                    <a className='f6 link dim br2 pv2 dib white' style={{ backgroundColor: "#1db954", width: '200px' }} href={uri}>Login to Spotify</a>
                </div>
        }



        return (
            <div className='main'>
                {main}


            </div>
        )
    }
}

export default Main;