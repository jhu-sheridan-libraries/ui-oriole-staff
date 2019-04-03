import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Pane, PaneMenu, IconButton, IfPermission, Button, Row, Col, List, TextField, TextArea, Accordion, Headline, Badge } from '@folio/stripes/components';
import { Field } from 'redux-form';
import _ from 'lodash';
import stripesForm from '@folio/stripes/form';
import EditTags from '../EditTags';
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
  }

  constructor(props) {
    super();
    this.connectedEditTags = props.stripes.connect(EditTags);
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
  }

  deleteResource = (id) => {
    const { parentMutator } = this.props;
    parentMutator.records.DELETE({ id }).then(() => {
      parentMutator.query.update({
        _path: '/oriole-resources',
        layer: null
      });
    });
  }

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
      lastMenu = this.getLastMenu('clickable-createnewuser', 'Create');
      paneTitle = 'Create Resource';
      showDeleteButton = false;
    } else {
      lastMenu = this.getLastMenu('clickable-updateuser', 'Update');
      paneTitle = <span>Edit: {_.get(initialValues, ['title'], '')} </span>;
      showDeleteButton = true;
    }

    return (
      <form id="form-resource">
        <div id="form-add-new-resource">
          <Pane defaultWidth="100%" firstMenu={firstMenu} lastMenu={lastMenu} paneTitle={paneTitle}>
            <Row>
              <Col xs={8}>
                <Field label="Title" name="title" id="title" component={TextField} fullWidth />
                {/* <Field label="URL" name="url" id="url" component={TextField} fullWidth />
                <Field label="Description" name="description" id="description" component={TextArea} fullWidth />
                <Field label="Publisher" name="publisher" id="publisher" component={TextField} fullWidth />
                <Field label="Creator" name="creator" id="creator" component={TextField} fullWidth /> */}
                <this.connectedEditTags {...this.props} heading="Tags" />
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
