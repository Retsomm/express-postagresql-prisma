const validate = (schema)=> {
  return (req, res, next)=>{
    const result = schema.safeParse(req.body);

    if(!result.success){
      const errors = result.error.issues.map((issue)=> issue.message);
      return res.status(400).json({
        status:'error',
        message: '請求資料驗證失敗',
        errors,
      });
    }

    req.body = result.data;
    next();
  };
};

export default validate;