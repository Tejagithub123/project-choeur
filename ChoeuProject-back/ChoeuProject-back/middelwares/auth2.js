const jwt = require('jsonwebtoken');
// @ts-ignore
const Utilisateur = require('../Models/Utilisateur');

const loggedMiddleware2 = async (req, res, next) => {
    try {
      const token = req.headers.authorization.split(' ')[1];
      const decodedToken = jwt.verify(token, 'your-secret-key-here');
      const userId = decodedToken.userId;
  
      const user = await Utilisateur.findById(userId);
  
      if (!user) {
        throw new Error('User not found');
      }
  
      req.user = user; // Set the authenticated user in the request object
      next();
    } catch (error) {
      res.status(401).json({ message: 'Unauthorized' });
    }
  };
  
  module.exports = loggedMiddleware2;
  
