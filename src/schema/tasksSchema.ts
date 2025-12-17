import * as yup from "yup";

export const taskSchema = (t: any) =>
  yup.object().shape({
    title: yup
      .string()
      .required(t("errors.titleRequired")),
    description: yup
      .string()
      .required(t("errors.descriptionRequired")),
    startDate: yup
      .string()
      .required(t("errors.startDateRequired"))
      .test(
        "in-future",
        t("errors.startDateInFuture"),
        function (value) {
          if (!value) return true;
          const today = new Date();
          const start = new Date(value);
          return start >= today;
        }
      ),
    endDate: yup
      .string()
      .required(t("errors.endDateRequired"))
      .test(
        "is-after-start",
        t("errors.endDateAfterStart"),
        function (value) {
          const { startDate } = this.parent;
          if (!startDate || !value) return true;
          return new Date(value) > new Date(startDate);
        }
      ),
  });

export default taskSchema;
