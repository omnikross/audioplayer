import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import './AudioPlayer.css';

class AudioPlayer extends PureComponent {
  static propTypes = {
    songs: PropTypes.array.isRequired,
    autoplay: PropTypes.bool,
    onTimeUpdate: PropTypes.func,
    onEnded: PropTypes.func,
    onError: PropTypes.func,
    onPlay: PropTypes.func,
    onPause: PropTypes.func,
    onPrevious: PropTypes.func,
    onNext: PropTypes.func,
    onSearch: PropTypes.func,
  };
static defaultProps = {
  onTimeUpdate: () => {},
  onEnded: () => {},
  onError: () => {},
  onPlay: () => {},
  onPause: () => {},
  onPrevious: () => {},
  onNext: () => {},
  onSearch: () => {},
};

constructor(props) {
  super(props);
  this.state = {
    active: props.songs[0],
    songs: props.songs,
    current: 0,
    progress: 0,
    playing: !!props.autoplay,
    mute: false,
  };
  this.audio = document.createElement('audio');
  this.audio.src = this.state.active.url;

  this.audio.autoplay = !!this.state.autoplay;
  this.audio.addEventListener('timeupdate', listener => {

    this.updateProgress();

    props.onTimeUpdate(listener);
  });

  this.audio.addEventListener('ended', listener => {
    this.next();
    props.onEnded(listener);
  });
  this.audio.addEventListener('error', listener => {
    this.next();
    props.onError(listener);
  });
}

shuffle = arr => arr.sort(() => Math.random() - 0.5);

updateProgress = () => {
  const { duration, currentTime } = this.audio;
  const progress = (currentTime * 100) / duration;

  this.setState({
    progress: progress,
  });
};
setProgress = listener => {

  const target = listener.target.nodeName === 'SPAN' ? listener.target.parentNode : listener.target;
  const width = target.clientWidth;

  const rect = target.getBoundingClientRect();
  const offsetX = listener.clientX - rect.left;

  const duration = this.audio.duration;
  const currentTime = (duration * offsetX) / width;
  const progress = (currentTime * 100) / duration;
    
  this.audio.currentTime = currentTime;

  this.setState({
    progress: progress,
  });    
  this.play();
};

durationInTime = (sec) =>{
    var minutes = Math.floor(sec / 60);
    var seconds  = sec - minutes * 60;
    if(minutes < 10) {
      minutes = '0' + minutes;
    }
    if (seconds < 10) {
      seconds = '0' + seconds
    }
  return minutes + ':' + seconds.toFixed(0);
}
  
play = () => {
  this.setState({
    playing: true,
  });
  this.audio.play();
  document.getElementById('durationOfTrack').innerText = (this.durationInTime(this.audio.duration));
  this.props.onPlay();
};

pause = () => {
  this.setState({
    playing: false,
  });

  this.audio.pause();
  document.getElementById('durationOfTrack').innerText = (this.durationInTime(this.audio.duration));
  this.props.onPause();
};

  toggle = () => this.state.playing ? this.pause() : this.play();

  next = () => {
    const { repeat, current, songs } = this.state;

    const total = songs.length;

    const newSongToPlay = repeat 
      ? current 
      : current < total - 1 
        ? current + 1 
        : 0;
    
    const active = songs[newSongToPlay];
    this.setState({
      current: newSongToPlay,
      active: active,
      progress: 0,
      repeat: false,
    });
    
    this.audio.src = active.url;
    document.getElementById('durationOfTrack').innerText = (this.durationInTime(this.audio.duration));
    
    this.play();
  
    this.props.onNext();
  };
  
  previous = () => {
    const { current, songs } = this.state;
  
    const total = songs.length;

    const newSongToPlay = current > 0 ? current - 1 : total - 1;
  
    const active = songs[newSongToPlay];

    this.setState({
      current: newSongToPlay,
      active: active,
      progress: 0,
    });
  
    this.audio.src = active.url;
  
    document.getElementById('durationOfTrack').innerText = (this.durationInTime(this.audio.duration));
    this.play();
  
    this.props.onPrevious();
  };

  toggleMute = () => {
    const { mute } = this.state;
    this.setState({
      mute: !mute,
    });

    this.audio.volume = !!mute;
  };

search = () => {
  const {
    songs
  } = this.state;
  document.getElementById('search').onkeyup = function() {
  document.getElementById('founded').innerHTML = '';
  var length = this.value.length;
  if (length > 0) {
    document.getElementById('founded').innerHTML = songs.filter(song => song.artist.song.startsWith(this.value)) // сравнение с учетом регистра
      .map(song => song.artist.song)
      .join('<br>');
    }
  }
}
render() {
  const { 
    active: currentSong,
    progress,
    active,
    playing,
    mute,
    search,
  } = this.state;

  const playPauseClass = classnames({
    'fa': true,
    'fa-play': !playing,
    'fa-pause': playing,
  });

  const volumeClass = classnames({
    'fa': true,
    'fa-volume-up': !mute,
    'fa-volume-off': mute,
  });
return (
  <div className="player-container">
    <div className="current-song-player">
      <h2 className="artist-name">{currentSong.artist.name}</h2>
      <h3 className="artist-song-name">{currentSong.artist.song}</h3> 

      <div className="player-options">
        <div className="player-buttons player-controls">
          <button
            onClick={this.toggle}
            className="player-btn big"
            title="Play/Pause"
            >
            <i className={playPauseClass}></i>
          </button>

          <button
            onClick={this.previous}
            className="player-btn medium"
            title="Previous Song"
            >
            <i className="fa fa-backward"></i>
          </button>

          <button
            onClick={this.next}
            className="player-btn medium"
            title="Next Song"
            >
            <i className="fa fa-forward"></i>
          </button>
      
          <div className="player-progress-container" onClick={e => this.setProgress(e)}>
            <span className="player-progress-value" style={{width: progress + '%'}}></span>
          </div> 
          <span id="durationOfTrack"></span>
          <div className="player-buttons">
          <button
            className="player-btn small volume"
            onClick={this.toggleMute}
            title="Mute/Unmute"
            >
            <i className={volumeClass}></i>
          </button>
        </div>   
      </div>
    </div>
  </div>
  <div className="searching">
    <input type="search" id="search" ref={(input)  => {this.textInput = input; }} onClick={this.search}/>
  </div>
  <div id="founded" onClick={this.play}></div>
    <div className="tracks-table">
      <table className="table">
        <tbody>
          <tr className="mess-hide">
            <td className="name">{this.state.songs[0].artist.name}</td>
            <td className="song">{this.state.songs[0].artist.song}</td>
          </tr>
          <tr className="mess-hide">
            <td className="name">{this.state.songs[1].artist.name}</td>
            <td className="song">{this.state.songs[1].artist.song}</td>
          </tr>
          <tr className="mess-hide">
            <td className="name">{this.state.songs[2].artist.name}</td>
            <td className="song">{this.state.songs[2].artist.song}</td>
          </tr>
          <tr className="mess-hide">
            <td className="name">{this.state.songs[3].artist.name}</td>
            <td className="song">{this.state.songs[3].artist.song}</td>
          </tr>
        </tbody>  
      </table>
    </div>
  </div>
);
}
}
export default AudioPlayer;
