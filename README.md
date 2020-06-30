# Lyrivs Crawler

## To do
* Add multi styles for lyrics sharing card
* Keep increasing matching accuracy
* Support translate between different languages.

## Updates

* 2020.06.30. Improve web player functionalities
* 2020.03.16. Support Chinese song lyrics fetching, add lyrics source.
* 2020.03.05. Add lyrics cards sharing.
* 2020.02.26. Fixed the issue that when browsing with a mobile device tooltip will be covered. 
* 2020.02.20. Add feedback for the song lacking lyrics. 


## What is it?
Lyrics Crawler is a full-stack web application. It can sync showing lyrics while playing music on Spotify. If users are Spotify premium, it can also be used as a web player and streaming the content between different devices. This project is developed by React ([frontend](https://github.com/RuoyanMeng/lyrics_crawler_client)) and NodeJS ([backend](https://github.com/RuoyanMeng/lyrics_crawler_server)), data is provided by Spotify API and Genius API. More data sources will be added in the future to improve user experience. The mobile app is under construction.

## Link to running application
[Lyrics crawler](https://lyrics-crawler.herokuapp.com/)

## To start a local version
To start a local version, download and run:
<pre><code>npm install</code></pre>
<pre><code>npm start</code></pre>

### Frameworks used
* ReactJS

### Libraries used
* axios
* Tachyons
* node-sass

### API used
* Spotify Web API
* Spotify Web Playback SDK
* Genius API
* KKBOX API
