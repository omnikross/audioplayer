import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import AudioPlayer from './AudioPlayer';
import registerServiceWorker from './registerServiceWorker';

const songs = [
  {
    url: 'http://tegos.kz/new/mp3_full/Redfoo_-_New_Thang.mp3',
    artist: {
      name: 'Redfoo',
      song: 'New Thang'
    }
  },
  {
    url: 'http://a.tumblr.com/tumblr_lpoc6cHNDP1r0jthjo1.mp3',
    artist: {
      name: 'Hugo',
      song: '99 Problems'
    }
  },
  {
    url: 'http://claymore.france.free.fr/momo/summer love.mp3',
    artist: {
      name: 'Justin Timberlake',
      song: 'Summer Love'
    }
  },
  {
    url: 'http://a.tumblr.com/tumblr_mlyactVSyX1qejx3lo1.mp3',
    artist: {
      name: 'Daft Punk',
      song: 'Get Lucky'
    }
  }
];

ReactDOM.render(<AudioPlayer songs={songs} />, document.getElementById('root'));
registerServiceWorker();
