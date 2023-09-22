exports.errorHandler = (err, req, res, next) => {
  console.log("Error: ", err.message || err);
  res.status(500).json({ error: err.message || err });
};
