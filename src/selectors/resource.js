export const getItemById = (items, id) => {
  const records = (items.records || {}).records || [];
  if (!records || records.length === 0 || !id) return null;
  const item = records.find(u => u.id === id);
  return item;
};

export default undefined;
