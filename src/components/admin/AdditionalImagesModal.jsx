import React, { useState } from "react";
import toast from "react-hot-toast";
import { productsApi } from "../../api/products.api";
import Modal from "../ui/Modal";
import Button from "../ui/Button";

const MAX_FILES = 5;

const AdditionalImagesModal = ({ open, onClose, product, onSaved }) => {
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);

  const handleFileChange = (e) => {
    const selected = Array.from(e.target.files || []).slice(0, MAX_FILES);
    setFiles(selected);
  };

  const handleUpload = async () => {
    if (!files.length) {
      toast.error("Select at least one image");
      return;
    }
    setUploading(true);
    try {
      const formData = new FormData();
      files.forEach((file) => formData.append("images", file));
      await productsApi.uploadAdditionalImages(product._id, formData);
      toast.success("Images uploaded");
      setFiles([]);
      onSaved();
    } catch (err) {
      toast.error(err.response?.data?.message || "Couldn't upload images");
    } finally {
      setUploading(false);
    }
  };

  if (!product) return null;

  return (
    <Modal open={open} onClose={onClose} title={`Additional Images — ${product.name}`}>
      <div>
        <p className="mb-2 text-sm font-medium text-navy-900">Current Images</p>
        {product.additionalImages?.length ? (
          <div className="mb-5 grid grid-cols-4 gap-2">
            {product.additionalImages.map((img, i) => (
              <img key={i} src={img} alt="" className="aspect-square w-full rounded-lg object-cover" />
            ))}
          </div>
        ) : (
          <p className="mb-5 text-sm text-navy-400">No additional images yet.</p>
        )}

        <p className="mb-2 text-sm font-medium text-navy-900">Add Images (up to {MAX_FILES} at once)</p>
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={handleFileChange}
          className="block w-full text-sm text-navy-600 file:mr-3 file:rounded-lg file:border-0 file:bg-navy-900 file:px-3.5 file:py-2 file:text-sm file:font-medium file:text-white hover:file:bg-navy-700"
        />
        {files.length > 0 && <p className="mt-2 text-xs text-navy-400">{files.length} file(s) selected</p>}

        <Button onClick={handleUpload} loading={uploading} className="mt-5 w-full" size="lg">
          Upload
        </Button>
      </div>
    </Modal>
  );
};

export default AdditionalImagesModal;