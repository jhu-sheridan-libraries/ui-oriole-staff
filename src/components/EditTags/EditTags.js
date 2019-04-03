import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import EditableTags from '../EditableTags';

class EditTags extends React.Component {
  static manifest = Object.freeze({
    availableTags: {
      type: 'okapi',
      records: 'tags',
      path: 'oriole-tags',
    },
  });

  static propTypes = {
    stripes: PropTypes.object.isRequired,
    resources: PropTypes.shape({
      availableTags: PropTypes.shape({
        records: PropTypes.arrayOf(PropTypes.string),
      }),
    }).isRequired,
  }

  render() {
    const { resources } = this.props;
    const availableTags = (resources.availableTags || {}).records || [];
    return (
      <EditableTags
        {...this.props}
        heading={<FormattedMessage id="ui-oriole.tags.heading" />}
        availableTags={availableTags}
        // listedPermissions={userPermissions}
      />
    );
  }
}

export default EditTags;
