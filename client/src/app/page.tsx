'use client'
import Image from "next/image"
import Link from "next/link"

export default function Home() {

  return (
    <div className="min-h-screen flex flex-col bg-black text-white">
      {/* Navbar */}
     <nav className="flex items-center w-full bg-black p-4 h-[70px] relative z-20">
  <div className="flex items-center space-x-3">
    <Image src="/symbol.jpg" alt="Logo" height={50} width={50} className="rounded" />
    <h2 className="text-xl font-semibold font-mono">ThinkFast AI</h2>
  </div>

  {/* Updated Menu */}
  <div className="flex space-x-1 sm:space-x-2 text-xs absolute left-1/2 -translate-x-1/2 whitespace-nowrap xl:gap-4 flex-wrap">
    <Link href="/" className="hover:text-gray-300 transition  px-2 py-1 sm:px-3 sm:py-1 rounded-full text-[10px] xl:text-xl sm:text-lg md:text-lg lg:text-base">
      Home
    </Link>
    <Link href="/about" className="hover:text-gray-300 transition  px-2 py-0.5 sm:px-3 sm:py-1 rounded-full text-[10px] xl:text-xl sm:text-xs md:text-lg lg:text-base">
      About
    </Link>
    <Link href="/chat" className="hover:text-gray-300 transition  px-2 py-0.5 sm:px-3 sm:py-1 rounded-full text-[10px] xl:text-xl sm:text-xs md:text-lg lg:text-base">
      Chat with AI
    </Link>
    <Link href="/login" className="hover:text-gray-300 transition  px-2 py-0.5 sm:px-3 sm:py-1 rounded-full text-[10px] xl:text-xl sm:text-xs md:text-lg lg:text-base">
      Login/Register
    </Link>
  </div>
</nav>

      {/* Hero Section */}
      <section className="relative w-full h-[700px] flex items-center justify-center text-center px-4 overflow-hidden">
        <Image
          src="/rocketthree.png"
          alt="Background"
          layout="fill"
          objectFit="cover"
          className="z-0"
          priority
        />
        <div className="z-10 bg-black/60 backdrop-blur-md p-6 rounded-xl max-w-2xl">
          <h2 className="text-3xl md:text-4xl font-bold">
            Supercharge Your Productivity with AI-Powered Conversations
          </h2>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-6 bg-black/90">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          {/* Features Text */}
          <div className="space-y-6">
            <h3 className="text-3xl font-bold mb-4">Key Features</h3>
            {[
              { icon: "🚀", title: "Instant Answers", desc: "Get accurate responses in seconds, powered by cutting-edge AI." },
              { icon: "📚", title: "Knowledge Integration", desc: "Chat with your documents (PDFs, Images) for personalized insights." },
              { icon: "💡", title: "Learning Companion", desc: "Ideal for students, professionals, and curious minds." },
              { icon: "🔒", title: "Privacy-First", desc: "Your data stays secure and private." }
            ].map((feature, i) => (
              <div key={i} className="flex items-start space-x-3">
                <span className="text-2xl">{feature.icon}</span>
                <div>
                  <h4 className="text-xl font-semibold">{feature.title}</h4>
                  <p className="text-gray-300">{feature.desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Brain Image */}
          <div className="flex justify-center">
            <Image
              src="/brain.jpeg"
              alt="AI Brain"
              width={400}
              height={400}
              className="rounded-lg shadow-lg"
            />
          </div>
        </div>
      </section>

      {/* Use Cases */}
      <section className="py-16 px-6 bg-black">
        <div className="max-w-5xl mx-auto space-y-8">
          <h3 className="text-3xl font-bold mb-4">Use Cases</h3>
          <div className="grid md:grid-cols-2 gap-10">
            <div className="flex items-start space-x-3">
              <span className="text-2xl">👨‍🎓</span>
              <div>
                <h4 className="text-xl font-semibold">For Students</h4>
                <p className="text-gray-300">"Explain complex topics like a tutor."</p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <span className="text-2xl">💼</span>
              <div>
                <h4 className="text-xl font-semibold">For Professionals</h4>
                <p className="text-gray-300">"Draft emails, debug code, or brainstorm ideas."</p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <span className="text-2xl">🎨</span>
              <div>
                <h4 className="text-xl font-semibold">For Creatives</h4>
                <p className="text-gray-300">"Overcome writer’s block with AI collaboration."</p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <span className="text-2xl">🫶</span>
              <div>
                <h4 className="text-xl font-semibold">Your Ideal Friend</h4>
                <p className="text-gray-300">"A Friend who can guide and care for you."</p>
              </div>
            </div>

          </div>
        </div>
      </section>
    </div>
  )
}
