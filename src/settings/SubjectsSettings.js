import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { ControlledVocab } from '@folio/stripes/smart-components';

class SubjectsSettings extends React.Component {
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
        baseUrl="oriole/subjects"
        records="subjects"
        label={<FormattedMessage id="ui-oriole.subjects" />}
        labelSingular={<FormattedMessage id="ui-oriole.subjects" />}
        objectLabel={<FormattedMessage id="ui-oriole.subjects" />}
        hiddenFields={['description', 'numberOfObjects']}
        nameKey="term"
        id="subjects-settings"
        sortby="term"
      />
    );
  }
}

export default SubjectsSettings;
