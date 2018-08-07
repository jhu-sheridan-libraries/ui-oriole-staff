import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import SearchAndSort from '@folio/stripes-smart-components/lib/SearchAndSort';
import transitionToParams from '@folio/stripes-components/util/transitionToParams';
import removeQueryParam from '@folio/stripes-components/util/removeQueryParam';
import { filters2cql } from '@folio/stripes-components/lib/FilterGroups';
import packageInfo from '../../package';
import DatabaseView from '../components/DatabaseView';
import DatabasePane from '../components/DatabasePane';

const INITIAL_RESULT_COUNT = 30;
const RESULT_COUNT_INCREMENT = 30;

const searchableIndexes = [
  { label: 'All (title, description)', value: 'all', makeQuery: term => `(title="${term}*" or description="*${term}*")` },
  { label: 'Title', value: 'title', makeQuery: term => `(title="${term}*")` },
  { label: 'ID', value: 'jhuId', makeQuery: term => `(jhuId="${term}*)` }
];
const filterConfig = [];

class Databases extends Component {
  static manifest = Object.freeze({
    initializedFilterConfig: { initialValue: false },
    query: {
      initialValue: {
        query: '',
        filters: '',
        sort: 'title'
      },
    },
    resultCount: { initialValue: INITIAL_RESULT_COUNT },
    records: {
      type: 'okapi',
      clear: true,
      records: 'resources',
      recordsRequired: '%{resultCount}',
      path: 'resources',
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
              Name: 'title',
              Code: 'code',
            };

            const index = resourceData.query.qindex ? resourceData.query.qindex : 'all';
            const searchableIndex = searchableIndexes.find(idx => idx.value === index);

            let cql = searchableIndex.makeQuery(resourceData.query.query);
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
  });

  static propTypes = {
    match: PropTypes.object,
    stripes: PropTypes.object,
    mutator: PropTypes.object.isRequired,
    // onSelectRow: PropTypes.func,
    resources: PropTypes.object.isRequired,
  }

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
  }

  create = (databaseData) => {
    const { mutator } = this.props;
    mutator.records.POST(databaseData).then(newDatabase => {
      mutator.query.update({
        _path: `/oriole/view/${newDatabase.id}`,
        layer: null
      });
    });
  }

  render() {
    const { stripes, mutator, resources } = this.props;
    const resultsFormatter = {
      'Title': data => _.get(data, ['title'], ''),
      'URL': data => _.toString(_.get(data, ['url'], '')),
    };

    return (
      <div style={{ width: '100%' }}>
        <SearchAndSort
          packageInfo={packageInfo}
          moduleName="databases"
          moduleTitle="databases"
          objectName="databases"
          baseRoute={packageInfo.stripes.route}
          filterConfig={filterConfig}
          visibleColumns={['title', 'link']}
          resultsFormatter={resultsFormatter}
          viewRecordComponent={DatabaseView}
          // onSelectRow={onSelectRow}
          onCreate={this.create}
          editRecordComponent={DatabasePane}
          newRecordInitialValues={{}}
          initialResultCount={INITIAL_RESULT_COUNT}
          resultCountIncrement={RESULT_COUNT_INCREMENT}
          finishedResourceName="perms"
          // viewRecordPerms="databases.item.get"
          viewRecordPerms=""
          newRecordPerms="databases.item.post"
          parentResources={this.props.resources}
          parentMutator={this.props.mutator}
          detailProps={{ stripes }}
          // stripes={this.props.stripes}
          // onComponentWillUnmount={onComponentWillUnmount}
          searchableIndexes={searchableIndexes}
          selectedIndex={_.get(this.props.resources.query, 'qindex')}
          searchableIndexPlaceHolder={null}
          onChangeIndex={this.onChangeIndex}
        />
      </div>
    );
  }
}

export default Databases;
