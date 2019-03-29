import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { ControlledVocab } from '@folio/stripes/smart-components';

class LibrariesSettings extends React.Component {
  static propTypes = {
    stripes: PropTypes.shape({
      connect: PropTypes.func.isRequired,
    }).isRequired,
  };

  constructor(props) {
    super(props);
    this.connectedControlledVocab = props.stripes.connect(ControlledVocab);
  }

  render() {
    return (
      <this.connectedControlledVocab
        {...this.props}
        dataKey={undefined}
        baseUrl="oriole-libraries"
        records="libraries"
        label={<FormattedMessage id="ui-oriole.libraries" />}
        labelSingular={<FormattedMessage id="ui-oriole.library" />}
        objectLabel={<FormattedMessage id="ui-oriole.libraries" />}
        hiddenFields={['description', 'numberOfObjects']}
        nameKey="library"
        id="libraries-settings"
      />
    );
  }
}

export default LibrariesSettings;
