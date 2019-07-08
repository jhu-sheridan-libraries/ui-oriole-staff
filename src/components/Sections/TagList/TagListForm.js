import React, { Fragment } from 'react';
import { FormattedMessage, injectIntl, intlShape } from 'react-intl';
import PropTypes from 'prop-types';
import { FieldArray } from 'redux-form';
import {
  Icon,
  Button,
  Dropdown,
  DropdownMenu,
  List,
} from '@folio/stripes/components';
import css from './TagList.css';
import SearchableList from '../../SearchableList';

class TagListForm extends React.Component {
  static manifest = Object.freeze({
    availableTags: {
      type: 'okapi',
      records: 'tags',
      path: 'oriole/tags',
    },
  });

  static propTypes = {
    availableTags: PropTypes.arrayOf(PropTypes.string),
    name: PropTypes.string.isRequired,
    resources: PropTypes.shape({
      availableTags: PropTypes.shape({
        records: PropTypes.arrayOf(PropTypes.string),
      }),
    }).isRequired,
  };

  constructor(props) {
    super(props);

    this.state = {
      addTagOpen: false,
    };
  }

  onToggleAddTagDD = () => {
    const isOpen = this.state.addTagOpen;
    this.setState({
      addTagOpen: !isOpen,
    });
  };

  addTagHandler = tag => {
    this.fields.unshift(tag);
    setTimeout(() => this.onToggleAddTagDD());
  };

  // isTagAvailable = (tag) => {
  //   const listedTags = this.fields ? this.fields.getAll() : this.props.initialValues.tags;
  //   if ((listedTags || []).some(x => x.tagName === tag.tagName)) {
  //     return false;
  //   }
  //   return '';
  // }

  removeTag = (index) => {
    this.fields.remove(index);
    setTimeout(() => this.forceUpdate());
  };

  renderItem = (item, index) => {
    return (
      <li key={item}>
        { item }
        <FormattedMessage id="ui-oriole.tags.removeTag">
          { aria => (
            <Button
              buttonStyle="fieldControl"
              align="end"
              type="button"
              id="clickable-remove-tag"
              onClick={() => this.removeTag(index)}
              aria-label={`${aria}: ${item}`}
            >
              <Icon
                icon="times-circle"
                iconClassName={css.removeTagIcon}
                iconRootClass={css.removeTagButton}
              />
            </Button>
          )}
        </FormattedMessage>
      </li>
    );
  };

  renderList = ({ fields }) => {
    this.fields = fields;
    const listFormatter = (fieldName, index) => (this.renderItem(fields.get(index), index));
    return (
      <List
        items={fields}
        itemFormatter={listFormatter}
        isEmptyMessage={<FormattedMessage id="ui-oriole.tags.empty" />}
      />
    );
  };

  render() {
    let availableTags = (this.props.resources.availableTags || {}).records || [];
    if (this.fields && this.fields.length > 0) {
      availableTags = availableTags.filter(x => !this.fields.getAll().includes(x), this);
    }
    const tagsDD = (
      <SearchableList
        items={availableTags}
        onClickItem={this.addTagHandler}
      />
    );
    const tagDropdownButton = (
      <Dropdown
        id="section-add-tag"
        pullRight
        open={this.state ? this.state.addTagOpen : false}
        onToggle={this.onToggleAddTagDD}
      >
        <Button align="end" bottomMargin0 data-role="toggle" aria-haspopup="true" id="clickable-add-tag">
          <FormattedMessage id="ui-oriole.tags.add" />
        </Button>
        <DropdownMenu
          data-role="menu"
          width="50em"
          onToggle={this.onToggleAddTagDD}
        >
          {tagsDD}
        </DropdownMenu>
      </Dropdown>
    );

    return (
      <Fragment>
        <FieldArray name={this.props.name} component={this.renderList} fullWidth />
        <div>{tagDropdownButton}</div>
      </Fragment>
    );
  }
}

export default TagListForm;
