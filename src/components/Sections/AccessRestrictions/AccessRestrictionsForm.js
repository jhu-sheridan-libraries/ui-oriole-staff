import React, {Component, Fragment} from 'react';
import { Field, FieldArray } from 'redux-form';
import { FormattedMessage } from 'react-intl';
import {
  Row,
  Col,
  Button,
  TextField,
  TextArea,
  RadioButtonGroup,
  RadioButton,
  KeyValue
} from '@folio/stripes/components';
import css from './AccessRestrictions.css';

class AccessRestrictionsForm extends Component {
  constructor(props) {
    super(props);
    this.renderForm = this.renderForm.bind(this);
    this.renderSubForm = this.renderSubForm.bind(this);
  }

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

  renderSubForm = (elem, index, fields) => {
    return (
      <div className={css.item}>
        <div className={css.content}>
          <Row key={index}>
            <Col xs={12} md={6}>
              <Field label="Type" name={`${elem}.type`} id={`${elem}.type`} component={TextField} fullWidth />
            </Col>
            <Col xs={12} md={6}>
              <KeyValue label="Private?">
                <Field name={`${elem}.private`} id={`${elem}.private`} component={RadioButtonGroup}>
                  <RadioButton label="Yes" value="true" inline />
                  <RadioButton label="No" value="false" inline />
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
