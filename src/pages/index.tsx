import { NextPage } from "next";
import { signIn } from "next-auth/react";
import { useRouter } from "next/router";
import Image from "next/image";

const Home: NextPage = () => {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col">
      {/* Header Section */}
      <header className="w-full py-6 bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-indigo-600">QuizMaster</h1>
          <nav className="space-x-6">
            <button
              className="text-indigo-600 hover:text-indigo-800 font-medium"
              onClick={() => signIn().catch(err => console.log(err))}
            >
              Sign In
            </button>
            <button
              className="bg-indigo-600 text-white px-6 py-2 rounded-full hover:bg-indigo-700 transition"
              onClick={() => router.push('/admin')}
            >
              Go to App
            </button>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="flex-1 flex items-center justify-center py-20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-5xl font-extrabold text-gray-900 mb-6">
            Challenge Your Knowledge with QuizMaster
          </h2>
          <p className="text-xl text-gray-600 mb-10">
            Dive into thousands of quizzes on topics from science to pop culture. Create your own, compete with friends, and climb the leaderboards!
          </p>
          <div className="flex justify-center space-x-4">
            <button
              className="bg-green-600 text-white px-8 py-3 rounded-full text-lg font-medium hover:bg-green-700 transition"
              onClick={() => router.push('/admin')}
            >
              Get Started for Free
            </button>
            <button
              className="bg-transparent border-2 border-indigo-600 text-indigo-600 px-8 py-3 rounded-full text-lg font-medium hover:bg-indigo-50 transition"
              onClick={() => router.push('/admin')}
            >
              See Demos
            </button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <h3 className="text-3xl font-bold text-center text-gray-900 mb-12">Why Choose QuizMaster?</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6 rounded-lg shadow-lg">
              <div className="mb-4 text-4xl">🧠</div>
              <h4 className="text-xl font-semibold mb-2">Diverse Quizzes</h4>
              <p className="text-gray-600">Explore quizzes in multiple categories tailored to your interests.</p>
            </div>
            <div className="text-center p-6 rounded-lg shadow-lg">
              <div className="mb-4 text-4xl">🏆</div>
              <h4 className="text-xl font-semibold mb-2">Compete & Win</h4>
              <p className="text-gray-600">Join global leaderboards and earn badges for your achievements.</p>
            </div>
            <div className="text-center p-6 rounded-lg shadow-lg">
              <div className="mb-4 text-4xl">✏️</div>
              <h4 className="text-xl font-semibold mb-2">Create Your Own</h4>
              <p className="text-gray-600">Build custom quizzes and share them with the community.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-indigo-50">
        <div className="max-w-7xl mx-auto px-4">
          <h3 className="text-3xl font-bold text-center text-gray-900 mb-12">What Our Users Say</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <p className="text-gray-600 mb-4">"QuizMaster has made learning fun and engaging for my students!"</p>
              <div className="flex items-center">
                <Image src="/user1.jpg" alt="User" width={40} height={40} className="rounded-full" />
                <span className="ml-3 font-medium">Jane Doe, Teacher</span>
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <p className="text-gray-600 mb-4">"The best quiz app out there. Highly addictive!"</p>
              <div className="flex items-center">
                <Image src="/user2.jpg" alt="User" width={40} height={40} className="rounded-full" />
                <span className="ml-3 font-medium">John Smith, Quiz Enthusiast</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-6 bg-indigo-800 text-white text-center">
        <p>&copy; 2025 QuizMaster. All rights reserved.</p>
        <div className="mt-2 space-x-4">
          <a href="/privacy" className="hover:underline">Privacy Policy</a>
          <a href="/terms" className="hover:underline">Terms of Service</a>
        </div>
      </footer>
    </div>
  );
};

export default Home;

