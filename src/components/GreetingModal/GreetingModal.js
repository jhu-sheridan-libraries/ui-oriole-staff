import React from 'react';
import PropTypes from 'prop-types';
import { Modal } from '@folio/stripes/components';
import { FormattedMessage } from 'react-intl';


export default class GreetingModal extends React.Component {
  static propTypes = {
    open: PropTypes.bool,
    onClose: PropTypes.func,
  };

  render() {
    return (
      <Modal onClose={this.props.onClose} open={this.props.open} size="small" label="Greeting Message Modal" dismissible closeOnBackgroundClick>
        <div>
          <h2 id="stripes-new-app-greeting"><FormattedMessage id="ui-oriole.greeting" /></h2>
          <FormattedMessage id="ui-oriole.message" />
        </div>
      </Modal>
    );
  }
}
