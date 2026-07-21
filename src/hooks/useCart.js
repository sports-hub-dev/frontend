import { useSelector, useDispatch } from "react-redux";
import {
  addItem,
  updateQuantity,
  removeItem,
  clearCart,
  setPromo,
  clearPromo,
  selectCartItems,
  selectCartSubtotal,
  selectCartCount,
  selectPromo,
} from "../app/cartSlice";

export const useCart = () => {
  const dispatch = useDispatch();
  const items = useSelector(selectCartItems);
  const subtotal = useSelector(selectCartSubtotal);
  const count = useSelector(selectCartCount);
  const promo = useSelector(selectPromo);

  return {
    items,
    subtotal,
    count,
    promo,
    addItem: (payload) => dispatch(addItem(payload)),
    updateQuantity: (payload) => dispatch(updateQuantity(payload)),
    removeItem: (payload) => dispatch(removeItem(payload)),
    clearCart: () => dispatch(clearCart()),
    setPromo: (payload) => dispatch(setPromo(payload)),
    clearPromo: () => dispatch(clearPromo()),
  };
};
