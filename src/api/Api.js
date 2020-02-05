import client_id from '../APIKEY.js';
import axios from 'axios';

const BASE_URL = 'https://api.spotify.com/v1/me/'

class Api {
    static player = (token) => {
        let _url = 'player'

        return axios({
            url : _url, 
            baseURL : BASE_URL,
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                "Authorization": "Bearer " + token
        }})
          .then(response => {
            return response;
          })
          .catch(err => {
            console.error(err);
          });
      }
}

export default Api;