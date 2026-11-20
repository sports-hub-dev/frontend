import * as yup from "yup";

const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/;

export const passwordRule = yup
  .string()
  .min(8, "Password must be at least 8 characters")
  .matches(PASSWORD_REGEX, "Password must contain uppercase, lowercase, and a number")
  .required("Password is required");

export const baseRegisterSchema = {
  firstName: yup.string().trim().max(50, "Max 50 characters").required("First name is required"),
  lastName: yup.string().trim().max(50, "Max 50 characters").required("Last name is required"),
  email: yup.string().trim().email("Enter a valid email").required("Email is required"),
  password: passwordRule,
  phoneNumber: yup
    .string()
    .trim()
    .matches(/^[0-9]{7,15}$/, "Phone number must be 7–15 digits")
    .required("Phone number is required"),
};

export const customerRegisterSchema = yup.object(baseRegisterSchema);

export const vendorRegisterSchema = yup.object({
  ...baseRegisterSchema,
  vendorId: yup.string().required("Please select your DSP / vendor company"),
  dspShortcode: yup
    .string()
    .trim()
    .required("DSP shortcode is required")
    .max(20, "Too long")
    .matches(/^[A-Za-z0-9-]+$/, "Letters, numbers and dashes only"),
  companyName: yup.string().trim().required("Company name is required").max(150, "Too long"),
  station: yup.string().trim().required("Station is required").max(30, "Too long"),
  vatId: yup.string().trim().required("VAT ID is required").max(40, "Too long"),
  country: yup.string().oneOf(["EG", "SA", "AE"], "Select a country").required("Select a country"),
});
