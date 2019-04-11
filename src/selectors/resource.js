import _ from 'lodash';

export const getItemById = (items, id) => {
  const records = (items.records || {}).records || [];
  if (!records || records.length === 0 || !id) return null;
  const item = records.find(u => u.id === id);
  return item;
};

export const getIdentifier = (record, type) => {
  const identifiers = _.get(record, ['identifier']);
  const identifier = _.find(identifiers, item => item.type === type);
  if (identifier) {
    return identifier.value;
  } else {
    return undefined;
  }
}

export default undefined;
