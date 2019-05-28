import React from 'react';
import { injectIntl, intlShape } from 'react-intl';
import { Settings } from '@folio/stripes/smart-components';
import GeneralSettings from './general-settings';
import LibrariesSettings from './LibrariesSettings';

class OrioleSettings extends React.Component {
  static propTypes = {
    intl: intlShape.isRequired,
  };

  constructor(props) {
    super(props);
    const { formatMessage } = this.props.intl;

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
            route: 'libraries',
            label: formatMessage({ id: 'ui-oriole.libraries' }),
            component: LibrariesSettings,
            perm: 'oriole.libraries.admin'
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

export default injectIntl(OrioleSettings);
