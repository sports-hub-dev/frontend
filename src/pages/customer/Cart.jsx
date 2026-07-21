import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../../hooks/useCart";
import { ROUTES } from "../../constants/routes";
import CartItem from "../../components/cart/CartItem";
import CartSummary from "../../components/cart/CartSummary";
import EmptyState from "../../components/ui/EmptyState";
import Button from "../../components/ui/Button";

const Cart = () => {
  const { items } = useCart();
  const navigate = useNavigate();

  if (!items.length) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
        <EmptyState
          title="Your cart is empty"
          description="Browse our uniforms and PPE catalogue to get started."
          action={<Link to={ROUTES.PRODUCTS}><Button>Shop Products</Button></Link>}
          icon={
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
              <path d="M3 3h2l.4 2M7 13h10l3-8H5.4M7 13L5.4 5M7 13l-1.7 5H17M9 20a1 1 0 100-2 1 1 0 000 2zM17 20a1 1 0 100-2 1 1 0 000 2z" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          }
        />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="mb-8 font-display text-2xl font-bold text-navy-900">Your Cart</h1>
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_360px]">
        <div className="animate-fadeUp rounded-2xl border border-navy-100 bg-white p-5 shadow-card sm:p-6">
          {items.map((item) => (
            <CartItem key={`${item.productId}-${item.size || "nosize"}`} item={item} />
          ))}
        </div>
        <div className="animate-fadeUp" style={{ animationDelay: "80ms" }}>
          <CartSummary>
            <Button onClick={() => navigate(ROUTES.CHECKOUT)} size="lg" className="w-full">
              Proceed to Checkout
            </Button>
          </CartSummary>
        </div>
      </div>
    </div>
  );
};

export default Cart;
