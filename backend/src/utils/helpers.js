// Generate random string
export const generateRandomString = (length = 10) => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
};

// Format currency
export const formatCurrency = (amount, currency = 'USD') => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format(amount);
};

// Calculate percentage change
export const calculatePercentageChange = (current, previous) => {
  if (previous === 0) return current > 0 ? 100 : 0;
  return ((current - previous) / previous) * 100;
};

// Parse query parameters for filtering
export const parseQueryParams = (query) => {
  const {
    page = 1,
    limit = 10,
    sort = '-createdAt',
    search,
    ...filters
  } = query;

  return {
    page: parseInt(page, 10),
    limit: parseInt(limit, 10),
    sort,
    search,
    filters,
  };
};

// Build MongoDB filter from query params
export const buildFilter = (filters, searchFields = []) => {
  const mongoFilter = {};

  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== '' && value !== 'all') {
      // Handle date ranges
      if (key.endsWith('From')) {
        const field = key.replace('From', '');
        mongoFilter[field] = { ...mongoFilter[field], $gte: new Date(value) };
      } else if (key.endsWith('To')) {
        const field = key.replace('To', '');
        mongoFilter[field] = { ...mongoFilter[field], $lte: new Date(value) };
      } else {
        mongoFilter[key] = value;
      }
    }
  });

  return mongoFilter;
};

// Add search to filter
export const addSearchToFilter = (filter, search, fields) => {
  if (search && fields.length > 0) {
    filter.$or = fields.map((field) => ({
      [field]: { $regex: search, $options: 'i' },
    }));
  }
  return filter;
};

// Paginate results
export const paginate = async (model, filter, options) => {
  const { page, limit, sort, populate } = options;
  const skip = (page - 1) * limit;

  let query = model.find(filter).sort(sort).skip(skip).limit(limit);

  if (populate) {
    query = query.populate(populate);
  }

  const [data, total] = await Promise.all([
    query.exec(),
    model.countDocuments(filter),
  ]);

  return {
    data,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
      hasNext: page * limit < total,
      hasPrev: page > 1,
    },
  };
};
