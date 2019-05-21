import _ from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';
import { Row, Col, KeyValue, LayoutHeader } from '@folio/stripes/components';
import css from './AccessRestriction.css';

const AccessRestriction = ({ item }) => {
  return (
    <div className={css.item}>
      <LayoutHeader level={3} title={_.get(item, 'name', '')} noActions />
      <div className={css.content}>
        <Row>
          <Col><KeyValue label="Note" value={_.get(item, 'accessNote', '')} /></Col>
        </Row>
        <Row>
          <Col><KeyValue label="Private?" value={_.get(item, 'private', false)} /></Col>
        </Row>
      </div>
    </div>
  );
};

AccessRestriction.propTypes = {
  item: PropTypes.object,
};

export default AccessRestriction;
