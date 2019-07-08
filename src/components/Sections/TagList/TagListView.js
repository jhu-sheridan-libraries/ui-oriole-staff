import React  from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import {
  List,
  KeyValue,
} from '@folio/stripes/components';

const TagListView = ({ tags }) => (
  <KeyValue label="">
    <List
      items={tags.sort()}
      itemFormatter={(item) => <li key={item}>{item}</li>}
      isEmptyMessage={<FormattedMessage id="ui-oriole.tags.empty" />}
    />
  </KeyValue>
);

TagListView.propTypes = {
  tags: PropTypes.array.isRequired,
};

export default TagListView;
