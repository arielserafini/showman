import React, { Component } from 'react';
import axios from 'axios';
import _ from 'lodash';
import './App.css';
import { Layout, Header, Content, Grid, Cell} from 'react-mdl';
import { List, ListItem, ListItemContent} from 'react-mdl';
import { Chip, Badge } from 'react-mdl';

class App extends Component {
  state = {
    dataLoaded: false,
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
    let networks = _.sortBy(this.extractFromProp(shows, 'network'), 'name');

    networks.forEach(item => {
      item.showCount = _.filter(shows, {network: {id: item.id} }).length;
    });

    this.setState({
      shows: shows,
      networks: networks,
      dataLoaded: true
    });
  }

  componentDidMount() {
    if (!this.state.dataLoaded) { 
      axios.get('http://api.tvmaze.com/schedule').then(data => this.parseShowData(data.data));
    }
  }

  handleNetworkClick = (value) => { this.filterShowsByNetwork(value) }

  render() {
    return (
      <Layout>
        <Header>
          <h2>showman</h2>
        </Header>
        <Content>
          <Grid>
            <Cell col={6}>
              <h3>TV Shows</h3>
              <ShowList shows={this.state.shows} filter={this.state.activeFilter}/>
            </Cell>
            <Cell col={6}>
              <h3>Networks</h3>
              <NetworkChips onNetworkClick={ this.handleNetworkClick } networks={this.state.networks}/>
            </Cell>
          </Grid>
        </Content>
      </Layout>
    );
  }
}

class ShowList extends Component {
  render() {
    let shows = this.props.shows;
    let filter = this.props.filter;
    let showItems = _.filter(shows, filter).map(show => {
      return (
          <Show key={show.id} data={show}/>
      );
    });
    return (
      <List>
        {showItems}
      </List>
    );
  }
}

class Show extends Component {
  render() {
    let show = this.props.data;
    return (
      <ListItem twoLine>
        <ListItemContent subtitle={show.network.name}>{show.name}</ListItemContent>
      </ListItem>
    );
  }
}

class NetworkChips extends Component {
  render() {
    let chips = this.props.networks.map(network => {
      return (
        <Badge key={network.id} text={network.showCount} overlap>
          <Chip style={{marginRight: 5}} onClick={() => this.props.onNetworkClick(network.id)} key={network.id}>{network.name}</Chip>
        </Badge>
      );
    });
    return (
      <div>
        {chips}
      </div>
    );
  }
}

export default App;
