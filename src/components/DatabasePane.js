import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { PaneSet, Pane, PaneMenu, IconButton, IfPermission, Button, Row, Col, AccordionSet, Accordion, ExpandAllButton, Checkbox, Select, TextField, TextArea } from '@folio/stripes-components';
import { Field } from 'redux-form';
import _ from 'lodash';
import stripesForm from '@folio/stripes-form';

function validate(values, props) {
  const errors = {};
  return errors;
}

class DatabasePane extends Component {
  static propTypes = {
    // stripes: PropTypes.object.isRequired,
    // handleSubmit: PropTypes.func.isRequired,
    // onCancel: PropTypes.func,
    // initialValues: PropTypes.object,
    stripes: PropTypes.shape({
      connect: PropTypes.func,
      intl: PropTypes.object.isRequired,
    }).isRequired,
    handleSubmit: PropTypes.func.isRequired,
    parentMutator: PropTypes.shape({ // eslint-disable-line react/no-unused-prop-types
      uniquenessValidator: PropTypes.shape({
        reset: PropTypes.func.isRequired,
        GET: PropTypes.func.isRequired,
      }).isRequired,
    }),
    parentResources: PropTypes.shape({
      locations: PropTypes.shape({
        records: PropTypes.arrayOf(PropTypes.object),
      }),
    }),
    pristine: PropTypes.bool,
    submitting: PropTypes.bool,
    onCancel: PropTypes.func,
    initialValues: PropTypes.object,
  }

  getLastMenu = (id, label) => {
    const { pristine, submitting } = this.props;

    return (
      <PaneMenu>
        <Button
          id={id}
          type="submit"
          title={label}
          disabled={pristine || submitting}
          buttonStyle="primary paneHeaderNewButton"
          marginBottom0
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
        _path: '/oriole',
        layer: null
      });
    });
  }

  render() {
    const { initialValues, handleSubmit, parentResources: { locations } } = this.props;
    const firstMenu = (
      <PaneMenu>
        <IconButton id="clickable-closeneworioledialog" onClick={this.props.onCancel} title="Close" icon="closeX" />
      </PaneMenu>
    );
    const lastMenu = initialValues.id ?
      this.getLastMenu('clickable-updateuser', 'Update') :
      this.getLastMenu('clickable-createnewuser', 'Create');
    const paneTitle = initialValues.id ? <span>Edit: {_.get(initialValues, ['title'], '')} </span> : 'Create Resource';
    const showDeleteButton = initialValues.id || false;

    const locationOptions = (locations.records || []).map(t => ({
      label: t.name,
      value: t.id,
      selected: (initialValues.location) ? initialValues.location.id === t.id : false,
    }));

    return (
      <form id="form-resource" onSubmit={handleSubmit}>
        <div id="form-add-new-resource">
          <Pane defaultWidth="100%" firstMenu={firstMenu} lastMenu={lastMenu} paneTitle={paneTitle}>
            <Row>
              <Col xs={8}>
                <Field label="Title" name="title" id="title" component={TextField} fullWidth />
                <Field label="URL" name="url" id="url" component={TextField} fullWidth />
                <Field label="Description" name="description" id="description" component={TextArea} fullWidth />
                <Field
                  label="Location"
                  name="locationId"
                  id="adddatabase_location"
                  component={Select}
                  fullWidth
                  dataOptions={[{ label: 'XX', value: '' }, ...locationOptions]}
                />
              </Col>
            </Row>
            <IfPermission perm="oriole.resources.item.delete">
              <Row end="xs">
                <Col xs={12}>
                  {
                    showDeleteButton &&
                    <Button type="button" buttonStyle="danger" onClick={() => { this.deleteResource(this.props.initialValues.id); }}>Remove</Button>
                  }
                </Col>
              </Row>
            </IfPermission>
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
})(DatabasePane);
