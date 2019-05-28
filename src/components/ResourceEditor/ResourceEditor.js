import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import {
  Pane,
  PaneMenu,
  IconButton,
  IfPermission,
  Button,
  Row,
  Col,
  TextField,
  TextArea,
  Accordion,
  AccordionSet,
  Badge,
  KeyValue,
  RadioButton,
  RadioButtonGroup
} from '@folio/stripes/components';
// eslint-disable-next-line no-unused-vars
import { Field } from 'redux-form';
import _ from 'lodash';
import stripesForm from '@folio/stripes/form';
import { TagListForm } from '../Sections/TagList';
import { AccessRestrictionsForm } from '../Sections/AccessRestrictions';
import { getItemById } from '../../selectors/resource';


function validate(values, props) {
  const errors = {};
  return errors;
}

class ResourceEditor extends Component {
  static propTypes = {
    match: PropTypes.object.isRequired,
    stripes: PropTypes.shape({
      connect: PropTypes.func,
    }).isRequired,
    handleSubmit: PropTypes.func.isRequired,
    parentMutator: PropTypes.object,
    parentResources: PropTypes.object,
    pristine: PropTypes.bool,
    submitting: PropTypes.bool,
    onCancel: PropTypes.func,
    onRemove: PropTypes.func,
    initialValues: PropTypes.object,
    expanded: PropTypes.bool,
    accordionId: PropTypes.string,
    onToggle: PropTypes.func,
  };

  constructor(props) {
    super();
    this.state = {
      sections: {
        notesSection: false
      }
    };
    this.connectedTagListForm = props.stripes.connect(TagListForm);
  }

  handleSectionToggle = ({ id }) => {
    this.setState(curState => {
      const newState = _.cloneDeep(curState);
      newState.sections[id] = !newState.sections[id];
      return newState;
    });
  }

  getLastMenu = (id, label) => {
    const { pristine, submitting, handleSubmit } = this.props;

    return (
      <PaneMenu>
        <Button
          id={id}
          type="submit"
          title={label}
          disabled={pristine || submitting}
          onClick={handleSubmit}
          style={{ marginBottom: '0' }}
        >
          {label}
        </Button>
      </PaneMenu>
    );
  };

  deleteResource = (id) => {
    const { parentMutator } = this.props;
    parentMutator.records.DELETE({ id }).then(() => {
      parentMutator.query.update({
        _path: '/oriole/resources',
        layer: null
      });
    });
  };

  render() {
    const { parentResources, expanded, accordionId, onToggle, match: { params: { id } } } = this.props;
    const initialValues = getItemById(parentResources, id);
    const firstMenu = (
      <PaneMenu>
        <IconButton id="clickable-closeneworioledialog" onClick={this.props.onCancel} title="Close" icon="times" />
      </PaneMenu>
    );
    let lastMenu;
    let paneTitle;
    let showDeleteButton;
    if (typeof id === 'undefined') {
      lastMenu = this.getLastMenu('clickable-createnewdatabase', 'Create');
      paneTitle = 'Create Database';
      showDeleteButton = false;
    } else {
      lastMenu = this.getLastMenu('clickable-updatedatabase', 'Update');
      paneTitle = <span>Edit: {_.get(initialValues, ['title'], '')} </span>;
      showDeleteButton = true;
    }
    const accessRestrictions = _.get(initialValues, 'accessRestrictions', []);
    const tags = _.get(initialValues, ['tags', 'tagList'], []);

    return (
      <form id="form-resource">
        <div id="form-add-new-resource">
          <Pane defaultWidth="100%" firstMenu={firstMenu} lastMenu={lastMenu} paneTitle={paneTitle}>
            <Row>
              <Col xs={8}>
                <Field label="Title" name="title" id="title" component={TextField} fullWidth />
                <Field label="Alternative Titles" name="altTitle" id="altTitle" component={TextField} fullWidth />
                <Field label="URL" name="url" id="url" component={TextField} fullWidth />
                {
                  typeof id !== 'undefined' &&
                  <KeyValue label="JHU ID" value={_.get(initialValues, ['altId'])} />
                }
                <KeyValue label="Proxy?">
                  <Field name="proxy" id="proxy" component={RadioButtonGroup}>
                    <RadioButton label="Yes" value="true" inline />
                    <RadioButton label="No" value="false" inline />
                  </Field>
                </KeyValue>
                <Field label="Description" name="description" id="description" component={TextArea} fullWidth style={{ height: 120 }} />
                <Field label="Publisher" name="publisher" id="publisher" component={TextField} fullWidth />
                <Field label="Creator" name="creator" id="creator" component={TextField} fullWidth />
                <Field label="Note" name="note" id="note" component={TextArea} fullWidth style={{ height: 120 }} />
                <AccordionSet accordionStatus={this.state.sections} onToggle={this.handleSectionToggle}>
                  <Accordion
                    label={<FormattedMessage id="ui-oriole.tags.heading" />}
                    id="tagsSection"
                    displayWhenClosed={<Badge>{tags.length}</Badge>}
                  >
                    <this.connectedTagListForm {...this.props} name="tags.tagList" />
                  </Accordion>
                  <Accordion
                    id="accessRestrictionsSection"
                    label={<FormattedMessage id="ui-oriole.accessRestrictions.heading" />}
                    displayWhenClosed={<Badge>{accessRestrictions.length}</Badge>}
                  >
                    <AccessRestrictionsForm {...this.props} />
                  </Accordion>
                </AccordionSet>
              </Col>
            </Row>
            {/* <IfPermission perm="oriole.resources.item.delete"> */}
            <Row end="xs">
              <Col xs={12}>
                {
                  showDeleteButton &&
                  <Button type="button" buttonStyle="danger" onClick={() => { this.deleteResource(this.props.initialValues.id); }}>Remove</Button>
                }
              </Col>
            </Row>
            {/* </IfPermission> */}
          </Pane>
        </div>
      </form>
    );
  }
}

export default stripesForm({
  form: 'orioleForm',
  validate,
  undefined,
  asyncBlurFields: ['title'],
  navigationCheck: true,
  enableReinitialize: true,
})(ResourceEditor);
