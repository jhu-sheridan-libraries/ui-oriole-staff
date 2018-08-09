import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { Pane, PaneMenu, Row, Col, Icon, IconButton, IfPermission, Layer, AccordionSet, Accordion, ExpandAllButton, KeyValue } from '@folio/stripes-components';
import TitleManager from '@folio/stripes-core/src/components/TitleManager';
import DatabasePane from './DatabasePane';

class DatabaseView extends Component {
  static propTypes = {
    initialValues: PropTypes.object,
    location: PropTypes.object.isRequired,
    match: PropTypes.object.isRequired,
    dropdown: PropTypes.object,
    stripes: PropTypes.shape({
      hasPerm: PropTypes.func.isRequired,
      connect: PropTypes.func.isRequired,
      locale: PropTypes.string.isRequired,
      logger: PropTypes.shape({
        log: PropTypes.func.isRequired,
      }).isRequired,
      intl: PropTypes.object.isRequired,
    }).isRequired,
    onCloseEdit: PropTypes.func,
    onClose: PropTypes.func,
    onEdit: PropTypes.func,    
    parentResources: PropTypes.object.isRequired,
    paneWidth: PropTypes.string.isRequired,
    parentMutator: PropTypes.object.isRequired,
    editLink: PropTypes.string,
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

  render() {
    const initialValues = this.getData();
    // if (!initialValues) {
    //   return (
    //     <Pane id="pane-vendordetails" defaultWidth={this.props.paneWidth} paneTitle="Details" dismissible onClose={this.props.onClose}>
    //       <div style={{ paddingTop: '1rem' }}><Icon icon="spinner-ellipsis" width="100px" /></div>
    //     </Pane>
    //   );
    // }

    return (
      <Pane defaultWidth={this.props.paneWidth} paneTitle={_.get(initialValues, ['title'], '')} dismissible onClose={this.props.onClose}>
        <TitleManager record={_.get(initialValues, ['title'], '')} />
        <Row>
          <Col>
            <KeyValue label="Title" value={_.get(initialValues, ['title'], '')} />
          </Col>
        </Row>
        <Row>
          <Col>
            <KeyValue label="URL" value={_.toString(_.get(initialValues, ['link'], ''))} />
          </Col>
        </Row>
        <Row>
          <Col>
            <KeyValue label="Description" value={_.get(initialValues, ['description'], '')} />
          </Col>
        </Row>
      </Pane>
    );
  }
}

export default DatabaseView;
