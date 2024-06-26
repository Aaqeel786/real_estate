import bcryptjs from 'bcryptjs';
import User from '../Models/user.model.js';
import { errorHandler } from '../utils/error.js';
import jwt from 'jsonwebtoken';
export const test = (req, res) => {
  res.json({
    message: "api is working!"
  });
}; 

export const updateUser = async (req, res, next) => {
  if (req.user.id !== req.params.id)
    return next(errorHandler(401, 'You can only update your own account!'));
  try {
    if (req.body.password) {
      req.body.password = bcryptjs.hashSync(req.body.password, 10);
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          username: req.body.username,
          email: req.body.email,
          password: req.body.password,
          avatar: req.body.avatar,
        },
      },
      { new: true }
    );

    const { password, ...rest } = updatedUser._doc;

    res.status(200).json(rest);
  } catch (error) {
    next(error);
  }
};



export const deleteUser = async (req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ')[1]; // Split the anuthorization header to extract the token
    const JWT_SECRET = "secret" // Split the anuthorization header to extract the token
    const decodedToken = jwt.verify(token, JWT_SECRET); // Verify and decode JWT token
    const userId = decodedToken.userId; // Assuming userId is included in the JWT payload

    if (userId !== req.params.id) {
      return res.status(401).json({ message: 'You can only delete your own account!' });
    }

    await User.findByIdAndDelete(req.params.id);
    res.clearCookie('access_token');
    res.status(200).json('User has been deleted!');
  } catch (error) {
    next(error);
  }
};
