import axios from 'axios';


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
    let u = window.location.href
    let _url =u.includes('localhost') ? 'http://localhost:5000/fetch_lyrics' : 'https://lyrics-crawler-server.herokuapp.com/fetch_lyrics'
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