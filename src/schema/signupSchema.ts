import * as yup from "yup";
const signupSchema =yup.object().shape({
      username: yup.string().min(3).max(15).required("Username is required"),
      email: yup.string().email("Invalid email").required("Email is required"),
      password: yup.string().min(6).max(20).required("Password is required"),
      confirmPassword: yup.string().oneOf([yup.ref("password")],"confirmPassword"),
    });
export default signupSchema;