import _ from 'lodash';
import React from 'react';
import { injectIntl, intlShape } from 'react-intl';
import PropTypes from 'prop-types';
import { Icon, TextField, List } from '@folio/stripes/components';
import css from './SearchableList.css';

class SearchableList extends React.Component {
  static propTypes = {
    onClickItem: PropTypes.func.isRequired,
    items: PropTypes.arrayOf(PropTypes.string),
    intl: intlShape.isRequired,
  }

  constructor(props) {
    super(props);
    this.state = {
      searchTerm: '',
    };
  }

  handleSearchChange = e => {
    const searchTerm = e.target.value;
    this.setState({ searchTerm });
  }

  render() {
    const { onClickItem, intl, items } = this.props;
    const handleItemClick = item => onClickItem(item);

    const TagDDFormatter = item => (
      <li key={item}>
        <button type="button" className={css.itemControl} onClick={() => { handleItemClick(item); }}>
          {item}
        </button>
      </li>
    );

    const filteredItems = items
      .filter(item => item.toLowerCase().includes(this.state.searchTerm.toLowerCase()))
      .sort((a, b) => (a.toLowerCase() < b.toLowerCase() ? -1 : 1));
    return (
      <div className={css.root}>
        <TextField
          noBorder
          placeholder={intl.formatMessage({ id: 'ui-oriole.search' })}
          startControl={<Icon icon="search" />}
          onChange={this.handleSearchChange}
        />
        <List
          itemFormatter={TagDDFormatter}
          items={filteredItems}
          listClass={css.TagList}
        />
      </div>
    );
  }
}

export default injectIntl(SearchableList);
