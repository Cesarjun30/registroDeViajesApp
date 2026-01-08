const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  const token = req.header('Authorization');

 if (!token) {
    return res.status(401).json({ message: 'Acceso denegado, no se proporcionó token' });
 }

 try{
    // los tokens suelen llegar como "Bearer <token>" 
   const decoded =jwt.verify(token.replace("Bearer ", ""), process.env.JWT_SECRET);
   req.user = decoded; // Aqui se agrega la informacion del usuario al request
   next();

 }catch(err){
    res.status(400).json({ message: 'Token inválido' });
 }

};

module.exports = authMiddleware;