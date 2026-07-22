import React from "react";
import { Link } from "react-router-dom";
import { ROUTES } from "../../constants/routes";
import Logo from "./Logo";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebook, faInstagram, faWhatsapp } from '@fortawesome/free-brands-svg-icons';

const Footer = () => (
  <footer className="border-t border-navy-100 bg-navy-900">
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
        <div className="col-span-2 text-center md:col-span-1 md:text-left">
          <Logo dark className="mb-3 justify-center md:justify-start" />
          <p className="text-sm leading-relaxed text-navy-300">
            Uniforms and PPE for Egypt's delivery and logistics workforce — built for the road, priced in EGP.
          </p>

          <div className="py-2">
            <a href="https://www.facebook.com/share/19VJ1aW813/?mibextid=wwXIfr" aria-label="Facebook" className="px-2"> <FontAwesomeIcon icon={faFacebook} color="#1877F2" /> </a>
            <a href="https://www.instagram.com/sportshubegypt/" aria-label="Instagram" className="px-2"> <FontAwesomeIcon icon={faInstagram} color="#E4405F" /></a>
            <a href="https://wa.me/YOUR_NUMBER" aria-label="WhatsApp" className="px-2"><FontAwesomeIcon icon={faWhatsapp} color="#25D366" /></a>
          </div>
        </div>
        <div className="text-center">
          <h4 className="mb-3 text-xs font-semibold uppercase tracking-wider text-amber">Shop</h4>
          <ul className="space-y-2 text-sm text-navy-300">
            <li><Link className="transition-colors hover:text-white" to={ROUTES.PRODUCTS}>All Products</Link></li>
            <li><Link className="transition-colors hover:text-white" to={ROUTES.TRACK_ORDER}>Track an Order</Link></li>
            <li><Link className="transition-colors hover:text-white" to={ROUTES.CART}>Your Cart</Link></li>
          </ul>
        </div>
        <div className="text-center">
          <h4 className="mb-3 text-xs font-semibold uppercase tracking-wider text-amber">Company</h4>
          <ul className="space-y-2 text-sm text-navy-300">
            <li><Link className="transition-colors hover:text-white" to={ROUTES.ABOUT}>About Us</Link></li>
            <li><Link className="transition-colors hover:text-white" to={ROUTES.CONTACT}>Contact</Link></li>
            <li><Link className="transition-colors hover:text-white" to={ROUTES.REGISTER_VENDOR}>Become a DSP Partner</Link></li>
            <li><Link className="transition-colors hover:text-white" to={ROUTES.REGISTER}>Create an Account</Link></li>
          </ul>
        </div>
        <div className="hidden md:block text-center">
          <h4 className="mb-3 text-xs font-semibold uppercase tracking-wider text-amber">Coverage</h4>
          <ul className="space-y-2 text-sm text-navy-300">
            <li>Egypt</li>
            <li>Saudi Arabia</li>
            <li>United Arab Emirates</li>
          </ul>
        </div>
      </div>
      <div className="manifest-rule mt-10 flex flex-col gap-4 pt-6 text-xs text-navy-400" style={{ borderColor: "rgba(255,255,255,0.12)" }}>
        <nav className="flex flex-wrap justify-center gap-x-5 gap-y-2">
          <Link className="transition-colors hover:text-white" to={ROUTES.TERMS}>Terms &amp; Conditions</Link>
          <Link className="transition-colors hover:text-white" to={ROUTES.PRIVACY_POLICY}>Privacy Policy</Link>
          <Link className="transition-colors hover:text-white" to={ROUTES.DELIVERY_POLICY}>Delivery &amp; Shipping</Link>
          <Link className="transition-colors hover:text-white" to={ROUTES.CANCELLATION_POLICY}>Cancellation &amp; Replacement</Link>
          <Link className="transition-colors hover:text-white" to={ROUTES.REFUND_POLICY}>Refund Policy</Link>
        </nav>
        <div className="flex flex-col items-center justify-between gap-3">
          <span>© {new Date().getFullYear()} Sports Hub. All prices in EGP.</span>
          {/* <span className="tracking-code">EG · SA · AE</span> */}
        </div>
      </div>
    </div>
  </footer>
);

export default Footer;
