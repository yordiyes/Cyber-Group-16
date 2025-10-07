import React, { useState } from "react";
import { Mail, Phone, MapPin, Send } from "lucide-react";

const ContactPage = () => {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Message sent:", formData);
    alert("Thank you for reaching out! We'll get back to you soon.");
    setFormData({ name: "", email: "", message: "" });
  };

  return (
    <section className="min-h-screen bg-[#FDF6F0] text-gray-900 flex flex-col justify-center items-center p-6">
      <div className="max-w-5xl w-full shadow-2xl rounded-2xl overflow-hidden grid md:grid-cols-2 border-4 border-[#8B5E3C]">
        
        {/* Left Side - Info */}
        <div className="bg-gradient-to-b from-[#8B5E3C] via-[#A9746E] to-[#CBA38D] text-white p-10 flex flex-col justify-center">
          <h2 className="text-3xl font-bold mb-4 tracking-wide">Get in Touch</h2>
          <p className="text-gray-100 mb-6 font-medium">
            Whether you have questions about cybersecurity, need technical support, 
            or want to collaborate with the <span className="font-bold underline decoration-[#F0D4B5]">Gasha Project</span> team — 
            we’d love to hear from you!
          </p>

          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Mail size={20} className="text-[#F0D4B5]" />
              <p>support@gasha.io</p>
            </div>
            <div className="flex items-center gap-3">
              <Phone size={20} className="text-[#F0D4B5]" />
              <p>+251 987 654 321</p>
            </div>
            <div className="flex items-center gap-3">
              <MapPin size={20} className="text-[#F0D4B5]" />
              <p>Addis Ababa, Ethiopia</p>
            </div>
          </div>

          <div className="mt-8 flex gap-4 font-semibold">
            <a href="#" className="hover:text-[#F0D4B5] transition duration-300">Instagram</a>
            <a href="#" className="hover:text-[#F0D4B5] transition duration-300">LinkedIn</a>
            <a href="#" className="hover:text-[#F0D4B5] transition duration-300">Telegram</a>
          </div>
        </div>

        {/* Right Side - Contact Form */}
        <form
          onSubmit={handleSubmit}
          className="p-10 flex flex-col justify-center space-y-6 bg-[#FDF6F0] border-l-4 border-[#8B5E3C]"
        >
          <h3 className="text-2xl font-bold text-[#8B5E3C] mb-4">Send Us a Message</h3>

          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Your Name"
            required
            className="border border-[#A9746E] rounded-lg p-3 focus:outline-none focus:border-[#CBA38D]"
          />

          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Your Email"
            required
            className="border border-[#A9746E] rounded-lg p-3 focus:outline-none focus:border-[#CBA38D]"
          />

          <textarea
            name="message"
            value={formData.message}
            onChange={handleChange}
            placeholder="Your Message"
            rows={5}
            required
            className="border border-[#A9746E] rounded-lg p-3 focus:outline-none focus:border-[#CBA38D]"
          />

          <button
            type="submit"
            className="bg-[#8B5E3C] text-white flex items-center justify-center gap-2 py-3 rounded-lg hover:bg-[#CBA38D] hover:text-[#8B5E3C] transition-all duration-300 font-bold"
          >
            <Send size={18} />
            Send Message
          </button>
        </form>
      </div>
    </section>
  );
};

export default ContactPage;
