import { MdQuestionMark } from "react-icons/md";
import { TbExclamationMark } from "react-icons/tb";
export default function NotFoundPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <MdQuestionMark className="h-[150px] w-[150px]"/>    
        <h1 className="text-6xl font-bold text-gray-800 mb-4">404</h1>
        <p className="text-xl text-gray-600 mb-8">Oops! The page you're looking for doesn't exist.</p>
        <a href="/"  className="px-6 py-3 bg-accent text-white rounded hover:bg-orange-600 transition">
          Go Back Home
        </a>
    </div>
  );
}