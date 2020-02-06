import client_id from '../APIKEY.js';
import axios from 'axios';

const BASE_URL = 'http://localhost:5000'

class Api {
  static auth_spotify = () => {
    let _url = BASE_URL + '/login'

    return axios.get(_url)
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