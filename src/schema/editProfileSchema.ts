import * as yup from "yup";

const editProfileSchema = yup.object().shape({
  username: yup.string().required("Username is required"),
  phoneNumber: yup
    .string()
    .required("Phone number is required"),
  address: yup.string().required("Address is required"),
});

export default editProfileSchema;
