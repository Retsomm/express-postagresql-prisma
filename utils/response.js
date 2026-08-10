export const successResponse = (res, statusCode, data, meta = null)=> {
  const body = { status:'success', data};

  if (meta) {
    body.meta = meta;
  }

  res.status(statusCode).json(body);
};
