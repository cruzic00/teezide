"use client";

import { useState } from "react";
import { FaInstagram, FaLinkedinIn, FaTwitter, FaWhatsapp } from "react-icons/fa";

export default function Footer() {
  const [email, setEmail] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Subscribed:", email);
    setEmail("");
  };

  return (           //footer bg color
    <footer className="bg-primary text-gray-300">
      <div className="max-w-7xl mx-auto px-6 py-16">
        {/* Headline + subscribe */}
        <div className="grid lg:grid-cols-2 gap-10 items-center ">
          <div>
            <h2 className="text-5xl font-extrabold leading-tight text-white mb-4">
              JOIN OUR <br /> FAM TeeVo.in
            </h2>
            <p className="mt-4 text-gray-400">
              Get exclusive updates and early access to drops.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4">
            <input
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="flex-1 px-4 py-3 rounded-md bg-white/10 border border-white/20 text-white placeholder:text-gray-500 focus:outline-none focus:border-accent transition-colors"
            />
            <button
              type="submit"
              className="bg-accent hover:bg-accent-dark px-6 py-3 rounded-md text-black font-bold shadow-lg transition-all transform hover:-translate-y-0.5"
            >
              SUBSCRIBE
            </button>
          </form>
        </div>

        {/* Socials */}
        <div className="mt-10 grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { icon: <FaInstagram />, name: "INSTAGRAM" },
            { icon: <FaLinkedinIn />, name: "LINKEDIN" },
            { icon: <FaTwitter />, name: "TWITTER" },
            { icon: <FaWhatsapp />, name: "WHATSAPP" },
          ].map((s) => (
            <a
              key={s.name}
              href="#"
              className="flex items-center justify-center gap-2 border border-white/10 bg-white/5 hover:bg-white/10 hover:text-accent py-3 rounded text-sm font-semibold transition-all"
            >
              {s.icon} {s.name}
            </a>
          ))}
        </div>

        {/* Links */}
        <div className="mt-14 border-t border-white/10 pt-10 grid sm:grid-cols-3 gap-8 text-sm text-gray-400">
          <div>
            <h4 className="font-bold mb-3 text-white">CATEGORIES</h4>
            <ul className="space-y-2">
              <li className="hover:text-accent cursor-pointer transition-colors">OVERSIZED T-SHIRTS</li>
              <li className="hover:text-accent cursor-pointer transition-colors">NEW ARRIVALS</li>
              <li className="hover:text-accent cursor-pointer transition-colors">BEST SELLERS</li>
              <li className="hover:text-accent cursor-pointer transition-colors">CLASSIC FIT</li>
              <li className="hover:text-accent cursor-pointer transition-colors">CARGOS</li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-3 text-white">COMPANY</h4>
            <ul className="space-y-2">
              <li className="hover:text-accent cursor-pointer transition-colors">ABOUT US</li>
              <li className="hover:text-accent cursor-pointer transition-colors">BLOG</li>
              <li className="hover:text-accent cursor-pointer transition-colors">PRIVACY POLICY</li>
              <li className="hover:text-accent cursor-pointer transition-colors">TERMS & CONDITIONS</li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-3 text-white">CUSTOMERS</h4>
            <ul className="space-y-2">
              <li className="hover:text-accent cursor-pointer transition-colors">CONTACT US</li>
              <li className="hover:text-accent cursor-pointer transition-colors">FAQS</li>
              <li className="hover:text-accent cursor-pointer transition-colors">SHIPPING POLICY</li>
              <li className="hover:text-accent cursor-pointer transition-colors">REFUND POLICY</li>
            </ul>
          </div>
        </div>

        <p className="mt-10 text-xs text-gray-500">
          © {new Date().getFullYear()} Braand.in. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
