import * as yup from "yup";

export const ratingSchema = (t: any) =>
  yup.object().shape({
    problem: yup
      .string()
      .required(t("errors.problemRequired")),
  });

export default ratingSchema;
