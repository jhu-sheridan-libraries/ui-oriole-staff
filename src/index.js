import React from 'react';
import PropTypes from 'prop-types';
import Switch from 'react-router-dom/Switch';
import Route from 'react-router-dom/Route';
import Main from './components/Main';
import ExamplePage from './routes/example-page';
import Settings from './settings';

/*
  STRIPES-NEW-APP
  This is the main entry point into your new app.
*/

class Oriole extends React.Component {
  static propTypes = {
    match: PropTypes.object.isRequired,
    showSettings: PropTypes.bool,
    stripes: PropTypes.object.isRequired,
    mutator: PropTypes.object,
  }

  constructor(props, context) {
    super(props, context);
    this.connectedApp = props.stripes.connect(Main);
  }

  render() {
    if (this.props.showSettings) {
      return <Settings {...this.props} />;
    }
    return (
      <Switch>
        <Route path={`${this.props.match.path}`} render={(props) => <this.connectedApp {...props} stripes={this.props.stripes} />} />;
        <Route path={`${this.props.match.path}/examples`} exact component={ExamplePage} />
        <Route component={() => { this.NoMatch(); }} />
      </Switch>
    );
  }
}

export default Oriole;
