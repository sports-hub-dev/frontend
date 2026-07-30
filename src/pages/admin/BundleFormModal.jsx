import React, { useEffect, useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import toast from "react-hot-toast";
import { bundlesApi } from "../../api/bundles.api";
import { productsApi } from "../../api/products.api";
import Modal from "../ui/Modal";
import Input from "../ui/Input";
import Select from "../ui/Select";
import Textarea from "../ui/Textarea";
import Button from "../ui/Button";

const BundleFormModal = ({ open, onClose, onSaved }) => {
  const [products, setProducts] = useState([]);
  const [mainImageFile, setMainImageFile] = useState(null);
  const [saving, setSaving] = useState(false);

  const { register, control, handleSubmit, reset, formState: { errors } } = useForm({
    defaultValues: { name: "", description: "", discountPercentage: 10, products: [{ product: "", quantity: 1 }, { product: "", quantity: 1 }] },
  });
  const { fields, append, remove } = useFieldArray({ control, name: "products" });

  useEffect(() => {
    if (open) {
      productsApi.adminGetProducts({ limit: 100 }).then(({ data }) => setProducts(data.data)).catch(() => setProducts([]));
      reset({ name: "", description: "", discountPercentage: 10, products: [{ product: "", quantity: 1 }, { product: "", quantity: 1 }] });
      setMainImageFile(null);
    }
  }, [open, reset]);

  const onSubmit = async (values) => {
    if (values.products.length < 2) {
      toast.error("A bundle needs at least 2 products");
      return;
    }
    setSaving(true);
    try {
      const formData = new FormData();
      formData.append("name", values.name);
      formData.append("description", values.description);
      formData.append("discountPercentage", values.discountPercentage);
      formData.append("products", JSON.stringify(values.products.map((p) => ({ product: p.product, quantity: Number(p.quantity) }))));
      if (mainImageFile) formData.append("mainImage", mainImageFile);

      await bundlesApi.createBundle(formData);
      toast.success("Bundle created");
      onSaved();
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || "Couldn't save bundle");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose} title="Create Bundle" size="lg">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input label="Bundle name" error={errors.name?.message} {...register("name", { required: "Name is required" })} />
        <Textarea label="Description" rows={2} {...register("description")} />
        <Input label="Discount Percentage" type="number" min="0" max="100" {...register("discountPercentage", { required: true })} />

        <div>
          <label className="mb-1.5 block text-sm font-medium text-navy-900">Main Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setMainImageFile(e.target.files?.[0] || null)}
            className="block w-full text-sm text-navy-600 file:mr-3 file:rounded-lg file:border-0 file:bg-navy-900 file:px-3.5 file:py-2 file:text-sm file:font-medium file:text-white hover:file:bg-navy-700"
          />
        </div>

        <div className="space-y-2">
          <p className="text-sm font-medium text-navy-900">Products (at least 2)</p>
          {fields.map((field, idx) => (
            <div key={field.id} className="flex items-center gap-2">
              <Select
                containerClassName="flex-1"
                placeholder="Select product"
                options={products.map((p) => ({ value: p._id, label: p.name }))}
                {...register(`products.${idx}.product`, { required: true })}
              />
              <Input type="number" min="1" placeholder="Qty" containerClassName="w-24" {...register(`products.${idx}.quantity`, { required: true })} />
              {fields.length > 2 && (
                <button type="button" onClick={() => remove(idx)} className="btn-transition rounded-lg p-2 text-safety-red hover:bg-safety-redLight">
                  ✕
                </button>
              )}
            </div>
          ))}
          <Button type="button" variant="ghost" size="sm" onClick={() => append({ product: "", quantity: 1 })}>
            + Add product
          </Button>
        </div>

        <Button type="submit" loading={saving} className="w-full" size="lg">
          Create Bundle
        </Button>
      </form>
    </Modal>
  );
};

export default BundleFormModal;