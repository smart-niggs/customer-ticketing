export const parseQueryObj = (query: any, queryFilters?: string[]) => {

  const params: any = {}
  params.page = query.page || 1; // Page defaults to 1
  params.limit = query.limit || 20// Limit defaults to 20, max is 200
  params.skip = (params.page - 1) * params.limit;

  const sort_by = query.sort_by || 'created_at' // defaults to 'created_at';
  const order = query.order || 'desc' // defaults to  -1 or 'desc';
  params.sort = { [sort_by]: order }; // i.e { created_at: -1 or 'desc } OR '-created_at'

  // extract filters and add to where query
  params.where = {};

  if (queryFilters) {
    queryFilters.forEach((val) => {
      if (query[val])
        params.where[val] = query[val];
    });
  }

  return params;
};
