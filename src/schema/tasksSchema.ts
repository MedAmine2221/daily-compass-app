import * as yup from "yup";

const taskSchema = yup.object().shape({
  title: yup.string().required("title is required"),
  description: yup.string().required("description is required"),
  startDate: yup
    .string()
    .required("startDate is required")
    .test(
      "in-future",
      "startDate must be in the future",
      function (value) {
        if (!value) return true;
        const today = new Date();
        const start = new Date(value);
        return start >= today;
      }
    ),
  endDate: yup
    .string()
    .required("endDate is required")
    .test(
      "is-after-start",
      "endDate must be later than startDate",
      function (value) {
        const { startDate } = this.parent;
        if (!startDate || !value) return true;
        return new Date(value) > new Date(startDate);
      }
    ),
});

export default taskSchema;
