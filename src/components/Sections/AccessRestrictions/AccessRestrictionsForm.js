import React, {Component, Fragment} from 'react';
import { Field, FieldArray, change } from 'redux-form';
import * as Redux from 'react-redux';
import { FormattedMessage } from 'react-intl';
import {
  Row,
  Col,
  Button,
  TextField,
  TextArea,
  RadioButtonGroup,
  RadioButton,
  KeyValue,
  Select
} from '@folio/stripes/components';
import css from './AccessRestrictions.css';


class AccessRestrictionsForm extends Component {
  constructor(props) {
    super(props);
    this.renderForm = this.renderForm.bind(this);
    this.renderSubForm = this.renderSubForm.bind(this);
  }

  togglePrivacy = (event) => {
    let subTargetElements = event.target.id.split('.');
    let privacyTarget = subTargetElements[0] + '.private';
    if (event.target.value == 'Shared ID'){
      this.props.dispatch(change('orioleForm', privacyTarget, true));
    }
    else {
      this.props.dispatch(change('orioleForm', privacyTarget, false));
    }
    
  };

  renderForm = ({ fields }) => {
    return (
      <Fragment>
        <Row>
          <Col xs={12}>
            {fields.length === 0 &&
            <Col xs={6}>
              <FormattedMessage id="ui-oriole.accessRestrictions.empty" />
            </Col>
            }
            {fields.map(this.renderSubForm)}
          </Col>
        </Row>
        <Row>
          <Col xs={12} style={{ paddingTop: '10px' }}>
            <Button onClick={() => fields.push({ private: false })}><FormattedMessage id="ui-oriole.accessRestrictions.add" /></Button>
          </Col>
        </Row>
      </Fragment>
    );
  };

  renderSubForm = (elem, index, fields, dispatch) => {
    return (
      <div className={css.item}>
        <div className={css.content}>
          <Row key={index}>
            <Col xs={12} md={6}>
              <Field label="Type" 
                name={`${elem}.type`} 
                id={`${elem}.type`} 
                component={Select} 
                fullWidth 
                dataOptions={[
                    {value: "Concurrent Users", label: "Concurrent Users"},
                    {value: "Shared ID", label: "Shared ID"},
                    {value: "Register Self-Service", label: "Register Self-Service"},
                    {value: "Register with Staff", label: "Register with Staff"},
                    {value: "Dedicated Workstation", label: "Dedicated Workstation"},
                    {value: "Browser Requirement", label: "Browser Requirement"},
                    {value: "ILL Prohibited", label: "ILL Prohibited"},
                    {value: "No Walk-Ins", label: "No Walk-Ins"},
                    {value: "Data Mining API", label: "Data Mining API"},
                    {value: "Campus Restriction", label: "Campus Restriction"},
                    {value: "Other", label: "Other"}
                ]}
                onChange={this.togglePrivacy}
                //onChange={() => this.props.dispatch(change('orioleForm', 'accessRestrictions[0].private', true))}
                />
            </Col>
            <Col xs={12} md={6}> 
              <KeyValue label="Private?">
                <Field name={`${elem}.private`} id={`${elem}.private`} component={RadioButtonGroup}>
                  <RadioButton label="Yes" value="true" type="radio" inline />
                  <RadioButton label="No" value="false" type="radio" inline />
                </Field>
              </KeyValue>
            </Col>
            <Col xs={12} md={12}>
              <Field label="Access Note" name={`${elem}.content`} id={`${elem}.content`} component={TextArea} fullWidth />
            </Col>
          </Row>
          <Row>
            <Col xs={12} md={12} style={{ textAlign: 'right' }}>
              <Button onClick={() => fields.remove(index)} buttonStyle="danger">
                Remove
              </Button>
            </Col>
          </Row>
        </div>
      </div>
    );
  };

  render() {
    return (
      <FieldArray label="Access Restrictions" name="accessRestrictions" id="accessRestrictions" component={this.renderForm} />
    );
  }
}

export default AccessRestrictionsForm;