import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import queryString from 'query-string';
import {
  Pane,
  PaneMenu,
  Row,
  Col,
  Icon,
  IconButton,
  IfPermission,
  Layer,
  AccordionSet,
  Accordion,
  ExpandAllButton,
  KeyValue,
  List
} from '@folio/stripes/components';
import { TitleManager } from '@folio/stripes/core';
import ResourceEditor from '../ResourceEditor';
import { getItemById } from '../../selectors/resource';
import EditTags from '../EditTags';

class ResourceView extends Component {
  static manifest = Object.freeze({
    query: {},
    selResource: {
      type: 'okapi',
      path: 'oriole/resources/:{id}',
      clear: false,
    },
  });

  static propTypes = {
    match: PropTypes.object.isRequired,
    dropdown: PropTypes.object,
    stripes: PropTypes.shape({
      connect: PropTypes.func.isRequired
    }).isRequired,
    onCloseEdit: PropTypes.func,
    onClose: PropTypes.func,
    onEdit: PropTypes.func,
    location: PropTypes.object,
    parentResources: PropTypes.object.isRequired,
    paneWidth: PropTypes.string.isRequired,
    parentMutator: PropTypes.object.isRequired,
    editLink: PropTypes.string,
    mutator: PropTypes.object,
  }

  constructor(props) {
    super(props);
    this.state = {
      sections: {
        notesSection: false
      }
    };
    this.connectedEditTags = props.stripes.connect(EditTags);
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

  handleSectionToggle = ({ id }) => {
    this.setState(curState => {
      const newState = _.cloneDeep(curState);
      newState.sections[id] = !newState.sections[id];
      return newState;
    });
  }

  render() {
    const { stripes, parentResources, location, match: { params: { id } } } = this.props;
    const record = getItemById(parentResources, id);
    const query = location.search ? queryString.parse(location.search) : {};
    // if (!record) {
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
          style={{ visibility: !record ? 'hidden' : 'visible' }}
          onClick={this.props.onEdit}
          href={this.props.editLink}
          title="Edit"
        />
      </PaneMenu>
    );

    return (
      <Pane
        defaultWidth={this.props.paneWidth}
        paneTitle={_.get(record, ['title'], '')}
        dismissible
        onClose={this.props.onClose}
        lastMenu={detailMenu}
      >
        <TitleManager record={_.get(record, ['title'], '')} />
        <Row>
          <Col>
            <KeyValue label="Title" value={_.get(record, ['title'], '')} />
          </Col>
        </Row>
        <Row>
          <Col>
            <KeyValue label="URL">
              <a href={_.toString(_.get(record, ['url'], ''))} target="_new">
                {_.toString(_.get(record, ['url'], ''))}
              </a>
            </KeyValue>
          </Col>
        </Row>
        <Row>
          <Col>
            <KeyValue label="JHU ID" value={_.get(record, ['altId'])} />
          </Col>
        </Row>
        <Row>
          <Col>
            <KeyValue label="Description" value={_.get(record, ['description'], '')} />
          </Col>
        </Row>
        <Row>
          <Col>
            <KeyValue label="Publisher" value={_.get(record, ['publisher'], '')} />
          </Col>
        </Row>
        <Row>
          <Col>
            <KeyValue label="Creator" value={_.get(record, ['creator'], '')} />
          </Col>
        </Row>
        <this.connectedEditTags {...this.props} heading="Tags" initialValues={record} isEditing={false} />
        <Row>
          <Col>
            <KeyValue label="JHU Subjects">
              <List
                items={_.get(record, ['tags', 'tagList'], [])}
                itemFormatter={(item) => <li key={item}>{item}</li>}
                isEmptyMessage=""
              />
            </KeyValue>
          </Col>
        </Row>
        <Row>
          <Col>
            <KeyValue label="FAST Terms">
              <List
                items={_.get(record, ['terms'], [])}
                itemFormatter={(item) => <li key={item.subject.id}>{item.subject.term}</li>}
                isEmptyMessage=""
              />
            </KeyValue>
          </Col>
        </Row>
        <Layer isOpen={query.layer ? query.layer === 'edit' : false} contentLabel="Edit">
          <ResourceEditor
            stripes={this.props.stripes}
            onSubmit={(item) => {
              this.update(item);
            }}
            onCancel={this.props.onCloseEdit}
            initialValues={record}
            isEditing
            {...this.props}
          />
        </Layer>
      </Pane>
    );
  }
}

export default ResourceView;
