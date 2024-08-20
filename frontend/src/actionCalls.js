import axios from "axios";

export const loginCall = async (user, dispatch) => {
  dispatch({ type: "LOGIN_START" });
  try {
    console.log("Sending login request with data:", user);
    const response = await axios.post(
      "http://localhost:4000/api/auth/login",
      user
    );
    console.log("Login response data:", response.data);
    dispatch({ type: "LOGIN_SUCCESS", payload: response.data });
  } catch (err) {
    console.error(
      "Login error:",
      err.response ? err.response.data : err.message
    );
    dispatch({
      type: "LOGIN_ERROR",
      payload: err.response ? err.response.data : { message: err.message },
    });
  }
};
