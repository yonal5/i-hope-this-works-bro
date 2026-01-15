import Header from "../components/header";

export default function About() {
  return (
    <div>
      <Header />
    

      <div className="min-h-screen bg-gradient-to-b from-primary via-blue-300 to-primary text-black flex flex-col items-center justify-center px-6 py-16">
        <div className="max-w-4xl text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 text-accent">
            About SnapSite
          </h1>

          <p className="text-black text-lg leading-relaxed mb-8">
            Welcome to{" "}
            <span className="text-accent font-semibold">SnapSite</span>, 
            a platform dedicated to selling modern, professional websites for
            businesses, startups, and individuals who want a strong online
            presence.
          </p>

          <p className="text-black text-md leading-relaxed mb-8">
            At SnapSite, we focus on delivering clean design, smooth performance,
            and user-friendly website solutions. Our websites are built to be
            responsive, reliable, and easy to manage, helping you go online
            quickly and confidently.
          </p>

          <p className="text-black text-md leading-relaxed mb-8">
            Whether you need a personal website, business website, or a custom
            web solution, SnapSite offers affordable options with transparent
            pricing and a smooth purchasing experience from start to finish.
          </p>

          <p className="text-black italic font-medium">
            “Simple websites. Professional results.”
          </p>
        </div>
      </div>
    </div>
  );
}

