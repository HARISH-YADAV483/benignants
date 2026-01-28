import axios from "axios";
import { getToken } from "../utils/auth";

const API = "http://localhost:5001/api/users";

// ✅ Get logged-in user profile
export const getMyProfile = () =>
  axios.get(`${API}/me`, {
    headers: { Authorization: `Bearer ${getToken()}` },
  });

// ✅ Get leaderboard (public)
export const getLeaderboard = () => axios.get(`${API}/leaderboard`);

// ✅ Update profile picture
export const updateProfilePic = (profilePic) =>
  axios.put(
    `${API}/profile-pic`,
    { profilePic },
    {
      headers: { Authorization: `Bearer ${getToken()}` },
    }
  );