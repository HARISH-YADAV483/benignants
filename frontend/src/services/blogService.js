import axios from "axios";
import { getToken } from "../utils/auth";

const API = "http://localhost:5001/api/blogs";

// ✅ Public - Verified blogs
export const getVerifiedBlogs = () => axios.get(API);

// ✅ Public - Blog details
export const getBlogById = (id) => axios.get(`${API}/${id}`);

// ✅ Protected - Create blog
export const createBlog = (data) =>
  axios.post(API, data, {
    headers: { Authorization: `Bearer ${getToken()}` },
  });

// ✅ Protected - My blogs (pending + verified + rejected)
export const getMyBlogs = () =>
  axios.get(`${API}/my/list`, {
    headers: { Authorization: `Bearer ${getToken()}` },
  });