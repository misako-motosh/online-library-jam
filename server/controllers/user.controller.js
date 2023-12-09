import User from '../models/user.model.js';
import Activeuser from '../models/activeuser.model.js';
import {createAccessToken} from '../modules/authenticator.js';

const getUsers = async (req, res) => {
  try {
    const users = await User.find()
      .select(['-password', '-__v']);

    res.status(200).send({
      message: "List of users.",
      data: users,
    });
  } catch (error) {
    console.error(error);
    res.send({ message: error.message });
  }
};

const createUser = async (req, res) => {
  try {
    const { firstName, lastName, universityID, email, password } = req.body;
    const universityIDExist = await Activeuser.findOne({ universityID });
    const userIDExist = await User.findOne({ universityID });
    const emailExist = await User.findOne({ email });

    // Validate form data
    if (
      !firstName ||
      !lastName ||
      !universityID ||
      !email ||
      !password
    ) {
      return res.status(400).send({
        message: 'All fields are required',
      });
    }

    if (!universityIDExist) {
      res.status(400).send({
        message: "User not currently enrolled",
      });
    } else if (userIDExist) {
      res.status(400).send({
        message: "UserID already exist",
      });
    } else if (emailExist) {
      res.status(400).send({
        message: "Email already exist",
      });
    } else {
      const newUser = new User({
        universityID,
        firstName,
        lastName,
        email,
        password,
      });

    

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).send({
        message: 'Invalid email address',
      });
    }

    // Validate password strength
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(password)) {
      return res.status(400).send({
        message: 'Password must have at least 8 characters, uppercase, lowercase, number, and special characters',
      });
    }
      await newUser.save();

      res.status(201).send({
        message: "User created.",
        data: newUser,
      });
    }
  } catch (error) {
    console.error(error);
    res.send({ message: error.message });
  }
};

const loginUser = async (req, res) => {
  try {
    const { universityID, password } = req.body;

    const user = await User.findOne({ universityID });

    if (!user) {
      res.status(404).send({
        message: "User not found.",
      });
    } else {
      const passwordMatched = await user.comparePassword(password);

      if (!passwordMatched) {
        res.status(400).send({
          message: "Invalid username/password.",
        });
      } else {
        res.status(200).send({
          User: `${user.firstName} ${user.lastName}`,
          UserRole: `${user.userRole}`,
          UserId: `${user._id}`,
          accessToken: createAccessToken(user.toObject())
        });
      }
    }
  } catch (error) {
    console.error(error);
    res.send({ message: error.message });
  }
};

const updateRoleToAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    const filteredUser = await User.find({_id: id});
    const adminUser = filteredUser.find(user => user.userRole);

    if (adminUser.userRole === 'user') {
      let user = await User.updateOne({ _id: id }, { userRole: 'admin' });

      res.status(201).send({
        message: `Role now updated to Admin`,
        data: user
      });
    } else {
      let user = await User.updateOne({ _id: id }, { userRole: 'user' });

     res.status(201).send({
        message: `Role now updated to User`,
        data: user
      });
    }
      
  } catch (error) {
    console.error(error);
    res.send(error.message);
  }
};

const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    let user = await User.deleteOne({ _id: id });

    res.status(200).send({
      message: 'User is now permanently deleted',
      data: user,
    });

  } catch (error) {
    console.error(error);
    res.send(error.message);
  }
};

const getSearchUser = async (request, response) => {
  try {
    const { firstName, lastName, universityID, email } = request.query;
    
    if (firstName && !lastName && !universityID && !email) {
      const filteredUser = await User.find({firstName: { $regex: firstName, $options: 'i' }})
      .select(['-password', '-__v']).exec();
      
      return response.status(200).send({
       message: `User firstName: ${firstName}.`,
        data: {
          user: filteredUser
        }
      });
    } else if (!firstName && lastName && !universityID && !email) {
      const filteredUser = await User.find({lastName:{ $regex: lastName, $options: 'i' }})
      .select(['-password', '-__v']).exec();
      
      return response.status(200).send({
        message: `User lastName: ${lastName}.`,
        count: filteredUser.length,
        data : {
          user: filteredUser
        }
      }); 
    } else if (!firstName && !lastName && universityID && !email) {
      const filteredUser = await User.find({universityID:{ $regex: universityID, $options: 'i' }})
      .select(['-password', '-__v']).exec();
      
      return response.status(200).send({
        message: `User ID: ${universityID}.`,
        count: filteredUser.length,
        data : {
          user: filteredUser
        }
      });
    } else if (!firstName && !lastName && !universityID && email) {
      const filteredUser = await User.find({email:{ $regex: email, $options: 'i' }})
      .select(['-password', '-__v']).exec();
      
      return response.status(200).send({
        message: `User email: ${email}.`,
        count: filteredUser.length,
        data : {
          user: filteredUser
        }
      }); 
    } else if (firstName && lastName) {
      const filteredUser = await User.find({firstName: { $regex: firstName, $options: 'i' }})
      .find({lastName:{ $regex: lastName, $options: 'i' }})
      .select(['-password', '-__v']).exec();
      
      return response.status(200).send({
        message: `User: ${firstName} ${lastName}.`,
        count: filteredUser.length,
        data : {
          User: filteredUser
        }
      }); 
    } else {
      return response.status(404).send({
        message: `User is not found.`
      });
    }
  } catch (error) {
      console.error(error);
      return response.send({message: error.message});
  }
};

export { getUsers, createUser, loginUser, updateRoleToAdmin, deleteUser, getSearchUser };