import jwt from 'jsonwebtoken';

/**
 * Generates a JWT for authenticated users.
 * @param {string} userId - MongoDB user _id
 * @returns {string} - Signed JWT
 */
const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: '7d',
  });
};

export default generateToken;
