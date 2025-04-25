// src/pages/index.js

export default function HomePage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-100 mb-4">
          Restaurant Management System
        </h1>
        <p className="text-gray-300">
          First page that loads when app is run.
          Make it the user home page (about restaurant info, header etc)
        </p>
      </div>
    </div>
  );
}