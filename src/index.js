import React from 'react';
import PropTypes from 'prop-types';
import Switch from 'react-router-dom/Switch';
import Route from 'react-router-dom/Route';
import Application from './routes/application';
import ExamplePage from './routes/example-page';
import Databases from './routes/databases';
import Settings from './settings';

/*
  STRIPES-NEW-APP
  This is the main entry point into your new app.
*/

class Oriole extends React.Component {
  static propTypes = {
    match: PropTypes.object.isRequired,
    showSettings: PropTypes.bool,
    stripes: PropTypes.object,
  }

  constructor(props, context) {
    super(props, context);
    this.connectedApp = props.stripes.connect(Databases);
  }

  render() {
    if (this.props.showSettings) {
      return <Settings {...this.props} />;
    }
    return (
      <Switch>
        <Route path={`${this.props.match.path}`} render={(props) => <this.connectedApp {...props} />} />;
        <Route path={`${this.props.match.path}/examples`} exact component={ExamplePage} />
      </Switch>
    );
  }
}

export default Oriole;
