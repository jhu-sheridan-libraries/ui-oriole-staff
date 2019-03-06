import React from 'react';
import PropTypes from 'prop-types';
import Settings from '@folio/stripes-components/lib/Settings';
import GeneralSettings from './general-settings';
import SomeFeatureSettings from './some-feature-settings';
import SubjectsSettings from './SubjectsSettings';


class OrioleSettings extends React.Component {
  static propTypes = {
    stripes: PropTypes.shape({
      intl: PropTypes.shape({
        formatMessage: PropTypes.func.isRequired,
      }).isRequired,
    }).isRequired,
  }
  constructor(props) {
    super(props);
    const { formatMessage } = this.props.stripes.intl;

    this.sections = [
      {
        label: formatMessage({ id: 'ui-oriole.general' }),
        pages: [
          {
            route: 'general',
            label: formatMessage({ id: 'ui-oriole.settings.general' }),
            component: GeneralSettings,
          },
          {
            route: 'somefeature',
            label: formatMessage({ id: 'ui-oriole.settings.some-feature' }),
            component: SomeFeatureSettings,
          },
        ]
      },
      {
        label: formatMessage({ id: 'ui-oriole.categories' }),
        pages: [
          {
            route: 'subjects',
            label: formatMessage({ id: 'ui-oriole.subjects' }),
            component: SubjectsSettings,
            perm: 'oriole.subjects.admin'
          }
        ]
      }
    ];
  }


  render() {
    return (
      <Settings {...this.props} sections={this.sections} paneTitle="Oriole" />
    );
  }
}

export default OrioleSettings;
