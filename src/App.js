import React, { Component } from 'react';
import axios from 'axios';
import logo from './logo.svg';
import './App.css';

class App extends Component {
  state = {
    shows: []
  };

  updateShows(shows) {
    this.setState({
      shows: shows
    });
  }

  componentDidMount() {
    axios.get('http://api.tvmaze.com/schedule').then(data => this.updateShows(data.data));
  }

  render() {
    return (
      <div className="App">
        <div className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h2>showman</h2>
        </div>
        <ShowList shows={this.state.shows}/>
      </div>
    );
  }
}

class ShowList extends Component {
  render() {
    let showItems = this.props.shows.map(show => {
      return (
        <li key={show.id}>
          <Show data={show}/>
        </li>
      );
    });
    return (
      <ul>
        {showItems}
      </ul>
    );
  }
}

class Show extends Component {
  state = this.props.data;

  render() {
    return (
      <span>{this.state.name}</span>
    );
  }
}

export default App;
