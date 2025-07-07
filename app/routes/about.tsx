import { Link } from "@remix-run/react";

export default function About() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">About Me</h1>
      
      <div className="bg-white rounded-lg shadow-md p-8 mb-8">
        <div className="flex flex-col md:flex-row gap-8 items-start">
          <div className="md:w-1/3">
            <div className="aspect-square bg-gray-200 rounded-full overflow-hidden mb-4">
              {/* Replace with your actual profile image */}
              <div className="w-full h-full flex items-center justify-center text-gray-500 text-6xl">
                👤
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <h3 className="text-sm text-gray-500 font-medium">Email</h3>
                <p>contact@example.com</p>
              </div>
              
              <div>
                <h3 className="text-sm text-gray-500 font-medium">Location</h3>
                <p>Tokyo, Japan</p>
              </div>
              
              <div className="flex space-x-4 pt-4">
                <a href="#" className="text-gray-600 hover:text-blue-600 transition-colors">
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
                  </svg>
                </a>
                <a href="#" className="text-gray-600 hover:text-blue-600 transition-colors">
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                  </svg>
                </a>
                <a href="#" className="text-gray-600 hover:text-blue-600 transition-colors">
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                  </svg>
                </a>
                <a href="#" className="text-gray-600 hover:text-blue-600 transition-colors">
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
          
          <div className="md:w-2/3">
            <h2 className="text-2xl font-bold mb-4">Himajin 日本人</h2>
            
            <div className="prose max-w-none">
              <p className="mb-4">
                Hello! I'm a software developer based in Tokyo, Japan. My journey in programming started 10 years ago when I built my first website. Since then, I've been passionate about creating clean, efficient, and user-friendly applications.
              </p>
              
              <p className="mb-4">
                I specialize in full-stack web development with a focus on modern JavaScript frameworks like React, Vue, and Remix. I'm also experienced in backend technologies including Node.js, Python, and various database systems.
              </p>
              
              <h3 className="text-xl font-bold mt-6 mb-3">Skills</h3>
              <div className="flex flex-wrap gap-2 mb-6">
                <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full">JavaScript</span>
                <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full">TypeScript</span>
                <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full">React</span>
                <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full">Remix</span>
                <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full">Node.js</span>
                <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full">Python</span>
                <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full">SQL</span>
                <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full">MongoDB</span>
                <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full">Git</span>
                <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full">Docker</span>
              </div>
              
              <h3 className="text-xl font-bold mt-6 mb-3">Experience</h3>
              <div className="space-y-4">
                <div>
                  <h4 className="text-lg font-semibold">Senior Developer - Tech Company</h4>
                  <p className="text-gray-600">2020 - Present</p>
                  <p>Leading development of web applications and mentoring junior developers.</p>
                </div>
                
                <div>
                  <h4 className="text-lg font-semibold">Frontend Developer - Creative Agency</h4>
                  <p className="text-gray-600">2017 - 2020</p>
                  <p>Built responsive websites and web applications for various clients.</p>
                </div>
                
                <div>
                  <h4 className="text-lg font-semibold">Junior Developer - Startup</h4>
                  <p className="text-gray-600">2015 - 2017</p>
                  <p>Worked on frontend and backend development for a SaaS product.</p>
                </div>
              </div>
              
              <h3 className="text-xl font-bold mt-6 mb-3">Education</h3>
              <div>
                <h4 className="text-lg font-semibold">Computer Science, Tokyo University</h4>
                <p className="text-gray-600">2011 - 2015</p>
                <p>Bachelor's degree with focus on software engineering and algorithms.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="text-center">
        <Link 
          to="/"
          className="inline-block bg-blue-600 hover:bg-blue-700 text-white py-2 px-6 rounded-md transition-colors"
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
}
