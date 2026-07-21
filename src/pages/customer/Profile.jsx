import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useDispatch } from "react-redux";
import toast from "react-hot-toast";
import { authApi } from "../../api/auth.api";
import { fetchCurrentUser } from "../../app/authSlice";
import { useAuth } from "../../hooks/useAuth";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import Badge from "../../components/ui/Badge";
import Modal from "../../components/ui/Modal";
import ConfirmDialog from "../../components/ui/ConfirmDialog";
import EmptyState from "../../components/ui/EmptyState";
import AddressFormFields, { addressSchema } from "../../components/order/AddressFormFields";
import { Link } from "react-router-dom";
import { ROUTES } from "../../constants/routes";

const profileSchema = yup.object({
  firstName: yup.string().trim().required("First name is required"),
  lastName: yup.string().trim().required("Last name is required"),
  phoneNumber: yup
    .string()
    .trim()
    .matches(/^01[0-2,5]{1}[0-9]{8}$/, "Enter a valid Egyptian mobile number"),
});

const Profile = () => {
  const dispatch = useDispatch();
  const { user } = useAuth();
  const [savingProfile, setSavingProfile] = useState(false);
  const [addressModal, setAddressModal] = useState({ open: false, editing: null });
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [savingAddress, setSavingAddress] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const {
    register: registerProfile,
    handleSubmit: handleProfileSubmit,
    formState: { errors: profileErrors },
  } = useForm({
    resolver: yupResolver(profileSchema),
    defaultValues: { firstName: user?.firstName, lastName: user?.lastName, phoneNumber: user?.phoneNumber },
  });

  const {
    register: registerAddress,
    handleSubmit: handleAddressSubmit,
    reset: resetAddressForm,
    formState: { errors: addressErrors },
  } = useForm({ resolver: yupResolver(addressSchema) });

  const onSaveProfile = async (values) => {
    setSavingProfile(true);
    try {
      await authApi.updateProfile(values);
      await dispatch(fetchCurrentUser());
      toast.success("Profile updated");
    } catch (err) {
      toast.error(err.response?.data?.message || "Couldn't update profile");
    } finally {
      setSavingProfile(false);
    }
  };

  const openAddressModal = (address = null) => {
    resetAddressForm(
      address || { fullName: "", phoneNumber: "", city: "", area: "", street: "", building: "", floor: "", apartment: "", notes: "" }
    );
    setAddressModal({ open: true, editing: address });
  };

  const onSaveAddress = async (values) => {
    setSavingAddress(true);
    try {
      if (addressModal.editing) {
        await authApi.updateAddress(addressModal.editing._id, values);
        toast.success("Address updated");
      } else {
        await authApi.addAddress(values);
        toast.success("Address added");
      }
      await dispatch(fetchCurrentUser());
      setAddressModal({ open: false, editing: null });
    } catch (err) {
      toast.error(err.response?.data?.message || "Couldn't save address");
    } finally {
      setSavingAddress(false);
    }
  };

  const setDefaultAddress = async (address) => {
    try {
      await authApi.updateAddress(address._id, { isDefault: true });
      await dispatch(fetchCurrentUser());
      toast.success("Default address updated");
    } catch (err) {
      toast.error(err.response?.data?.message || "Couldn't update default address");
    }
  };

  const handleDeleteAddress = async () => {
    setDeleting(true);
    try {
      await authApi.deleteAddress(deleteTarget._id);
      await dispatch(fetchCurrentUser());
      toast.success("Address removed");
      setDeleteTarget(null);
    } catch (err) {
      toast.error(err.response?.data?.message || "Couldn't remove address");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="mx-auto max-w-3xl space-y-6 px-4 py-10 sm:px-6">
      <h1 className="font-display text-2xl font-bold text-navy-900">Profile</h1>

      {/* Personal info */}
      <div className="animate-fadeUp rounded-2xl border border-navy-100 bg-white p-6 shadow-card">
        <h2 className="mb-4 font-display text-base font-semibold text-navy-900">Personal Information</h2>
        <form onSubmit={handleProfileSubmit(onSaveProfile)} className="space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Input label="First name" error={profileErrors.firstName?.message} {...registerProfile("firstName")} />
            <Input label="Last name" error={profileErrors.lastName?.message} {...registerProfile("lastName")} />
          </div>
          <Input label="Email" value={user?.email} disabled hint="Email cannot be changed" />
          <Input label="Phone number" prefix="+20" error={profileErrors.phoneNumber?.message} {...registerProfile("phoneNumber")} />
          <Button type="submit" loading={savingProfile}>Save Changes</Button>
        </form>
      </div>

      {/* Addresses */}
      <div className="animate-fadeUp rounded-2xl border border-navy-100 bg-white p-6 shadow-card" style={{ animationDelay: "80ms" }}>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-display text-base font-semibold text-navy-900">Addresses</h2>
          <Button size="sm" variant="outline" onClick={() => openAddressModal()}>Add Address</Button>
        </div>

        {!user?.addresses?.length ? (
          <EmptyState title="No saved addresses" description="Add one to speed up checkout." />
        ) : (
          <div className="space-y-3">
            {user.addresses.map((address) => (
              <div key={address._id} className="flex flex-col justify-between gap-3 rounded-xl border border-navy-100 p-4 sm:flex-row sm:items-center">
                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-semibold text-navy-900">{address.fullName}</p>
                    {address.isDefault && <Badge tone="success">Default</Badge>}
                  </div>
                  <p className="mt-1 text-sm text-navy-500">
                    {address.street}, {address.area}, {address.city} · {address.phoneNumber}
                  </p>
                </div>
                <div className="flex shrink-0 flex-wrap gap-2">
                  {!address.isDefault && (
                    <Button size="sm" variant="ghost" onClick={() => setDefaultAddress(address)}>Set Default</Button>
                  )}
                  <Button size="sm" variant="outline" onClick={() => openAddressModal(address)}>Edit</Button>
                  <Button size="sm" variant="danger" onClick={() => setDeleteTarget(address)}>Delete</Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Password */}
      <div className="animate-fadeUp rounded-2xl border border-navy-100 bg-white p-6 shadow-card" style={{ animationDelay: "140ms" }}>
        <h2 className="mb-2 font-display text-base font-semibold text-navy-900">Password</h2>
        <p className="mb-4 text-sm text-navy-500">Reset your password via the secure email link flow.</p>
        <Link to={ROUTES.FORGOT_PASSWORD}>
          <Button variant="outline">Change Password</Button>
        </Link>
      </div>

      <Modal
        open={addressModal.open}
        onClose={() => setAddressModal({ open: false, editing: null })}
        title={addressModal.editing ? "Edit Address" : "Add Address"}
      >
        <form onSubmit={handleAddressSubmit(onSaveAddress)} className="space-y-4">
          <AddressFormFields register={registerAddress} errors={addressErrors} />
          <Button type="submit" loading={savingAddress} className="w-full">Save Address</Button>
        </form>
      </Modal>

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDeleteAddress}
        loading={deleting}
        title="Remove this address?"
        description="This action can't be undone."
        confirmLabel="Remove"
      />
    </div>
  );
};

export default Profile;
