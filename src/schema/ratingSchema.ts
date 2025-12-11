import * as yup from "yup";
const ratingSchema =yup.object().shape({
      problem: yup.string().required("Problem is required"),
    });
export default ratingSchema;