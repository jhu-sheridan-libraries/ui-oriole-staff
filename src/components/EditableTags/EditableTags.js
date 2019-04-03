import _ from 'lodash';
import React from 'react';
import { FormattedMessage, injectIntl, intlShape } from 'react-intl';
import PropTypes from 'prop-types';
import { FieldArray } from 'redux-form';
import { Icon, Button, Dropdown, DropdownMenu, Accordion, Badge, List, Headline } from '@folio/stripes/components';
import css from './EditableTags.css';
import TagList from '../TagList';

class EditableTags extends React.Component {
  static propTypes = {
    heading: PropTypes.node.isRequired,
    initialValues: PropTypes.object,
    availableTags: PropTypes.arrayOf(PropTypes.string),
    intl: intlShape,
    stripes: PropTypes.object.isRequired,
    accordionId: PropTypes.string,
    expanded: PropTypes.bool,
    onToggle: PropTypes.func,
    name: PropTypes.string,
  };

  static defaultProps = {
    name: 'tags.tagList',
  };

  constructor(props) {
    super(props);

    this.state = {
      addTagOpen: false,
      searchTerm: '',
    };
  }

  // componentDidMount() {
  //   console.log('mount');
  //   this.getTags();
  // }

  // getTags = () => {
  //   return this.props.mutator.availableTags.GET().then(tags => {
  //     console.log(tags);
  //     this.setState({ availableTags: tags });
  //   });
  // }

  onChangeSearch = e => {
    const searchTerm = e.target.vaule;
    this.setState({ searchTerm });
  }

  onToggleAddTagDD = () => {
    const isOpen = this.state.addTagOpen;
    this.setState({
      addTagOpen: !isOpen,
      searchTerm: ''
    });
  }

  addTagHandler = tag => {
    this.fields.unshift(tag);
    setTimeout(() => this.onToggleAddTagDD());
  }

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
  }

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
  }

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
  }

  render() {
    // const { availableTags } = this.props.resources;
    // //const availableTags = resources.availableTags;
    const tagsDD = (
      <TagList
        items={this.props.availableTags}
        onClickItem={this.addTagHandler}
        onChangeSearch={this.onChangeSearch}
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
          <FormattedMessage id="ui-oriole.tags.addTag" />
        </Button>
        <DropdownMenu
          data-role="menu"
          width="40em"
          onToggle={this.onToggleAddTagDD}
        >
          {tagsDD}
        </DropdownMenu>
      </Dropdown>
    );

    const { initialValues, expanded, accordionId, onToggle } = this.props;
    const size = initialValues.id ? initialValues.tags.tagList.length : 0;
    return (
      <Accordion
        open={expanded}
        id={accordionId}
        onToggle={onToggle}
        label={<Headline size="large" tag="h3">{this.props.heading}</Headline>}
        displayWhenClosed={<Badge>{size}</Badge>}
      >
        <FieldArray name={this.props.name} component={this.renderList} fullWidth />
        <div>{tagDropdownButton}</div>
      </Accordion>
    );
  }
}

export default injectIntl(EditableTags);
