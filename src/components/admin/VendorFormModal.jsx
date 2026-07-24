import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { vendorsApi } from "../../api/vendors.api";
import Modal from "../ui/Modal";
import Input from "../ui/Input";
import Textarea from "../ui/Textarea";
import Button from "../ui/Button";

const VendorFormModal = ({ open, onClose, vendor, onSaved }) => {
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm();

  useEffect(() => {
    if (open) {
      reset(
        vendor
          ? {
              name: vendor.name,
              phone: vendor.phone,
              description: vendor.description,
              commissionRate: vendor.commissionRate,
              city: vendor.address?.city,
              street: vendor.address?.street,
            }
          : { name: "", email: "", phone: "", description: "", commissionRate: 10, city: "", street: "" }
      );
    }
  }, [open, vendor, reset]);

  const onSubmit = async (values) => {
    try {
      const payload = {
        name: values.name,
        phone: values.phone,
        description: values.description,
        commissionRate: Number(values.commissionRate),
        address: { city: values.city, street: values.street },
      };
      if (vendor) {
        await vendorsApi.updateVendor(vendor._id, payload);
        toast.success("Vendor updated");
      } else {
        await vendorsApi.createVendor({ ...payload, email: values.email });
        toast.success("Vendor created");
      }
      onSaved();
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || "Couldn't save vendor");
    }
  };

  return (
    <Modal open={open} onClose={onClose} title={vendor ? "Edit Vendor" : "Create Vendor / DSP"} size="lg">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input label="Vendor / DSP name" error={errors.name?.message} {...register("name", { required: "Name is required" })} />
        {!vendor && (
          <Input label="Email" type="email" error={errors.email?.message} {...register("email", { required: "Email is required" })} />
        )}
        <Input label="Phone" {...register("phone")} />
        <Textarea label="Description" rows={3} {...register("description")} />
        <div className="grid grid-cols-2 gap-4">
          <Input label="City" {...register("city")} />
          <Input label="Street" {...register("street")} />
        </div>
        <Input label="Commission Rate (%)" type="number" min="0" max="100" step="0.1" {...register("commissionRate")} />
        <Button type="submit" loading={isSubmitting} className="w-full" size="lg">
          {vendor ? "Save Changes" : "Create Vendor"}
        </Button>
      </form>
    </Modal>
  );
};

export default VendorFormModal;
