export const asyncHandler = (fn) => {
  return (req, res, next) => {
    fn(req, res, next).catch((error) => {
      return res
        .status(300)
        .json({ errormessage: error.message /*, stack:error.stack */ });
    });
  };
};

export const GlobalerrorHandling = (error, req, res, next) => {
  return res
    .status(error.cause || 404)
    .json({ message: error.message /*, stack: error.stack*/ });
};
