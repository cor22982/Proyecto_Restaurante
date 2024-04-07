import jwt from 'jsonwebtoken'

const SECRET = 'jijijija'

const generateToken = (user) => {
  return jwt.sign(user, SECRET, { expiresIn: '50h', algorithm: 'HS256'  })
}

const validateToken = (token) => {
  try {
    return jwt.verify(token, SECRET)
  } catch(e) {
    console.error('Invalid token', e)
    return false
  }
}

export { generateToken, validateToken }