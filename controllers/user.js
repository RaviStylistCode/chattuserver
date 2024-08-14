import User from "../models/user.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const register = async (req, res) => {
  const { name, email, password, gender } = req.body;
  if (!name || !email || !password || !gender) {
    return res.status(400).json({
      success: false,
      message: "All fields are required",
    });
  }

  let user = await User.findOne({ email });
  if (user)
    return res.status(400).json({
      success: false,
      message: "user already exist",
    });

  const malepic = `https://avatar.iran.liara.run/public/boy?username=${name}`;
  const femalepic = `https://avatar.iran.liara.run/public/girl?username=${name}`;

  const hashpass = await bcrypt.hash(password, 10);
  user = await User.create({
    name,
    email,
    password: hashpass,
    gender,
    photo: gender === "male" ? malepic : femalepic,
  });

  return res.status(201).json({
    success: true,
    message: "user registered",
    user,
  });
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: "all field requred",
    });
  }

  let user = await User.findOne({ email }).select("+password");
  if (!user) {
    return res.status(400).json({
      success: false,
      message: "user does not exist",
    });
  }

  const hashpass = await bcrypt.compare(password, user.password);
  if (!hashpass) {
    return res.status(400).json({
      success: false,
      message: "password not matched",
    });
  }

  const token = jwt.sign({ _id: user._id }, process.env.Token, {
    expiresIn: "15d",
  });
  const data = {
    _id: user._id,
    name: user.name,
    email: user.email,
    photo: user.photo,
  };

  return res
    .status(200)
    .cookie("token", token, {
       maxAge: 15 * 24 * 60 * 60 * 1000,
       httpOnly: true,
      secure:true,
      sameSite:'none' })
    .json({
      success: true,
      message: `welcome back ${user.name}`,
      user: data,
      token,
    });
};

export const logout = (req, res) => {
  res.cookie("token", null, { expires: new Date(Date.now()) });
  return res.status(200).json({
    success: true,
    message: "logged out successfully",
  });
};

export const myProfile = async (req, res) => {
  const user = await User.findById(req.user._id).select("-password");
  if (!user) {
    return res.status(400).json({
      success: false,
      message: "User not found",
    });
  }

  return res.status(200).json({
    success: true,
    user,
  });
};

export const allUsers = async (req, res) => {
  try {
    const user = await User.find({ _id: { $ne: req.user._id } }).select(
      "-password"
    );
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "user not found",
      });
    }

    return res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    console.log(error);
  }
};

export const updatePassword = async (req, res) => {
  try {
    const { oldpassword, newpassword } = req.body;
    let user = await User.findById(req.user._id).select("+password");
    const ismatch = await bcrypt.compare(oldpassword, user.password);
    if (!ismatch) {
      return res.status(400).json({
        success: false,
        message: "password does not match",
      });
    } else {
      user.password = newpassword;
      await user.save();

      return res.status(200).json({
        success: true,
        message: "password updated",
      });
    }
  } catch (error) {
    console.log(error);
  }
};

export const singleuser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "user not found" });
    }

    return res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    console.log(error);
  }
};
