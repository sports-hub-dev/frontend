import { useDispatch, useSelector } from "react-redux";
import { selectRegion, setRegion } from "../app/regionSlice";
import { formatPrice } from "../utils/formatPrice";

export const useRegion = () => {
  const dispatch = useDispatch();
  const region = useSelector(selectRegion);
  return {
    region,
    country: region.code,
    currency: region.currency,
    /** Format an amount in the visitor's currency. */
    money: (amount) => formatPrice(amount, region.currency),
    setRegion: (country, chosen = true) => dispatch(setRegion({ country, chosen })),
  };
};
