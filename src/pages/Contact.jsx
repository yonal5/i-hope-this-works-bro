import Header, { TtitleBar } from "../components/header";

export default function Contact() {
  return (
    <div>
      <Header />
      <TtitleBar />
      <div className="min-h-screen bg-gradient-to-b from-primary via-blue-300 to-primary text-black flex flex-col items-center justify-center px-6 py-16">
        <div className="max-w-3xl text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 text-accent">
            Contact Us
          </h1>
          <p className="text-black text-lg leading-relaxed mb-8">
            Have questions, ideas, or need a custom website built just for you?  
            The <span className="text-accent font-semibold">SnapSite</span> team is here to help!  
            Whether you’re starting your first business site or upgrading your online presence,  
            we’d love to hear from you.
          </p>
          <p className="text-black text-md leading-relaxed mb-8">
            Reach out to us anytime for inquiries, collaborations, or technical support.  
            We respond quickly and ensure your experience with SnapSite is smooth from start to finish.
          </p>
          <div className="mt-10 text-left bg-white/70 rounded-2xl shadow-lg p-8 inline-block">
            <h2 className="text-2xl font-semibold mb-4 text-accent">Get in Touch</h2>
            <p><strong>Email:</strong> support@snapsite.com</p>
            <p><strong>Phone:</strong> +94 77 123 4567</p>
            <p><strong>Address:</strong> 123 Web Avenue, Colombo, Sri Lanka</p>
          </div>
          <p className="text-black italic mt-8">
            “We’re only one click away from bringing your vision online.”
          </p>
        </div>
      </div>
    </div>
  );
}
