import bcrypt from "bcryptjs";
import userModel from "../models/auth.model.js";
import {
  generateAccessToken,
  generateRefreshToken,
  readRefreshToken,
} from "../utils/auth.util.js";

export const register = async (req, res) => {
  try {
    const { email, name, password } = req.body;

    const isUserAlreadyExist = await userModel.findOne({ email });

    if (isUserAlreadyExist) {
      return res.status(409).json({
        message: `User already exists with the email address`,
        errors: [
          {
            path: "email",
            msg: "User already exists with this email address",
          },
        ],
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await userModel.create({
      name,
      email,
      password: hashedPassword,
    });

    res.status(201).json({
      message: `User registered successfully`,
      data: {
        user: {
          name: user.name,
          email: user.email,
          id: user._id,
        },
      },
    });
  } catch (error) {
    res.status(500).json({
      message: `Something went wrong`,
      error: error.message,
    });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await userModel.findOne({ email });

    if (!user) {
      return res.status(401).json({
        message: `Invalid email or password`,
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const accessToken = generateAccessToken({ userId: user._id });
    const refreshToken = generateRefreshToken({ userId: user._id });

    await userModel.findOneAndUpdate(
      {
        email,
      },
      {
        refreshToken,
      },
    );

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      message: `login successfully`,
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
        },

        accessToken,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: `Something went wrong`,
      error: error.message,
    });
  }
};

export const refresh = async (req, res) => {
  try {
    const incomingRefreshToken = req.cookies.refreshToken;

    if (!incomingRefreshToken) {
      return res.status(401).json({
        message: `Refresh token not found, please login again`,
      });
    }

    let decoded;

    try {
      decoded = readRefreshToken(incomingRefreshToken);
    } catch (error) {
      return res.status(401).json({
        message: `Invalid or expired refresh token, please login again`,
      });
    }

    const user = await userModel.findById(decoded.userId);

    if (!user) {
      return res.status(403).json({
        message: `User not found, please login again`,
      });
    }

    if (incomingRefreshToken !== user.refreshToken) {
      await userModel.findByIdAndUpdate(user._id, { refreshToken: null });
      return res.status(403).json({
        message: `Refresh token mismatch, please login again`,
      });
    }

    const newAccessToken = generateAccessToken({ userId: user._id });
    const newRefreshToken = generateRefreshToken({ userId: user._id });

    await userModel.findByIdAndUpdate(user._id, {
      refreshToken: newRefreshToken,
    });

    res.cookie("refreshToken", newRefreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      message: `Access token refreshed successfully`,
      data: {
        accessToken: newAccessToken,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: `Something went wrong`,
      error: error.message,
    });
  }
};

export const logout = async (req, res) => {
  try {
    const userId = req.user.userId;

    await userModel.findByIdAndUpdate(userId, { refreshToken: null });

    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
    });

    res.status(200).json({
      message: `Logged out successfully`,
    });
  } catch (error) {
    res.status(500).json({
      message: `Something went wrong`,
      error: error.message,
    });
  }
};

export const me = async (req, res) => {
  try {
    const userId = req.user.userId;

    const user = await userModel
      .findById(userId)
      .select("-password -refreshToken");

    if (!user) {
      return res.status(404).json({
        message: `User not found`,
      });
    }

    res.status(200).json({
      message: `User profile fetched successfully`,
      data: {
        user,
      },
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Something went wrong", error: error.message });
  }
};
