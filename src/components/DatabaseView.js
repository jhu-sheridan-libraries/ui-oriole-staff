import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Pane, PaneMenu, Row, Col, Icon, IconButton, IfPermission, Layer, AccordionSet, Accordion, ExpandAllButton } from '@folio/stripes-components';
import DatabasePane from './DatabasePane';

class DatabaseView extends Component {
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
  }

  constructor(props) {
    super(props);
    console.log('Database View');
    this.state = {};
    this.connectedDetailsPane = this.props.stripes.connect(DatabasePane);
  }

  getData() {
    const { parentResources, match: { params: { id } } } = this.props;
    const vendors = (parentResources.records || {}).records || [];
    if (!vendors || vendors.length === 0 || !id) return null;
    const data = vendors.find(u => u.id === id);

    return data;
  }

  render() {
    // const initialValues = this.getData();
    // if (!initialValues) {
    //   return (
    //     <Pane id="pane-vendordetails" defaultWidth={this.props.paneWidth} paneTitle="Details" dismissible onClose={this.props.onClose}>
    //       <div style={{ paddingTop: '1rem' }}><Icon icon="spinner-ellipsis" width="100px" /></div>
    //     </Pane>
    //   );
    // }

    return (<div>Database View</div>);
  }
}

export default DatabaseView;
