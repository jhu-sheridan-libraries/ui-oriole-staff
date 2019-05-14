import _ from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import {
  Row,
  Col,
  Accordion,
  KeyValue,
  Headline
} from '@folio/stripes/components';

const Notes = ({
  expanded,
  onToggle,
  accordionId,
  record,
}) => {
  const notesBlocks = record.notes.map(note => (
    <Row>
      <Col xs={12} md={3}>
        <KeyValue label="name" value={note.name} />
      </Col>
      <Col xs={12} md={3}>
        <KeyValue label="public" value={note.public} />
      </Col>
      <Col xs={12} md={6}>
        <KeyValue label="note" value={note.value} />
      </Col>
    </Row>
  ));

  return (
    <Accordion
      open={expanded}
      id={accordionId}
      onToggle={onToggle}
      label={<Headline size="large" tag="h3">Notes</Headline>}
    >
      { notesBlocks }
    </Accordion>
  );
};

Notes.propTypes = {
  expanded: PropTypes.bool,
  onToggle: PropTypes.func,
  accordionId: PropTypes.string.isRequired,
  record: PropTypes.object,
};

export default Notes;
