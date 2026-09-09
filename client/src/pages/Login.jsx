import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      await login(form.email, form.password);
      navigate("/dashboard");
    } catch (error) {
      setMessage(
        error.response?.data?.message || "Login failed"
      );
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-purple-100 via-pink-50 to-indigo-100">

      {/* Background decorations */}
      <div className="absolute -left-40 -top-40 h-[500px] w-[500px] rounded-full bg-purple-300/40 blur-3xl"></div>

      <div className="absolute -bottom-40 -left-20 h-[450px] w-[450px] rounded-full bg-pink-300/40 blur-3xl"></div>

      <div className="absolute -bottom-40 -right-40 h-[500px] w-[500px] rounded-full bg-indigo-300/40 blur-3xl"></div>

      {/* Main Container */}
      <div className="relative z-10 mx-auto flex min-h-screen max-w-7xl items-center justify-center px-6 py-10">

        <div className="grid w-full overflow-hidden rounded-[30px] bg-white/30 shadow-2xl backdrop-blur-xl lg:grid-cols-2">

          {/* ================= LEFT SIDE ================= */}

          <div className="relative hidden min-h-[650px] overflow-hidden p-12 lg:block">

            {/* Logo */}
            <div className="text-3xl font-extrabold">
              <span className="text-slate-800">Dev</span>
              <span className="bg-gradient-to-r from-purple-600 via-fuchsia-500 to-pink-500 bg-clip-text text-transparent">
                Collab
              </span>
            </div>

            {/* Heading */}
            <div className="mt-16 max-w-lg">

              <h1 className="text-5xl font-black leading-tight tracking-tight text-slate-800">
                Build.
                <br />
                Collaborate.
                <br />
                <span className="bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">
                  Code Together.
                </span>
              </h1>

              <p className="mt-6 text-lg leading-8 text-slate-600">
                Connect with developers, manage projects,
                communicate with your team, solve coding
                problems and write code together.
              </p>

            </div>

            {/* Code Window */}
            <div className="absolute bottom-16 left-12 w-[430px] rotate-[-2deg] overflow-hidden rounded-2xl bg-slate-900 shadow-2xl">

              {/* Window Header */}
              <div className="flex h-10 items-center gap-2 bg-slate-800 px-4">

                <div className="h-3 w-3 rounded-full bg-red-400"></div>
                <div className="h-3 w-3 rounded-full bg-yellow-400"></div>
                <div className="h-3 w-3 rounded-full bg-green-400"></div>

              </div>

              {/* Code */}
              <div className="p-6 font-mono text-sm leading-7 text-slate-300">

                <p>
                  <span className="text-purple-400">const</span>{" "}
                  developer = {"{"}
                </p>

                <p className="pl-6">
                  name:{" "}
                  <span className="text-green-400">
                    "Developer"
                  </span>
                  ,
                </p>

                <p className="pl-6">
                  skills:{" "}
                  <span className="text-green-400">
                    "Full Stack"
                  </span>
                </p>

                <p>{"}"}</p>

                <p className="mt-2">
                  developer
                  <span className="text-purple-400">
                    .collaborate
                  </span>
                  ();
                </p>

                <p>
                  developer
                  <span className="text-purple-400">
                    .build
                  </span>
                  ();
                </p>

              </div>

            </div>

            {/* Floating Cards */}

            <div className="absolute right-8 top-40 rounded-xl bg-white/80 px-5 py-3 shadow-xl backdrop-blur-md">
              <span className="font-semibold text-slate-700">
                💻 Code Together
              </span>
            </div>

            <div className="absolute bottom-24 right-16 rounded-xl bg-white/80 px-5 py-3 shadow-xl backdrop-blur-md">
              <span className="font-semibold text-slate-700">
                💬 Team Chat
              </span>
            </div>

          </div>

          {/* ================= RIGHT SIDE ================= */}

          <div className="flex items-center justify-center bg-white/70 p-6 sm:p-12">

            <div className="w-full max-w-md rounded-3xl bg-white p-8 shadow-xl sm:p-10">

              {/* Mobile Logo */}
              <div className="mb-8 text-center lg:hidden">

                <h1 className="text-3xl font-extrabold">
                  <span className="text-slate-800">
                    Dev
                  </span>

                  <span className="bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">
                    Collab
                  </span>
                </h1>

              </div>

              {/* Heading */}

              <h2 className="text-center text-4xl font-bold text-slate-800">
                Welcome Back
              </h2>

              <p className="mt-2 text-center text-sm text-slate-500">
                Login to continue to DevCollab
              </p>

              {/* Form */}

              <form
                onSubmit={handleSubmit}
                className="mt-8 space-y-5"
              >

                {/* Email */}

                <div>

                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Email
                  </label>

                  <input
                    type="email"
                    name="email"
                    placeholder="Enter your email"
                    value={form.email}
                    onChange={handleChange}
                    required
                    className="w-full rounded-xl border border-slate-300 px-4 py-3.5 text-slate-800 outline-none transition focus:border-purple-500 focus:ring-4 focus:ring-purple-100"
                  />

                </div>

                {/* Password */}

                <div>

                  <div className="mb-2 flex items-center justify-between">

                    <label className="text-sm font-semibold text-slate-700">
                      Password
                    </label>

                    <span
                      onClick={() =>
                        setMessage(
                          "Password reset feature coming soon."
                        )
                      }
                      className="cursor-pointer text-xs font-semibold text-purple-600 hover:underline"
                    >
                      Forgot password?
                    </span>

                  </div>

                  <input
                    type="password"
                    name="password"
                    placeholder="Enter your password"
                    value={form.password}
                    onChange={handleChange}
                    required
                    className="w-full rounded-xl border border-slate-300 px-4 py-3.5 text-slate-800 outline-none transition focus:border-purple-500 focus:ring-4 focus:ring-purple-100"
                  />

                </div>

                {/* Error */}

                {message && (
                  <div className="rounded-xl bg-red-50 p-3 text-sm text-red-600">
                    {message}
                  </div>
                )}

                {/* Login Button */}

                <button
                  type="submit"
                  className="w-full rounded-xl bg-gradient-to-r from-purple-600 via-fuchsia-500 to-pink-500 py-3.5 font-bold text-white shadow-lg shadow-purple-200 transition hover:-translate-y-0.5 hover:shadow-xl"
                >
                  Login
                </button>

              </form>

              {/* Divider */}

              <div className="my-7 flex items-center gap-4">

                <div className="h-px flex-1 bg-slate-200"></div>

                <span className="text-xs text-slate-400">
                  OR
                </span>

                <div className="h-px flex-1 bg-slate-200"></div>

              </div>

              {/* Register */}

              <p className="text-center text-sm text-slate-500">

                Don't have an account?

                <span
                  onClick={() => navigate("/register")}
                  className="ml-1 cursor-pointer font-bold text-purple-600 hover:underline"
                >
                  Create account
                </span>

              </p>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
};

export default Login;