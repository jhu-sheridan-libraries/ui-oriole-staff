import _ from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';
import { Row, Col, KeyValue, LayoutHeader } from '@folio/stripes/components';
import css from './AccessRestriction.css';

const AccessRestriction = ({ item }) => {
  const isPrivate = _.get(item, 'private', 'false') === 'true';
  return (
    <div className={css.item}>
      <LayoutHeader level={3} title={_.get(item, 'type', '')} noActions />
      <div className={css.content}>
        <Row>
          <Col><KeyValue label="Note" value={_.get(item, 'content', '')} /></Col>
        </Row>
        <Row>
          <Col><KeyValue label="Private?" value={isPrivate ? 'Yes' : 'No'} /></Col>
        </Row>
      </div>
    </div>
  );
};

AccessRestriction.propTypes = {
  item: PropTypes.object,
};

export default AccessRestriction;
