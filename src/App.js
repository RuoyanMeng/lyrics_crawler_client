import React from 'react';
import { Route } from 'react-router-dom';

import './App.css';
import Main from './Components/Main.js';
import LyricsPic from './Components/LyricsPic.js'

function App() {
  return (
    <div className="App">
      <Route exact path="/" component={Main} />
      <Route path='/lyrics-pic' component={LyricsPic} />
    </div>
  );
}

export default App;
