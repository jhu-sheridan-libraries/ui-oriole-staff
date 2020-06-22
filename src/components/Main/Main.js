import _ from 'lodash';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { SearchAndSort } from '@folio/stripes/smart-components';
import { Callout } from '@folio/stripes/components';
import transitionToParams from '@folio/stripes-components/util/transitionToParams';
import removeQueryParam from '@folio/stripes-components/util/removeQueryParam';
import { filters2cql } from '@folio/stripes-components/lib/FilterGroups';
import packageInfo from '../../../package';
import ResourceView from '../ResourceView';
import ResourceEditor from '../ResourceEditor';
import css from './Main.css';

const INITIAL_RESULT_COUNT = 30;
const RESULT_COUNT_INCREMENT = 30;

const searchableIndexes = [
  { label: 'All (Keywords)', value: 'all', makeQuery: term => `(keywords any ${term}*)` },
  { label: 'Title', value: 'title', makeQuery: term => `(title="*${term}*")` },
  { label: 'ID', value: 'altId', makeQuery: term => `(altId="${term}")` },
  // { label: 'FAST Term', value: 'term', makeQuery: term => `(terms=="*${term}*")` },
  { label: 'Tag', value: 'tag', makeQuery: term => `(tags.tagList=/respectAccents "${term}")` },
  // { label: 'Publisher', value: 'publisher', makeQuery: term => `(publisher=="*${term}*)` },
];
const filterConfig = [];

class Main extends Component {
  static manifest = Object.freeze({
    initializedFilterConfig: { initialValue: false },
    query: {
      initialValue: {
        query: '',
        filters: '',
        sort: ''
      },
    },
    resultCount: { initialValue: INITIAL_RESULT_COUNT },
    records: {
      type: 'okapi',
      clear: true,
      records: 'resources',
      recordsRequired: '%{resultCount}',
      path: 'oriole/resources',
      perRequest: RESULT_COUNT_INCREMENT,
      GET: {
        params: {
          query: (...args) => {
            /*
              This code is not DRY as it is copied from makeQueryFunction in stripes-components.
              This is necessary, as makeQueryFunction only referneces query paramaters as a data source.
              STRIPES-480 is intended to correct this and allow this query function to be replace with a call
              to makeQueryFunction.
              https://issues.folio.org/browse/STRIPES-480
            */
            const resourceData = args[2];
            const sortMap = {
              'createdDate': 'metadata.createdDate',
              'updatedDate': 'metadata.updatedDate'
            };

            const index = resourceData.query.qindex ? resourceData.query.qindex : 'all';
            const searchableIndex = searchableIndexes.find(idx => idx.value === index);

            const queryQuery = resourceData.query.query ? resourceData.query.query : '';
            let cql = searchableIndex.makeQuery(queryQuery);
            const filterCql = filters2cql(filterConfig, resourceData.query.filters);
            if (filterCql) {
              if (cql) {
                cql = `(${cql}) and ${filterCql}`;
              } else {
                cql = filterCql;
              }
            }

            const { sort } = resourceData.query;
            if (sort) {
              const sortIndexes = sort.split(',').map((sort1) => {
                let reverse = false;
                if (sort1.startsWith('-')) {
                  // eslint-disable-next-line no-param-reassign
                  sort1 = sort1.substr(1);
                  reverse = true;
                }
                let sortIndex = sortMap[sort1] || sort1;
                if (reverse) {
                  sortIndex = `${sortIndex.replace(' ', '/sort.descending ')}/sort.descending`;
                }
                return sortIndex;
              });

              cql += ` sortby ${sortIndexes.join(' ')}`;
            }
            return cql;
          },
        },
        staticFallback: { params: {} },
      },
    },
    uniquenessValidator: {
      type: 'okapi',
      records: 'resources',
      accumulate: 'true',
      path: 'oriole/resources',
      fetch: false,
    },
  });

  static propTypes = {
    match: PropTypes.object,
    stripes: PropTypes.object.isRequired,
    mutator: PropTypes.object.isRequired,
    onSelectRow: PropTypes.func,
    resources: PropTypes.object.isRequired,
    onComponentWillUnmount: PropTypes.func,
  };

  constructor(props) {
    super(props);
    this.state = {};
    this.transitionToParams = transitionToParams.bind(this);
    this.removeQueryParam = removeQueryParam.bind(this);
  }

  packageInfoReWrite = () => {
    const path = '/oriole';
    packageInfo.stripes.route = path;
    packageInfo.stripes.home = path;
    return packageInfo;
  };

  create = (databaseData) => {
    const { mutator } = this.props;
    mutator.records.POST(databaseData).then(newDatabase => {
      mutator.query.update({
        _path: `/oriole/view/${newDatabase.id}`,
        layer: null
      });
    });
  };

  onChangeIndex = (e) => {
    console.log('1');
    const qindex = e.target.value;
    this.props.mutator.query.update({ qindex });
  };

  render() {
    const { stripes, mutator, resources, onSelectRow, onComponentWillUnmount } = this.props;
    const resultsFormatter = {
      'title': data => _.get(data, 'title', ''),
      'createdDate': data => _.get(data, ['metadata', 'createdDate'], '').substring(0, 10),
      'updatedDate': data => _.get(data, ['metadata', 'updatedDate'], '').substring(0, 10),
      'provider': data => _.get(data, 'provider', ''),
    };
    const columnMapping = {
      'title': <FormattedMessage id="ui-oriole.databases.columns.title" />,
      'createdDate': <FormattedMessage id="ui-oriole.databases.columns.createdDate" />,
      'updatedDate': <FormattedMessage id="ui-oriole.databases.columns.updatedDate" />,
      'provider': <FormattedMessage id="Provider" />,
    };

    return (
      <div style={{ width: '100%' }} className={css.panepadding}>
        <SearchAndSort
          packageInfo={packageInfo}
          moduleName="databases"
          moduleTitle="databases"
          objectName="databases"
          baseRoute={packageInfo.stripes.route}
          filterConfig={filterConfig}
          visibleColumns={['title', 'provider', 'createdDate', 'updatedDate']}
          resultsFormatter={resultsFormatter}
          columnMapping={columnMapping}
          viewRecordComponent={ResourceView}
          onSelectRow={onSelectRow}
          onCreate={this.create}
          editRecordComponent={ResourceEditor}
          newRecordInitialValues={{}}
          initialResultCount={INITIAL_RESULT_COUNT}
          resultCountIncrement={RESULT_COUNT_INCREMENT}
          finishedResourceName="perms"
          viewRecordPerms=""
          newRecordPerms="databases.item.post"
          parentResources={resources}
          parentMutator={mutator}
          detailProps={{ stripes }}
          stripes={stripes}
          onComponentWillUnmount={onComponentWillUnmount}
          searchableIndexes={searchableIndexes}
          selectedIndex={_.get(this.props.resources.query, 'qindex')}
          searchableIndexPlaceHolder={null}
          onChangeIndex={this.onChangeIndex}
        />
        <Callout ref={this.callout} />
      </div>
    );
  }
}

export default Main;
