import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { productsApi } from "../../api/products.api";
import { vendorsApi } from "../../api/vendors.api";
import { usePagination } from "../../hooks/usePagination";
import { formatPrice } from "../../utils/formatPrice";
import Badge from "../../components/ui/Badge";
import Button from "../../components/ui/Button";
import Select from "../../components/ui/Select";
import Pagination from "../../components/ui/Pagination";
import EmptyState from "../../components/ui/EmptyState";
import Skeleton from "../../components/ui/Skeleton";
import ConfirmDialog from "../../components/ui/ConfirmDialog";
import ProductFormModal from "../../components/admin/ProductFormModal";
import AdditionalImagesModal from "../../components/admin/AdditionalImagesModal";

const AdminProducts = () => {
  const { page, limit, setPage } = usePagination(10);
  const [products, setProducts] = useState([]);
  const [meta, setMeta] = useState({ totalPages: 1 });
  const [loading, setLoading] = useState(true);
  const [vendors, setVendors] = useState([]);
  const [imagesModal, setImagesModal] = useState({ open: false, product: null });
  const [filters, setFilters] = useState({ isPublic: "", vendorId: "", isDeleted: "" });
  const [formModal, setFormModal] = useState({ open: false, product: null });
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const loadProducts = () => {
    setLoading(true);
    productsApi
      .adminGetProducts({
        page,
        limit,
        isPublic: filters.isPublic || undefined,
        vendorId: filters.vendorId || undefined,
        isDeleted: filters.isDeleted || undefined,
      })
      .then(({ data }) => {
        setProducts(data.data);
        setMeta(data.meta);
      })
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    vendorsApi.getAllVendors({ limit: 100 }).then(({ data }) => setVendors(data.data)).catch(() => setVendors([]));
  }, []);

  useEffect(loadProducts, [page, limit, filters]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await productsApi.deleteProduct(deleteTarget._id);
      toast.success("Product deleted");
      setDeleteTarget(null);
      loadProducts();
    } catch (err) {
      toast.error(err.response?.data?.message || "Couldn't delete product");
    } finally {
      setDeleting(false);
    }
  };

  const handleRestore = async (product) => {
    try {
      await productsApi.restoreProduct(product._id);
      toast.success("Product restored");
      loadProducts();
    } catch (err) {
      toast.error(err.response?.data?.message || "Couldn't restore product");
    }
  };

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <h1 className="font-display text-2xl font-bold text-navy-900">Products</h1>
        <Button onClick={() => setFormModal({ open: true, product: null })}>+ New Product</Button>
      </div>

      <div className="mb-5 flex flex-wrap gap-3">
        <Select
          containerClassName="w-44"
          placeholder="All Visibility"
          value={filters.isPublic}
          onChange={(e) => { setPage(1); setFilters((f) => ({ ...f, isPublic: e.target.value })); }}
          options={[{ value: "true", label: "Public" }, { value: "false", label: "Vendor-Only" }]}
        />
        <Select
          containerClassName="w-52"
          placeholder="All Vendors"
          value={filters.vendorId}
          onChange={(e) => { setPage(1); setFilters((f) => ({ ...f, vendorId: e.target.value })); }}
          options={vendors.map((v) => ({ value: v._id, label: v.name }))}
        />
        <Select
          containerClassName="w-44"
          placeholder="Active Only"
          value={filters.isDeleted}
          onChange={(e) => { setPage(1); setFilters((f) => ({ ...f, isDeleted: e.target.value })); }}
          options={[{ value: "true", label: "Deleted Only" }]}
        />
      </div>

      {loading ? (
        <div className="space-y-3">{Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-16 w-full rounded-xl" />)}</div>
      ) : !products.length ? (
        <EmptyState title="No products found" description="Try adjusting your filters, or create a new product." />
      ) : (
        <>
          {/* Desktop table */}
          <div className="hidden overflow-hidden rounded-2xl border border-navy-100 bg-white shadow-card lg:block">
            <table className="w-full text-sm">
              <thead className="bg-navy-50 text-left text-xs font-semibold uppercase tracking-wide text-navy-500">
                <tr>
                  <th className="px-4 py-3">Product</th>
                  <th className="px-4 py-3">Category</th>
                  <th className="px-4 py-3">Price</th>
                  <th className="px-4 py-3">Stock</th>
                  <th className="px-4 py-3">Visibility</th>
                  <th className="px-4 py-3">Vendor</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-navy-100">
                {products.map((p) => (
                  <tr key={p._id} className="transition-colors hover:bg-navy-50/50">
                    <td className="flex items-center gap-3 px-4 py-3">
                      <img src={p.mainImage} alt="" className="h-10 w-10 rounded-lg object-cover" />
                      <span className="max-w-[180px] truncate font-medium text-navy-900">{p.name}</span>
                    </td>
                    <td className="px-4 py-3 text-navy-500">{p.category}</td>
                    <td className="px-4 py-3 font-mono text-navy-900">{formatPrice(p.price)}</td>
                    <td className="px-4 py-3 text-navy-500">{p.totalStock ?? p.stock}</td>
                    <td className="px-4 py-3">
                      <Badge tone={p.isPublic ? "success" : "neutral"}>{p.isPublic ? "Public" : "Vendor-Only"}</Badge>
                    </td>
                    <td className="px-4 py-3 text-navy-500">{p.vendorId?.name || "—"}</td>
                    <td className="px-4 py-3">
                      {p.isDeleted ? <Badge tone="danger">Deleted</Badge> : <Badge tone="success">Active</Badge>}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-2">
                        {p.isDeleted ? (
                          <Button size="sm" variant="outline" onClick={() => handleRestore(p)}>Restore</Button>
                        ) : (
                          <>
                            <Button size="sm" variant="outline" onClick={() => setImagesModal({ open: true, product: p })}>Images</Button>
                            <Button size="sm" variant="outline" onClick={() => setFormModal({ open: true, product: p })}>Edit</Button>
                            <Button size="sm" variant="danger" onClick={() => setDeleteTarget(p)}>Delete</Button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <div className="space-y-3 lg:hidden">
            {products.map((p) => (
              <div key={p._id} className="rounded-2xl border border-navy-100 bg-white p-4 shadow-card">
                <div className="flex items-center gap-3">
                  <img src={p.mainImage} alt="" className="h-12 w-12 rounded-lg object-cover" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-navy-900">{p.name}</p>
                    <p className="text-xs text-navy-400">{p.category}</p>
                  </div>
                  <span className="font-mono text-sm font-semibold text-navy-900">{formatPrice(p.price)}</span>
                </div>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  <Badge tone={p.isPublic ? "success" : "neutral"}>{p.isPublic ? "Public" : "Vendor-Only"}</Badge>
                  {p.isDeleted && <Badge tone="danger">Deleted</Badge>}
                  <Badge>Stock: {p.totalStock ?? p.stock}</Badge>
                </div>
                <div className="mt-3 flex gap-2">
                  {p.isDeleted ? (
                    <Button size="sm" variant="outline" className="flex-1" onClick={() => handleRestore(p)}>Restore</Button>
                  ) : (
                    <>
                      <Button size="sm" variant="outline" onClick={() => setImagesModal({ open: true, product: p })}>Images</Button>
                      <Button size="sm" variant="outline" className="flex-1" onClick={() => setFormModal({ open: true, product: p })}>Edit</Button>
                      <Button size="sm" variant="danger" className="flex-1" onClick={() => setDeleteTarget(p)}>Delete</Button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6"><Pagination page={meta.page || page} totalPages={meta.totalPages} onPageChange={setPage} /></div>
        </>
      )}

      <AdditionalImagesModal
        open={imagesModal.open}
        product={imagesModal.product}
        onClose={() => setImagesModal({ open: false, product: null })}
        onSaved={() => {
          loadProducts();
          setImagesModal({ open: false, product: null });
        }}
      />

      <ProductFormModal
        open={formModal.open}
        product={formModal.product}
        onClose={() => setFormModal({ open: false, product: null })}
        onSaved={loadProducts}
      />

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        loading={deleting}
        title="Delete this product?"
        description="This is a soft delete — the product can be restored later."
        confirmLabel="Delete"
      />
    </div>
  );
};

export default AdminProducts;
