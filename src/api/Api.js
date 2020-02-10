import axios from 'axios';

const BASE_URL = 'http://localhost:5000'

class Api {
  static current_play = (token) => {
    let _url = 'https://api.spotify.com/v1/me/player/currently-playing'

    return axios({
      url:_url,
      method: 'GET',
      headers: {
          'Accept': 'application/json',
          "Content-Type": "application/json",
          "Authorization": "Bearer " + token
      },
    })
      .then(response => {
        return response;
      })
      .catch(err => {
        console.error(err);
      });
  }

  static getLyrics = (_song, _artist) => {
    let _url = 'http://localhost:5000/fetch_lyrics'
    console.log(_song + "   " + _artist)

    return axios.get(_url, {
      params: {
        song: _song,
        artist: _artist
      }
    }

    )
      .then(response => {
        return response
      })
      .catch(err => {
        console.log(err)
      })
  }
}

export default Api;