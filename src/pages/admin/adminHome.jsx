import { FaUserShield, FaBoxOpen, FaShoppingCart, FaCogs } from "react-icons/fa";
import { MdSecurity, MdSupportAgent } from "react-icons/md";

export default function AdminHomePage() {
  return (
    <div className="p-6 max-w-5xl mx-auto space-y-10">

      {/* WELCOME */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-accent">
          👋 Welcome to the Admin Panel
        </h1>
        <p className="text-gray-600 text-lg">
          We’re happy to have you here! This page will guide you through
          your responsibilities and help you understand how everything works.
        </p>
      </div>

      {/* INTRO IMAGE */}
      <img
        src="/Control Panel .jpg"
        alt="Admin welcome"
        className="w-full rounded-xl shadow"
      />

      {/* WHAT IS THIS PANEL */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold flex items-center gap-2">
          <FaUserShield className="text-accent" /> What is this Admin Panel?
        </h2>
        <p className="text-gray-700 leading-relaxed">
          This admin panel is the control center of the system.  
          As an administrator, you have special permissions to manage products,
          monitor orders, assist customers, and control system settings.
        </p>
      </section>

      {/* HOW TO WORK */}
      <section className="space-y-6">
        <h2 className="text-2xl font-semibold flex items-center gap-2">
          ⚙️ How to Work Here
        </h2>

        <div className="grid md:grid-cols-2 gap-6">

          <InfoCard
            icon={<FaBoxOpen />}
            title="Manage Products"
            text="Add new products, update prices, change images, and remove unavailable items."
          />

          <InfoCard
            icon={<FaShoppingCart />}
            title="Handle Orders"
            text="View customer orders, update order status, and make sure deliveries are processed correctly."
          />

          <InfoCard
            icon={<MdSupportAgent />}
            title="Customer Support"
            text="Chat with customers, answer questions, and solve issues professionally."
          />

          <InfoCard
            icon={<FaCogs />}
            title="System Settings"
            text="Configure website settings, manage categories, banners, and system preferences."
          />
        </div>
      </section>

      {/* SECURITY */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold flex items-center gap-2">
          <MdSecurity className="text-accent" /> Security & Responsibility
        </h2>
        <p className="text-gray-700 leading-relaxed">
          🔐 Admin access is powerful and sensitive.  
          Never share your login details. Always double-check actions
          like deleting products or updating prices.  
          Your actions directly affect customers and the business.
        </p>
      </section>

      {/* FINAL MESSAGE */}
      <div className="bg-accent/10 p-6 rounded-xl text-center">
        <p className="text-lg font-medium">
          🚀 You’re all set!  
          Explore the menu, learn the system, and manage everything with confidence.
        </p>
        <p className="text-sm text-gray-600 mt-2">
          If you’re unsure about something, ask a senior admin or check the documentation.
        </p>
      </div>

    </div>
  );
}

/* SMALL INFO CARD */
function InfoCard({ icon, title, text }) {
  return (
    <div className="bg-white shadow rounded-xl p-5 space-y-3">
      <div className="text-3xl text-accent">{icon}</div>
      <h3 className="text-xl font-semibold">{title}</h3>
      <p className="text-gray-600">{text}</p>
    </div>
  );
}
