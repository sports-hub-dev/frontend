import React from "react";
import * as yup from "yup";
import Input from "../ui/Input";

export const addressSchema = yup.object({
  fullName: yup.string().trim().required("Full name is required"),
  phoneNumber: yup.string().trim().required("Phone number is required"),
  city: yup.string().trim().required("City is required"),
  area: yup.string().trim().required("Area is required"),
  street: yup.string().trim().required("Street is required"),
  building: yup.string().trim(),
  floor: yup.string().trim(),
  apartment: yup.string().trim(),
  notes: yup.string().trim(),
});

/** Field set matching the backend's address subdocument exactly. Pass a react-hook-form `register`. */
const AddressFormFields = ({ register, errors = {} }) => (
  <div className="space-y-4">
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      <Input label="Full name" error={errors.fullName?.message} {...register("fullName")} />
      <Input label="Phone number" prefix="+20" placeholder="01xxxxxxxxx" error={errors.phoneNumber?.message} {...register("phoneNumber")} />
    </div>
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      <Input label="City" error={errors.city?.message} {...register("city")} />
      <Input label="Area" error={errors.area?.message} {...register("area")} />
    </div>
    <Input label="Street" error={errors.street?.message} {...register("street")} />
    <div className="grid grid-cols-3 gap-4">
      <Input label="Building" error={errors.building?.message} {...register("building")} />
      <Input label="Floor" error={errors.floor?.message} {...register("floor")} />
      <Input label="Apartment" error={errors.apartment?.message} {...register("apartment")} />
    </div>
    <Input label="Delivery notes (optional)" placeholder="e.g. gate code, landmark" error={errors.notes?.message} {...register("notes")} />
  </div>
);

export default AddressFormFields;
