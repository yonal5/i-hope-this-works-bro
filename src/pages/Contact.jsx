import { useState } from "react";
import Header, { TtitleBar } from "../components/header";

export default function Contact() {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Message sent successfully! (Backend not yet connected)");
    setFormData({ name: "", email: "", message: "" });
  };

  return (<div className="w-full h-full">
    <Header/>
    <TtitleBar/>
    <div className="min-h-screen bg-gradient-to-b from-primary to-primary text-black flex flex-col items-center justify-center px-6 py-16">
      
      <div className="max-w-3xl w-full text-center">
        
        <h1 className="text-4xl md:text-5xl font-bold mb-6 text-accent  ">
          Contact Us
        </h1>
        <p className="text-black mb-10">
          Have questions, feedback, or partnership ideas? We’d love to hear from you.
        </p>

        <form
          onSubmit={handleSubmit}
          className="w-full bg-black rounded-2xl p-6 sm:p-8 shadow-lg"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            <input
              type="text"
              name="name"
              placeholder="Your Name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full p-3 rounded-lg bg-gray-900 border border-gray-700 focus:border-accent outline-none text-white"
            />
            <input
              type="email"
              name="email"
              placeholder="Your Email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full p-3 rounded-lg bg-gray-900 border border-gray-700 focus:border-accent outline-none text-white"
            />
          </div>

          <textarea
            name="message"
            placeholder="Your Message"
            value={formData.message}
            onChange={handleChange}
            required
            className="w-full p-3 rounded-lg bg-gray-900 border border-gray-700 focus:border-accent outline-none text-white mb-6 h-32"
          ></textarea>

          <button
            type="submit"
            className="w-full bg-accent hover:bg-orange-600 text-white font-semibold py-3 rounded-lg transition"
          >
            Send Message
          </button>
        </form>

        <div className="mt-10 text-gray-400">
          <p>Email: <span className="text-black">hubify.web.sell@gmail.com</span></p>
          <p>Phone: <span className="text-black">+94 71 102 2594</span></p>
          <p> <span className="text-black"></span></p>
        </div>
      </div>
    </div>
    </div>
  );
}
