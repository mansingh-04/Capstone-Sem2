"use client";

import Navbar from "./Navbar";
import Footer from "./Footer";

export default function ClientLayout({ children }) {
  return (
    <>
      <Navbar />
      <main>{children}</main>
      <Footer />
    </>
  );
} 