import React  from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import {
  List,
  KeyValue,
} from '@folio/stripes/components';

const AvailabilityView = ({ locations }) => (
  <KeyValue label="">
    <List
      items={locations}
      itemFormatter={(item) => <li key={item}>{item}</li>}
      isEmptyMessage={<FormattedMessage id="ui-oriole.availability.empty" />}
    />
  </KeyValue>
);

AvailabilityView.propTypes = {
  locations: PropTypes.array.isRequired,
};

export default AvailabilityView;
