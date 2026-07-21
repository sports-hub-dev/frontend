import React, { useEffect, useState } from "react";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import toast from "react-hot-toast";
import { productsApi } from "../../api/products.api";
import { vendorsApi } from "../../api/vendors.api";
import Modal from "../ui/Modal";
import Input from "../ui/Input";
import Select from "../ui/Select";
import Textarea from "../ui/Textarea";
import Button from "../ui/Button";

const SIZES = ["XS", "S", "M", "L", "XL", "XXL", "XXXL", "ONE_SIZE", "38", "39", "40", "41", "42", "43", "44", "45"];
const emptyForm = {
  name: "",
  description: "",
  price: "",
  category: "",
  isPublic: true,
  vendorId: "",
  hasSizeVariants: false,
  stock: 0,
  variants: [{ size: "M", stock: 0 }],
};

const ProductFormModal = ({ open, onClose, product, onSaved }) => {
  const [vendors, setVendors] = useState([]);
  const [mainImageFile, setMainImageFile] = useState(null);
  const [saving, setSaving] = useState(false);

  const { register, control, handleSubmit, watch, reset, formState: { errors } } = useForm({ defaultValues: emptyForm });
  const { fields, append, remove } = useFieldArray({ control, name: "variants" });

  const isPublic = watch("isPublic");
  const hasSizeVariants = watch("hasSizeVariants");

  useEffect(() => {
    if (open) {
      vendorsApi.getAllVendors({ limit: 100 }).then(({ data }) => setVendors(data.data)).catch(() => setVendors([]));
      reset(
        product
          ? {
              name: product.name,
              description: product.description,
              price: product.price,
              category: product.category,
              isPublic: product.isPublic,
              vendorId: product.vendorId?._id || product.vendorId || "",
              hasSizeVariants: product.hasSizeVariants,
              stock: product.stock || 0,
              variants: product.variants?.length ? product.variants : emptyForm.variants,
            }
          : emptyForm
      );
      setMainImageFile(null);
    }
  }, [open, product, reset]);

  const onSubmit = async (values) => {
    setSaving(true);
    try {
      const formData = new FormData();
      formData.append("name", values.name);
      formData.append("description", values.description);
      formData.append("price", values.price);
      formData.append("category", values.category);
      formData.append("isPublic", values.isPublic);
      if (!values.isPublic && values.vendorId) formData.append("vendorId", values.vendorId);
      formData.append("hasSizeVariants", values.hasSizeVariants);
      if (values.hasSizeVariants) {
        formData.append("variants", JSON.stringify(values.variants.map((v) => ({ size: v.size, stock: Number(v.stock) }))));
      } else {
        formData.append("stock", values.stock);
      }
      if (mainImageFile) formData.append("mainImage", mainImageFile);

      if (product) {
        await productsApi.updateProduct(product._id, formData);
        toast.success("Product updated");
      } else {
        if (!mainImageFile) {
          toast.error("Please select a main image");
          setSaving(false);
          return;
        }
        await productsApi.createProduct(formData);
        toast.success("Product created");
      }
      onSaved();
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || "Couldn't save product");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose} title={product ? "Edit Product" : "Create Product"} size="lg">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input label="Product name" error={errors.name?.message} {...register("name", { required: "Name is required" })} />
        <Textarea label="Description" rows={3} error={errors.description?.message} {...register("description", { required: "Description is required" })} />
        <div className="grid grid-cols-2 gap-4">
          <Input label="Price (EGP)" type="number" step="0.01" min="0" error={errors.price?.message} {...register("price", { required: "Price is required" })} />
          <Input label="Category" error={errors.category?.message} {...register("category", { required: "Category is required" })} />
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-navy-900">Main Image {product && "(leave blank to keep current)"}</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setMainImageFile(e.target.files?.[0] || null)}
            className="block w-full text-sm text-navy-600 file:mr-3 file:rounded-lg file:border-0 file:bg-navy-900 file:px-3.5 file:py-2 file:text-sm file:font-medium file:text-white hover:file:bg-navy-700"
          />
        </div>

        <div className="flex items-center justify-between rounded-lg border border-navy-100 px-4 py-3">
          <div>
            <p className="text-sm font-medium text-navy-900">Public Product</p>
            <p className="text-xs text-navy-400">Visible to all customers, not just one vendor</p>
          </div>
          <input type="checkbox" className="h-5 w-5 accent-navy-900" {...register("isPublic")} />
        </div>

        {!isPublic && (
          <Controller
            name="vendorId"
            control={control}
            render={({ field }) => (
              <Select
                label="Vendor (DSP company)"
                placeholder="Select vendor"
                options={vendors.map((v) => ({ value: v._id, label: v.name }))}
                {...field}
              />
            )}
          />
        )}

        <div className="flex items-center justify-between rounded-lg border border-navy-100 px-4 py-3">
          <div>
            <p className="text-sm font-medium text-navy-900">Has Size Variants</p>
            <p className="text-xs text-navy-400">Enable per-size stock tracking</p>
          </div>
          <input type="checkbox" className="h-5 w-5 accent-navy-900" {...register("hasSizeVariants")} />
        </div>

        {hasSizeVariants ? (
          <div className="space-y-2">
            <p className="text-sm font-medium text-navy-900">Size Variants</p>
            {fields.map((field, idx) => (
              <div key={field.id} className="flex items-center gap-2">
                <Select options={SIZES.map((s) => ({ value: s, label: s }))} containerClassName="w-32" {...register(`variants.${idx}.size`)} />
                <Input type="number" min="0" placeholder="Stock" {...register(`variants.${idx}.stock`)} />
                <button type="button" onClick={() => remove(idx)} className="btn-transition rounded-lg p-2 text-safety-red hover:bg-safety-redLight">
                  ✕
                </button>
              </div>
            ))}
            <Button type="button" variant="ghost" size="sm" onClick={() => append({ size: "M", stock: 0 })}>+ Add size</Button>
          </div>
        ) : (
          <Input label="Stock" type="number" min="0" {...register("stock")} />
        )}

        <Button type="submit" loading={saving} className="w-full" size="lg">
          {product ? "Save Changes" : "Create Product"}
        </Button>
      </form>
    </Modal>
  );
};

export default ProductFormModal;
