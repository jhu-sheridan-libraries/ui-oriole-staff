import _ from 'lodash';
import React from 'react';
import { injectIntl, intlShape } from 'react-intl';
import PropTypes from 'prop-types';
import { Icon, TextField, List } from '@folio/stripes/components';
import css from './TagList.css';

class TagList extends React.Component {
  static propTypes = {
    onChangeSearch: PropTypes.func.isRequired,
    onClickItem: PropTypes.func.isRequired,
    items: PropTypes.arrayOf(PropTypes.string),
    intl: intlShape.isRequired,
  }

  render() {
    const { onChangeSearch, onClickItem, intl } = this.props;
    const handleSearchChange = e => onChangeSearch(e);
    const handleItemClick = item => onClickItem(item);

    const TagDDFormatter = item => (
      <li key={item}>
        <button type="button" className={css.itemControl} onClick={() => { handleItemClick(item); }}>
          {item}
        </button>
      </li>
    );

    return (
      <div className={css.root}>
        <TextField
          noBorder
          placeholder={intl.formatMessage({ id: 'ui-oriole.search' })}
          startControl={<Icon icon="search" />}
          onChange={handleSearchChange}
        />
        <List
          itemFormatter={TagDDFormatter}
          items={this.props.items.sort((a, b) => {
            return (a.toLowerCase() < b.toLowerCase() ? -1 : 1);
          })}
          listClass={css.TagList}
        />
      </div>
    );
  }
}

export default injectIntl(TagList);
