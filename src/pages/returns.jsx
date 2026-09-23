import React from "react";

export default function ReturnsPage() {
  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl mb-4">Shipping & Returns</h1>
      <section className="mb-4">
        <h2 className="font-medium mb-2">Shipping</h2>
        <p>Orders are processed within 1-2 business days. Delivery times depend on your location and chosen shipping method.</p>
      </section>
      <section>
        <h2 className="font-medium mb-2">Returns</h2>
        <p>Items may be returned within 14 days. Items must be unused and in original packaging. Contact support for RMA.</p>
      </section>
    </div>
  );
}