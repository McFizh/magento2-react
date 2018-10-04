import React, { Component } from 'react';

import TopMenu from './containers/TopMenu';

import './css/App.css';

// 
const STATE_LOADER = 'loader';

//
class AppRouter extends Component {

  constructor(props) {
    super(props);

    this.state = {
        module: STATE_LOADER
    }
  }

  componentDidMount() {
    let path = this.props.location.pathname;
  }

  render() {
    return (
        <div><TopMenu /></div>
    );
  }

}

export default AppRouter;
