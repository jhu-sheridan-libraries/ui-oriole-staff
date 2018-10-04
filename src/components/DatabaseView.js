import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import queryString from 'query-string';
import { Pane, PaneMenu, Row, Col, Icon, IconButton, IfPermission, Layer, AccordionSet, Accordion, ExpandAllButton, KeyValue } from '@folio/stripes-components';
import TitleManager from '@folio/stripes-core/src/components/TitleManager';
import DatabasePane from './DatabasePane';

class DatabaseView extends Component {
  static manifest = Object.freeze({
    query: {},
    selResource: {
      type: 'okapi',
      path: 'resources/:{id}',
      clear: false,
    }
  });

  static propTypes = {
    initialValues: PropTypes.object,
    location: PropTypes.object.isRequired,
    match: PropTypes.object.isRequired,
    dropdown: PropTypes.object,
    stripes: PropTypes.object.isRequired,
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
    // this.connectedDetailsPane = this.props.stripes.connect(DatabasePane);
  }

  getData = () => {
    const { parentResources, match: { params: { id } } } = this.props;
    const vendors = (parentResources.records || {}).records || [];
    if (!vendors || vendors.length === 0 || !id) return null;
    const data = vendors.find(u => u.id === id);

    return data;
  }

  update = (resource) => {
    console.log(resource);
    console.log(this.props.mutator);
    delete resource.resources;
    this.props.mutator.selResource.PUT(resource).then(() => {
      this.setState({
        lastUpdate: new Date().toISOString(),
      });
      this.props.onCloseEdit();
    });
  }

  render() {
    const initialValues = this.getData();
    const { stripes, parentResources, location } = this.props;
    console.log(parentResources);
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
        <Layer isOpen={query.layer ? query.layer === 'edit' : false} contentLabel="Edit">
          <DatabasePane
            stripes={this.props.stripes}
            initialValues={initialValues}
            onSubmit={(record) => { this.update(record); }}
            onCancel={this.props.onCloseEdit}
            parentMutator={this.props.parentMutator}
          />
        </Layer>
      </Pane>
    );
  }
}

export default DatabaseView;
