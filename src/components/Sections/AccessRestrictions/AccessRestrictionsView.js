import _ from 'lodash';
import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Row, Col, KeyValue, LayoutHeader } from '@folio/stripes/components';
import css from './AccessRestrictions.css';

const AccessRestrictionsView = ({
  accessRestrictions,
}) => {
  const heading = <FormattedMessage id="ui-oriole.accessRestrictions.heading" />;
  const notFoundMsg = <FormattedMessage id="ui-oriole.notFound" values={{ name: heading }} />;
  let blocks;
  if (accessRestrictions.length > 0) {
    blocks = accessRestrictions.map((item) => (
      <div className={css.item}>
        <LayoutHeader level={3} title={_.get(item, 'type', '')} noActions />
        <div className={css.content}>
          <Row>
            <Col>
              <KeyValue label="Note" value={_.get(item, 'content', '')} />
            </Col>
          </Row>
          <Row>
            <Col>
              <KeyValue
                label="Private?"
                value={_.get(item, 'private', 'false') === 'true' ? 'Yes' : 'No'}
              />
            </Col>
          </Row>
        </div>
      </div>
    ));
  } else {
    blocks = <p className={css.isEmptyMessage}>{notFoundMsg}</p>;
  }

  return (
    <Fragment>
      { blocks }
    </Fragment>
  );
};

AccessRestrictionsView.propTypes = {
  accessRestrictions: PropTypes.array.isRequired,
};

export default AccessRestrictionsView;
