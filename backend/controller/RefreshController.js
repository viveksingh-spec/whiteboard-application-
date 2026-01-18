import jwt from "jsonwebtoken";
import { errorResponse, successResponse } from "../utils/responce.js";
import User from "../models/usermodel.js";

const refreshAccesstoken = async (req, res) => {
  try {
    const incomingRefreshToken = req.cookies.refreshToken;
    if (!incomingRefreshToken) {
      return errorResponse(res, 400, "Refresh token is not provided");
    }

  
    let decoded;
    try {
      decoded = jwt.verify(incomingRefreshToken, process.env.REFRESHTOKENSECRET);
    } catch (err) {
      return errorResponse(res, 403, "Invalid or expired refresh token");
    }
  
    const user = await User.findById(decoded.id);
    if (!user || user.refreshToken !== incomingRefreshToken) {
      return errorResponse(res, 403, "Invalid refresh token, not found in DB");
    }

    const newAccessToken = jwt.sign(
      { id: user._id, email: user.email },
      process.env.ACCESSTOKENSECRET,
      { expiresIn: process.env.ACCESSTOKENTIME || "1h" }
    );

    return successResponse(res, 200, "Access renewed", { access_token: newAccessToken });
  } catch (error) {
    console.error("Refresh token error:", error);
    return errorResponse(res, 500, "Something went wrong while renewing the access token");
  }
};

export default refreshAccesstoken;
