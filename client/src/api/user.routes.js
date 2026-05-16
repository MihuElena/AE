import axiosNoAuth from "../axios/axiosNoAuth";
import axiosAuth from "../axios/axiosAuth";

// REGISTER
export const registerUser = async (userData) => {
  try {

    const response = await axiosNoAuth.post(
      'users',
      userData
    );

    return response.data;

  } catch (error) {

    return error.response?.data;

  }
};

// GET USER BY ID
export const getUserById = async (id) => {
  try {

    const response = await axiosAuth.get(
      `users/${id}`
    );

    return response.data;

  } catch (error) {

    return error.response?.data;

  }
};

// UPDATE PROFILE
export const updateProfile = async (userData) => {
  try {

    const tokenData = JSON.parse(
      atob(localStorage.getItem('token').split('.')[1])
    );

    const response = await axiosAuth.put(
      `users/${tokenData.id}`,
      userData
    );

    return response.data;

  } catch (error) {

    return error.response?.data;

  }
};