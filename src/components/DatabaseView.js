import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import queryString from 'query-string';
import { Pane, PaneMenu, Row, Col, Icon, IconButton, IfPermission, Layer, AccordionSet, Accordion, ExpandAllButton, KeyValue, List } from '@folio/stripes/components';
import { TitleManager } from '@folio/stripes/core';
import DatabasePane from './DatabasePane';

class DatabaseView extends Component {
  static manifest = Object.freeze({
    query: {},
    selResource: {
      type: 'okapi',
      path: 'oriole-resources/:{id}',
      clear: false,
    },
  });

  static propTypes = {
    initialValues: PropTypes.object,
    match: PropTypes.object.isRequired,
    dropdown: PropTypes.object,
    stripes: PropTypes.shape({
      connect: PropTypes.func.isRequired
    }).isRequired,
    onCloseEdit: PropTypes.func,
    onClose: PropTypes.func,
    onEdit: PropTypes.func,
    parentResources: PropTypes.object.isRequired,
    paneWidth: PropTypes.string.isRequired,
    parentMutator: PropTypes.object.isRequired,
    editLink: PropTypes.string,
    mutator: PropTypes.object,
  }

  constructor(props) {
    super(props);
    this.state = {};
  }

  getData = () => {
    const { parentResources, match: { params: { id } } } = this.props;
    const records = (parentResources.records || {}).records || [];
    if (!records || records.length === 0 || !id) return null;
    const data = records.find(u => u.id === id);
    return data;
  }

  update = (resource) => {
    delete resource.resources;
    this.props.mutator.selResource.PUT(resource).then(() => {
      this.setState({
        lastUpdate: new Date().toISOString(),
      });
      this.props.onCloseEdit();
    });
  }

  onRemove = (item) => {
    console.log('remove', item);
  }

  render() {
    const initialValues = this.getData();
    const { stripes, parentResources, location } = this.props;
    const query = location.search ? queryString.parse(location.search) : {};
    // if (!initialValues) {
    //   return (
    //     <Pane id="pane-vendordetails" defaultWidth={this.props.paneWidth} paneTitle="Details" dismissible onClose={this.props.onClose}>
    //       <div style={{ paddingTop: '1rem' }}><Icon icon="spinner-ellipsis" width="100px" /></div>
    //     </Pane>
    //   );
    // }
    const detailMenu = (
      <PaneMenu>
        <IconButton
          icon="edit"
          id="clickable-editoriole"
          style={{ visibility: !initialValues ? 'hidden' : 'visible' }}
          onClick={this.props.onEdit}
          href={this.props.editLink}
          title="Edit"
        />
      </PaneMenu>
    );

    return (
      <Pane defaultWidth={this.props.paneWidth} paneTitle={_.get(initialValues, ['title'], '')} dismissible onClose={this.props.onClose} lastMenu={detailMenu}>
        <TitleManager record={_.get(initialValues, ['title'], '')} />
        <Row>
          <Col>
            <KeyValue label="Title" value={_.get(initialValues, ['title'], '')} />
          </Col>
        </Row>
        <Row>
          <Col>
            <KeyValue label="URL">
              <a href={_.toString(_.get(initialValues, ['url'], ''))} target="_new">
                {_.toString(_.get(initialValues, ['url'], ''))}
              </a>
            </KeyValue>
          </Col>
        </Row>
        <Row>
          <Col>
            <KeyValue label="Description" value={_.get(initialValues, ['description'], '')} />
          </Col>
        </Row>
        <Row>
          <Col>
            <KeyValue label="Publisher" value={_.get(initialValues, ['publisher'], '')} />
          </Col>
        </Row>
        <Row>
          <Col>
            <KeyValue label="Creator" value={_.get(initialValues, ['creator'], '')} />
          </Col>
        </Row>
        <Row>
          <Col>
            <KeyValue label="JHU Subjects">
              <List items={_.get(initialValues, ['tags', 'tagList'], [])} itemFormatter={(item) => <li key={item}>{item}</li>} isEmptyMessage="" />
            </KeyValue>
          </Col>
        </Row>
        <Row>
          <Col>
            <KeyValue label="FAST Terms">
              <List items={_.get(initialValues, ['terms'], [])} itemFormatter={(item) => <li key={item.subject.id}>{item.subject.term}</li>} isEmptyMessage="" />
            </KeyValue>
          </Col>
        </Row>
        <Layer isOpen={query.layer ? query.layer === 'edit' : false} contentLabel="Edit">
          <DatabasePane
            stripes={this.props.stripes}
            initialValues={initialValues}
            onSubmit={(record) => { this.update(record); }}
            onCancel={this.props.onCloseEdit}
            parentMutator={this.props.parentMutator}
            parentResources={this.props.parentResources}
          />
        </Layer>
      </Pane>
    );
  }
}

export default DatabaseView;
