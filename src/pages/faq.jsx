import React from "react";

export default function FAQPage() {
  const faqs = [
    { q: "How long does shipping take?", a: "Shipping usually takes 3-7 business days." },
    { q: "What is the return policy?", a: "You can return items within 14 days in original condition." },
    { q: "How do I track my order?", a: "Go to Orders page and click tracking number." },
  ];

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl mb-4">FAQ / Help</h1>
      <div className="space-y-4">
        {faqs.map((f, i) => (
          <div key={i} className="border rounded p-4">
            <div className="font-medium mb-2">{f.q}</div>
            <div className="text-gray-700">{f.a}</div>
          </div>
        ))}
      </div>
    </div>
  );
}