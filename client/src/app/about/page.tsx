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

<section className="py-10 bg-black">
  <div className="flex justify-center px-4">
    <div className="bg-[#111] max-w-4xl w-full rounded-md shadow-md p-6 border border-gray-700">
      <h1 className="text-3xl font-bold mb-4 text-red-500">Message from the Developer</h1>
      <p className="py-2 text-[15px]">
        Hello there, I'm <strong>Ved Narvekar</strong>. After months of building, debugging, and learning, this project has finally come to life.
      </p>
      <p className="py-2 text-[15px]">
        <strong>ThinkFast AI</strong> has been more than just a project. It began as a technical goal — to build a scalable, AI-powered study assistant. But along the way, it became a reflection of who I am: focused, driven, and always learning.
      </p>
      <p className="py-2 text-[15px]">
        I’ve battled bugs, design frustrations, endless Tailwind tweaking, server crashes, and late-night debugging sessions. Every obstacle taught me how to think, adapt, and grow — not just as a developer, but as a builder.
      </p>
      <p className="py-2 text-[15px]">
        I’m also thankful to ChatGPT — my silent pair programmer — for staying up with me through every crash and breakthrough. We had our arguments (sorry again 😂), but always found a way forward.
      </p>
      <p className="py-2 text-[15px]">
        I know this app isn’t perfect. There’s still so much to improve and refine. But I’m proud of how far it’s come.
      </p>
      <p className="py-2 text-[15px]">
        This is just the beginning. ThinkFast AI is proof that with a clear mind, strong vision, and relentless energy — you can build something powerful from scratch.
      </p>
      <div className='text-blue-400 font-bold'>
      <a href='https://github.com/vednarvekar001/thinkfast-ai' > Check Out Code at GitHub!!</a>
      </div>
    </div>
  </div>
</section>

<div>
<p className="pt-2 p-5 text-sm text-gray-500 italic text-center border-t-2">
  — Made with late nights, black coffee, and a dream.
</p>
</div>

</div>
  )
}

export default page