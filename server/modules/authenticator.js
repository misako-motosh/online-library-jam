import jwt from 'jsonwebtoken';

const removeBearerSubstring = (token) => {
  return token.slice(7, token.length)
};

const createAccessToken = (user) => {
  const secret = process.env.JWT_SECRET;
  const data = { id: user._id }
  return jwt.sign(data, secret, { expiresIn: '1h' })
};

const verifyAccessToken = (req, res, next) => {
  const secret = process.env.JWT_SECRET;
  let token = req.headers.authorization

  if (typeof token !== 'undefined') {
    token = removeBearerSubstring(token)

    return jwt.verify(token, secret, (err, data) => {
      if (err) {
        res.send({
          error: err.name,
          message: err
        });
      } else {
        const user = jwt.decode(token, { complete: true }).payload
        req.body.user = user.id
        next();
      }
    });
  } else {
    return res.send({
      error: 'token_missing',
      message: 'Access token is missing from the request.'
    });
  }
};

export {createAccessToken , verifyAccessToken};