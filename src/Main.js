import React, { Component } from "react";
import PropTypes from "prop-types";

import api from './api/Api'
import '../src/styles/main.css'
import client_id from './APIKEY.js';
import Player from './Player.js'

const BASE_URL = 'https://accounts.spotify.com'
const scope = ['user-modify-playback-state', 'user-read-currently-playing', 'user-read-playback-state', "streaming", "user-read-email", "user-read-private"]



class Main extends Component {

    constructor(props) {
        super(props);
        this.state = {
            currentUrl: window.location.href,
            access_token: null,
            player: null
        };
    }

    componentDidMount() {

        let player = null

        let token = this.state.currentUrl.split('&')[0].split('=')[1]
        console.log(token)

        if (token) {
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
                                callback(this.state.access_token);
                            },
                            volume: 0.2
                        });

                        player.addListener('initialization_error', ({ message }) => { console.error(message); });
                        player.addListener('authentication_error', ({ message }) => { console.error(message); });
                        player.addListener('account_error', ({ message }) => { console.error(message); });
                        player.addListener('playback_error', ({ message }) => { console.error(message); });

                        // Playback status updates
                        player.addListener('player_state_changed', state => { console.log(state); });

                        // Ready
                        player.addListener('ready', ({ device_id }) => {
                            console.log('Ready with Device ID', device_id);
                        });

                        // Not Ready
                        player.addListener('not_ready', ({ device_id }) => {
                            console.log('Device ID has gone offline', device_id);
                        });

                        // Connect to the player!
                        player.connect();

                        this.setState({
                            player: player,
                            access_token: token
                        });

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

    previousTrack =()=>{
        this.state.player.previousTrack().then(() => {
            console.log('Set to previous track!');
          });
    }

    nextTrack =()=>{
        this.state.player.nextTrack().then(() => {
            console.log('Skipped to next track!');
          });
    }

    handleLyrics=()=>{
        console.log('?????')
        api.getLyrics("peace of mind","Avicii")
        .then(resp=>{
            console.log(resp.data)
            this.setState({
                lyrics_current : resp.data
            })
        })
        .catch(err=>{
            console.log(err)
        })
    }



    render() {

        let player = null
        let togglePlayBtn = null;
        let redirect_uri = this.state.currentUrl;

        let _url = BASE_URL + '/authorize' +
            '?response_type=token' +
            '&client_id=' + client_id +
            '&redirect_uri=' + encodeURIComponent(redirect_uri) + '&scope=' + scope.join('%20');

        let main = null
        if (this.state.access_token && this.state.player) {
            main = <a className='f6 link dim br2 ph3 pv2 mb2 dib white' style={{ backgroundColor: "#1db954" }} onClick={this.handleLyrics}>Hello Spotify</a>
        }
        else {
            main = <a className='f6 link dim br2 ph3 pv2 mb2 dib white' style={{ backgroundColor: "#1db954" }} href={'http://localhost:5000/login'}>Login to Spotify</a>
        }

        let previousBtn =
            <div className="outline w-25 pa5 " onClick={this.previousTrack}>
                <svg 
                    className="w1 icon" 
                    xmlns="http://www.w3.org/2000/svg"
                    xmlnsXlink="http://www.w3.org/1999/xlink"
                    viewBox="0 0 493.52 493.52" 
                    preserveAspectRatio="xMidYMin meet"
                >
                    <path d="M447.126,0.236c-10.056,0-20.884,4.12-32.148,11.884L140.882,200.952c-17.644,12.152-27.252,28.504-27.252,46.06
			            c-0.004,17.56,9.78,33.924,27.428,46.076L415.39,481.784c11.284,7.768,22.568,11.736,32.604,11.736h0.012
			            c10.76,0,18.916-4.404,25.276-12.972c6.268-8.46,8.688-20.476,8.688-35.012V48.508C481.974,18.74,469.186,0.236,447.126,0.236z"/>   
                    <path d="M53.106,0.036L39.894,0C25.018,0,11.55,12.112,11.55,26.996v439.42c0,14.884,13.024,27.1,27.908,27.1h0.456l12.948-0.072
			            c14.88,0,28.092-12.164,28.092-27.048V27.028C80.958,12.144,67.97,0.036,53.106,0.036z"/>
                </svg>
            </div>

        let nextBtn =
            <div className=" outline w-25 pa5 " onClick={this.nextTrack}>
                <svg
                    className='w1 icon'
                    xmlns="http://www.w3.org/2000/svg"
                    xmlnsXlink="http://www.w3.org/1999/xlink"
                    xmlSpace="preserve"
                    viewBox="0 0 493.52 493.52" 
                    preserveAspectRatio="xMidYMin meet"
                    
                >
                    <path
                        d="M355.938,200.956L81.414,12.128c-11.28-7.776-23.012-11.88-33.056-11.88c-22.052,0-36.672,18.496-36.672,48.26v397.036
			                c0,14.54,4.228,26.688,10.496,35.144c6.364,8.572,16.32,13.108,27.076,13.108c10.04,0,21.308-4.112,32.584-11.876l274.276-188.828
			                c17.632-12.152,27.3-28.508,27.296-46.076C383.414,229.456,373.594,213.1,355.938,200.956z"/>
                    <path d="M455.638,0L444.29,0.032c-14.86,0-27.724,12.112-27.724,26.992v439.368c0,14.896,12.652,27.124,27.532,27.124
				            l12.055,0.152c14.805-0.079,25.957-12.412,25.957-27.252V26.996C482.11,12.116,470.51,0,455.638,0z"/>
                </svg>
            </div>

        let pauseBtn =
            < div className="outline w-25 pv4 mt3" onClick={this.togglePlay}>
                <svg
                    className='w2 icon'
                    xmlns="http://www.w3.org/2000/svg"
                    xmlnsXlink="http://www.w3.org/1999/xlink"
                    xmlSpace="preserve"
                    viewBox="0 0 60 60"
                    preserveAspectRatio="xMidYMin meet"
                >
                    <path d="M30,0C13.458,0,0,13.458,0,30s13.458,30,30,30s30-13.458,30-30S46.542,0,30,0z M27,46h-8V14h8V46z M41,46h-8V14h8V46z" />
                </svg>
            </div>

        let p =
            <div className="flex justify-around">
                    {previousBtn}
                    {pauseBtn}
                    {nextBtn}
        
            </div>

        let t = 
            <div class="flex items-center">
                
                <div class="outline w-50 pa3 mr2">
                    <hr className='br2' style={{color:'white',backgroundColor:'white',height: '5px',width: '100%'}}></hr>
                    {p}
                </div>
                <div class="outline w-50 pa3 h5">
                    {main}
                </div>
            </div>
        


        return (
            <div className='main'>
                {t}
                
                
                
            </div>
        )
    }
}

export default Main;