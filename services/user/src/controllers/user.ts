
import jwt from 'jsonwebtoken';
import User from '../model/User.js';
import TryCatch from '../utils/TryCatch.js';
import { v2 as cloudinary } from 'cloudinary';
import getBuffer from '../utils/dataUri.js';
import { AuthenticatedRequest } from '../middleware/isAuth.js';
import { sendError, sendSuccess } from '../utils/responseHandler.js';
import { oauth2Client } from '../utils/GoogleConfig.js';
import axios from 'axios';

// -------------------- USER LOGIN API --------------------
export const loginUser = TryCatch(async (req,res) => {
    try {
      const {code} = req.body;
      if(!code) {
        sendError(res, 'Code is required', 400);
        return;
      }

      const googleResponse = await oauth2Client.getToken(code);
      oauth2Client.setCredentials(googleResponse.tokens);
      const userRes = await axios.get(`https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${googleResponse.tokens.access_token}`)
        const { email, name, picture } = userRes.data;
        let user = await User.findOne({ email });
        if(!user) {
            user = await User.create({ email, name, image: picture });
        }
        const token = jwt.sign({ user }, process.env.JWT_SEC as string, {
            expiresIn: '30d',
        });

        sendSuccess(res,{user, token}, 'User logged in successfully', 200)
    }
    catch (error:any) {
        sendError(res, error.message || 'Something went wrong', 500);
    }
})

// -------------------- USER PROFILE API --------------------
export const myProfile = TryCatch(async (req: AuthenticatedRequest, res) => {
  const user = req.user;

  sendSuccess(res, { user }, 'User profile fetched successfully', 200);
});

// -------------------- GET USER PROFILE BY ID API --------------------
export const getUserProfile = TryCatch(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    sendError(res, 'User not found', 404);
    return;
  }

  res.json(user);
});

// -------------------- UPDATE USER PROFILE API --------------------
export const updateUser = TryCatch(async (req: AuthenticatedRequest, res) => {
  const { name, instagram, facebook, linkedin, bio } = req.body;

  const user = await User.findByIdAndUpdate(
    req.user?._id,
    {
      name,
      instagram,
      facebook,
      linkedin,
      bio,
    },
    { new: true }
  );

  const token = jwt.sign({ user }, process.env.JWT_SEC as string, {
    expiresIn: "5d",
  });

  sendSuccess(res, { user, token }, 'User profile updated successfully', 200);
});

// -------------------- UPDATE USER PROFILE PICTURE API --------------------
export const updateProfilePic = TryCatch(
  async (req: AuthenticatedRequest, res) => {
    const file = req.file;

    if (!file) {
      sendError(res, "No file uploaded", 400);
      return;
    }

    const fileBuffer = getBuffer(file);

    if (!fileBuffer || !fileBuffer.content) {
      sendError(res, "Invalid file format", 400);
      return;
    }
    const cloud = await cloudinary.uploader.upload(fileBuffer.content, {
      folder: "blogs",
    });

    const user = await User.findByIdAndUpdate(
      req.user?._id,
      {
        image: cloud.secure_url,
      },
      { new: true }
    );

    const token = jwt.sign({ user }, process.env.JWT_SEC as string, {
      expiresIn: "5d",
    });

    sendSuccess(res, { user, token }, 'Profile picture updated successfully', 200);
  }
);