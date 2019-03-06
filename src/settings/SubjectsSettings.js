import React from 'react';
import PropTypes from 'prop-types';
import ControlledVocab from '@folio/stripes-smart-components/lib/ControlledVocab';

class SubjectsSettings extends React.Component {
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
        baseUrl="oriole-subjects"
        records="subjects"
        label={formatMessage({ id: 'ui-oriole.subjects' })}
        labelSingular={formatMessage({ id: 'ui-oriole.subjects' })}
        objectLabel={formatMessage({ id: 'ui-oriole.subject' })}
        hiddenFields={['description', 'numberOfObjects']}
        nameKey="term"
        id="subjects"
        sortby="term"
      />
    );
  }
}

export default SubjectsSettings;
