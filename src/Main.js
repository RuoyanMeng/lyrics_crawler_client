import React, { Component } from "react";
import PropTypes from "prop-types";

import api from './api/Api'
import '../src/styles/main.css'
import Player from './Player.js'


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

    handleLyrics = (song_info) => {
        let name = song_info.name.split(' (')[0]
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
                        {this.state.lyrics_current.split("\n").map(function (item) {
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
                            <Player player={this.state.player}></Player>
                        </div>
                        <div className="pa2 h5">
                            <a className='f6 link dim br2 ph3 pv2 mb2 dib white' style={{ backgroundColor: "#1db954" }} onClick={() => { this.handleLyrics(this.state.currentPlaying) }}>Lyrics</a>
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
                                <a className='f6 link dim br2 ph3 pv2 mb2 dib white pb3' style={{ backgroundColor: "#1db954" }} onClick={() => { this.handleLyrics(this.state.currentPlaying) }}>Lyrics</a>
                                {lyrics}
                            </div>
                        </div>
                    </div>

            }


        }
        else {
            let uri = this.state.currentUrl.includes('localhost') ? 'http://localhost:5000/login' : 'https://lyrics-crawler-server.herokuapp.com/login'
            main =
                <div>
                    <h1 className='avenir f3 center fw5 mt3 white pt7'>Hey, before you start,</h1>
                    <h1 className='avenir f3 center fw5 mt3 white pb4 pt2'>make sure you're playing music on Spotify</h1>
                    <a className='f6 link dim br2 pv2 dib white' style={{ backgroundColor: "#1db954", width: '200px' }} href={uri}>Login to Spotify</a>
                </div>
        }


        let pauseBtn =
            <svg className='icon w2'
                xmlns="http://www.w3.org/2000/svg"
                xmlnsXlink="http://www.w3.org/1999/xlink"
                xmlSpace="preserve"
                viewBox="0 0 150 150"
                preserveAspectRatio="xMidYMin meet">
                <g id="surface1">
                    <path d="M 75 0 C 33.644531 0 0 33.644531 0 75 C 0 116.355469 33.644531 150 75 150 C 116.355469 150 150 116.355469 150 75 C 150 33.644531 116.355469 0 75 0 Z M 112.25 80.78125 L 63.160156 111.464844 C 62.054688 112.152344 60.800781 112.5 59.546875 112.5 C 58.410156 112.5 57.269531 112.214844 56.238281 111.644531 C 54.074219 110.441406 52.726562 108.160156 52.726562 105.683594 L 52.726562 44.316406 C 52.726562 41.839844 54.074219 39.554688 56.238281 38.355469 C 58.410156 37.152344 61.058594 37.222656 63.160156 38.535156 L 112.25 69.21875 C 114.242188 70.464844 115.453125 72.648438 115.453125 75 C 115.453125 77.351562 114.242188 79.535156 112.25 80.78125 Z M 112.25 80.78125 " />
                </g>
            </svg>

        return (
            <div className='main'>
                {main}

            </div>
        )
    }
}

export default Main;