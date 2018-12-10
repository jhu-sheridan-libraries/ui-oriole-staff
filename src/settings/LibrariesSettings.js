import React from 'react';
import PropTypes from 'prop-types';
import ControlledVocab from '@folio/stripes-smart-components/lib/ControlledVocab';

class LibrariesSettings extends React.Component {
  static propTypes = {
    stripes: PropTypes.shape({
      connect: PropTypes.func.isRequired,
      intl: PropTypes.shape({
        formatMessage: PropTypes.func.isRequired,
      }).isRequired,
    }).isRequired,
  };

  constructor(props) {
    super(props);
    this.connectedControlledVocab = props.stripes.connect(ControlledVocab);
  }

  render() {
    const { formatMessage } = this.props.stripes.intl;

    return (
      <this.connectedControlledVocab
        {...this.props}
        baseUrl="oriole-libraries"
        records="libraries"
        label={formatMessage({ id: 'ui-oriole.libraries' })}
        labelSingular={formatMessage({ id: 'ui-oriole.libraries' })}
        objectLabel={formatMessage({ id: 'ui-inventory.items' })}
        hiddenFields={['description', 'numberOfObjects']}
        nameKey="name"
        id="libraries"
      />
    );
  }
}

export default LibrariesSettings;
