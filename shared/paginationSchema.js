import yup from "yup";

export const paginationSchema = yup.object({
  page: yup.number().min(1).default(1).integer(),
  limit: yup.number().min(1).default(10).integer(),
});
