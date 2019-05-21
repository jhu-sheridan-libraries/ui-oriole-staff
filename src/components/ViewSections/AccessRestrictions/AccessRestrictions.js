import React from 'react';
import PropTypes from 'prop-types';
import {
  Row,
  Col,
  Accordion,
  KeyValue,
  Headline,
  Badge
} from '@folio/stripes/components';
import AccessRestriction from './AccessRestriction';

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
  return (
    <Accordion
      open={expanded}
      id={accordionId}
      onToggle={onToggle}
      label={<Headline size="large" tag="h3">Access Restrictions</Headline>}
      displayWhenClosed={<Badge>{accessRestrictions.length}</Badge>}
    >
      { blocks }
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
