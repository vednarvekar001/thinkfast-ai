'use client'
import React from 'react'
import Image from 'next/image'
import Link from "next/link"

function page() {
  return (
    <div className='min-h-screen flex flex-col bg-black text-white'>
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

export default page