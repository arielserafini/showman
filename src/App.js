import React, { Component } from 'react';
import axios from 'axios';
import _ from 'lodash';
import logo from './logo.svg';
import './App.css';

class App extends Component {
  state = {
    shows: [],
    networks: [],
    activeFilter: {}
  };

  filterShowsByNetwork(id) {
    let filter = {};

    if (id) {
      filter = {
        network: {
          id: parseInt(id, 10)
        }
      }
    }

    this.setState({
      activeFilter: filter
    });
  }

  extractFromProp(data, prop, trackByProp='id') {
    let extractedData = data.map(item => item[prop]);

    return _.uniqBy(extractedData, trackByProp);
  }

  parseShowData(data) {
    let shows = this.extractFromProp(data, 'show');
    let networks = this.extractFromProp(shows, 'network');

    this.setState({
      shows: shows,
      networks: networks
    })
  }

  componentDidMount() {
    axios.get('http://api.tvmaze.com/schedule').then(data => this.parseShowData(data.data));
  }

  render() {
    return (
      <div className="App">
        <div className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h2>showman</h2>
        </div>
        <NetworkFilter onChange={(e)=>{this.filterShowsByNetwork(e.target.value)}} networks={this.state.networks}/>
        <ShowList shows={this.state.shows} filter={this.state.activeFilter}/>
      </div>
    );
  }
}

class ShowList extends Component {
  render() {
    let shows = this.props.shows;
    let filter = this.props.filter;
    let showItems = _.filter(shows, filter).map(show => {
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
  render() {
    let show = this.props.data;
    return (
      <span>{show.name} ({show.network.name})</span>
    );
  }
}

class NetworkFilter extends Component {

  render() {
    let renderOptions = this.props.networks.map(network => {
        return (
          <option key={network.id} value={network.id}>{network.name}</option>
        );
    });

    return (
      <select onChange={this.props.onChange}>
        <option value="">All networks</option>
        {renderOptions}
      </select>
    )
  }
}

export default App;
