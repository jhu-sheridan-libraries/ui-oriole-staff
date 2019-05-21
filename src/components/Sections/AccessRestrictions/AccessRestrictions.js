import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import {
  Row,
  Col,
  Accordion,
  KeyValue,
  Headline,
  Badge
} from '@folio/stripes/components';
import AccessRestriction from './AccessRestriction';
import css from './AccessRestrictions.css';

const AccessRestrictions = ({
  expanded,
  onToggle,
  accordionId,
  accessRestrictions,
}) => {
  const blocks = accessRestrictions.map((item) => {
    return (
      <AccessRestriction item={item} />
    );
  });
  const heading = <FormattedMessage id="ui-oriole.accessRestrictions.heading" />;
  const notFoundMsg = <FormattedMessage id="ui-oriole.notFound" values={{ name: heading }} />;
  return (
    <Accordion
      open={expanded}
      id={accordionId}
      onToggle={onToggle}
      label={<Headline size="large" tag="h3">{heading}</Headline>}
      displayWhenClosed={<Badge>{accessRestrictions.length}</Badge>}
    >
      { blocks.length > 0 ? blocks : <p className={css.isEmptyMessage}>{notFoundMsg}</p> }
    </Accordion>
  );
};

AccessRestrictions.propTypes = {
  expanded: PropTypes.bool,
  onToggle: PropTypes.func,
  accordionId: PropTypes.string.isRequired,
  accessRestrictions: PropTypes.array.isRequired,
};

export default AccessRestrictions;
