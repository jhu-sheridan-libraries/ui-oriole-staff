import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import queryString from 'query-string';
import { FormattedMessage, injectIntl, intlShape } from 'react-intl';
import {
  Pane,
  PaneMenu,
  Row,
  Col,
  IconButton,
  Layer,
  AccordionSet,
  Accordion,
  KeyValue,
  Badge,
} from '@folio/stripes/components';
import { TitleManager } from '@folio/stripes/core';
import ResourceEditor from '../ResourceEditor';
import { getItemById } from '../../selectors/resource';
import { TagListView } from '../Sections/TagList';
import { AccessRestrictionsView } from '../Sections/AccessRestrictions';
import AvailabilityView from '../Sections/Availability/AvailabilityView';

class ResourceView extends Component {
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
    intl: intlShape.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      sections: {
        notesSection: false
      }
    };
  }

  getData = () => {
    const { parentResources, match: { params: { id } } } = this.props;
    const records = (parentResources.records || {}).records || [];
    if (!records || records.length === 0 || !id) return null;
    const data = records.find(u => u.id === id);
    return data;
  };

  update = (resource) => {
    delete resource.resources;
    console.log(this.props)
    console.log(this.props.parentMutator)
    console.log(this.props.parentMutator.records)
    this.props.parentMutator.records.PUT(resource).then(() => {
      this.setState({
        lastUpdate: new Date().toISOString(),
      });
      this.props.onCloseEdit();
    });
  };

  handleSectionToggle = ({ id }) => {
    this.setState(curState => {
      const newState = _.cloneDeep(curState);
      newState.sections[id] = !newState.sections[id];
      return newState;
    });
  };

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
    const accessRestrictions = _.get(record, 'accessRestrictions', []);
    const tags = _.get(record, ['tags', 'tagList'], []);

    return (
      <Pane
        defaultWidth={this.props.paneWidth}
        paneTitle={_.get(record, ['title'], '')}
        dismissible
        onClose={this.props.onClose}
        lastMenu={detailMenu}
      >
        <TitleManager record={_.get(record, 'title', '')} />
        <Row>
          <Col>
            <KeyValue label="Title" value={_.get(record, 'title', '')} />
          </Col>
        </Row>
        <Row>
          <Col>
            <KeyValue label="Alternative Titles" value={_.get(record, 'altTitle', '')} />
          </Col>
        </Row>
        <Row>
          <Col>
            <KeyValue label="URL">
              <a href={_.toString(_.get(record, 'url', ''))} target="_new">
                {_.toString(_.get(record, 'url', ''))}
              </a>
            </KeyValue>
          </Col>
        </Row>
        <Row>
          <Col>
            <KeyValue label="Proxy?">
              {_.get(record, 'proxy', true) ? 'Yes' : 'No'}
            </KeyValue>
          </Col>
        </Row>
        <Row>
          <Col>
            <KeyValue label="JHU ID" value={_.get(record, 'altId')} />
          </Col>
        </Row>
        <Row>
          <Col>
            <KeyValue label="Description">
              <div dangerouslySetInnerHTML={{ __html: _.get(record, 'description', '').replace(/\r?\n/g, '<br/>') }} />
            </KeyValue>
          </Col>
        </Row>
        <Row>
          <Col>
            <KeyValue label="Provider" value={_.get(record, 'provider', '')} />
          </Col>
        </Row>
        <Row>
          <Col>
            <KeyValue label="Staff Notes">
              <div dangerouslySetInnerHTML={{ __html: _.get(record, 'note', '').replace(/\r?\n/g, '<br/>') }} />
            </KeyValue>
          </Col>
        </Row>
        <AccordionSet accordionStatus={this.state.sections} onToggle={this.onToggleSection}>
          <Accordion
            label={<FormattedMessage id="ui-oriole.tags.heading" />}
            id="tagsSection"
            displayWhenClosed={<Badge>{tags.length}</Badge>}
          >
            <TagListView tags={tags} />
          </Accordion>
          <Accordion
            label={<FormattedMessage id="ui-oriole.availability.heading"/>}
            id="availabilitySection"
          >
            <AvailabilityView locations={_.get(record, 'availability', [])} />
          </Accordion>
          <Accordion
            id="accessRestrictionsSection"
            label={<FormattedMessage id="ui-oriole.accessRestrictions.heading" />}
            displayWhenClosed={<Badge>{accessRestrictions.length}</Badge>}
          >
            <AccessRestrictionsView accessRestrictions={accessRestrictions} />
          </Accordion>
        </AccordionSet>
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

export default injectIntl(ResourceView);
