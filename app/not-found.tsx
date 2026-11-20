import Link from "next/link";
import { Home, PhoneCall, ArrowLeft, ShieldAlert } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-[80vh] bg-gray-50 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-16">
      <div className="max-w-xl w-full bg-white rounded-3xl shadow-xl border border-gray-100 p-8 md:p-12 text-center">
        
        {/* Warning Icon Graphic */}
        <div className="w-20 h-20 bg-green-50 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
          <ShieldAlert size={40} />
        </div>

        {/* Error Code & Heading */}
        <span className="text-green-600 font-extrabold text-sm tracking-widest uppercase bg-green-50 px-3 py-1 rounded-full">
          Error 404
        </span>
        <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mt-4 mb-3">
          Oops! Page Not Found
        </h1>
        
        <p className="text-gray-600 text-base leading-relaxed mb-8">
          It looks like the page you are looking for has been moved, deleted, or never existed. Don't worry, our pest control experts are here to help you get back on track!
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link 
            href="/"
            className="w-full sm:w-auto bg-green-600 hover:bg-green-700 text-white font-bold py-3.5 px-6 rounded-xl transition-all shadow-md flex items-center justify-center gap-2"
          >
            <Home size={18} /> Go Back Home
          </Link>

          <Link 
            href="/contact"
            className="w-full sm:w-auto bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold py-3.5 px-6 rounded-xl transition-all flex items-center justify-center gap-2"
          >
            <PhoneCall size={18} /> Contact Support
          </Link>
        </div>

        {/* Quick Help Footer inside Card */}
        <div className="mt-10 pt-6 border-t border-gray-100 text-sm text-gray-500">
          Need urgent pest control service? Call us directly at{" "}
          <a href="tel:+919453394533" className="text-green-700 font-bold hover:underline">
            +91-94533 94533
          </a>
        </div>

      </div>
    </div>
  );
}