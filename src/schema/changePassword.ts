import * as yup from "yup";
const changePassSchema =yup.object().shape({
      oldPassword: yup.string().min(6).max(20).required("Old Password is required"),
      newPassword: yup.string().min(6).max(20).required("New Password is required"),
      confirmNewPassword: yup.string().oneOf([yup.ref("newPassword")],"confirmNewPassword"),
    });
export default changePassSchema;