// app/contact/page.tsx
export default function ContactPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center px-4">
      <div className="w-full max-w-5xl grid md:grid-cols-2 gap-8 bg-white rounded-2xl shadow-xl overflow-hidden">
        {/* Left Info Section */}
        <div className="bg-gradient-to-br from-indigo-600 to-purple-600 text-white p-8 md:p-12">
          <h2 className="text-3xl font-bold mb-4">Get in Touch</h2>
          <p className="text-indigo-100 mb-8">
            Have a question, project idea, or just want to say hello? Fill out
            the form and I’ll get back to you as soon as possible.
          </p>

          <div className="space-y-4 text-sm">
            <p>
              <span className="font-semibold">Email:</span> subroto.iu@gmail.com
            </p>
            <p>
              <span className="font-semibold">Phone:</span> +8801722272790
            </p>
            <p>
              <span className="font-semibold">Location:</span> Kushtia,
              Bangladesh
            </p>
          </div>
        </div>

        {/* Right Form Section */}
        <div className="p-8 md:p-12">
          <h3 className="text-2xl font-semibold text-gray-800 mb-6">
            Contact Us
          </h3>

          <form className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Full Name
              </label>
              <input
                type="text"
                placeholder="Your name"
                className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Email Address
              </label>
              <input
                type="email"
                placeholder="you@example.com"
                className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Message
              </label>
              <textarea
                rows={5}
                placeholder="Write your message..."
                className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
              ></textarea>
            </div>

            <button
              type="submit"
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-lg transition duration-200"
            >
              Send Message
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
