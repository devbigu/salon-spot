import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Logo from "@/images/logo.png";
import LogoDark from "@/images/logo-dark.png";
import Head from "@/layout/head/Head";
import AuthFooter from "./AuthFooter";
import { Button, Icon } from "@/components/Component";
import { Spinner, Alert } from "reactstrap";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { useAuth } from "@/auth/AuthContext";

// Dashboard template thumbnails (inline SVG representations of the 3 dashboards)
const DashboardTemplates = [
  {
    id: "crypto",
    label: "Crypto Dashboard",
    preview: (
      <svg viewBox="0 0 280 170" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
        {/* Dark navy bg */}
        <rect width="280" height="170" fill="#1a1f36" rx="6" />
        {/* Left sidebar */}
        <rect x="0" y="0" width="56" height="170" fill="#141929" rx="6" />
        <rect x="8" y="12" width="40" height="8" rx="2" fill="#6576ff" />
        <rect x="10" y="30" width="36" height="5" rx="1.5" fill="#2d3561" />
        <rect x="10" y="42" width="28" height="4" rx="1.5" fill="#2d3561" />
        <rect x="10" y="54" width="32" height="4" rx="1.5" fill="#6576ff" fillOpacity="0.7" />
        <rect x="10" y="66" width="28" height="4" rx="1.5" fill="#2d3561" />
        <rect x="10" y="78" width="30" height="4" rx="1.5" fill="#2d3561" />
        <rect x="10" y="90" width="26" height="4" rx="1.5" fill="#2d3561" />
        {/* Main area */}
        {/* Balance card */}
        <rect x="64" y="10" width="80" height="44" rx="4" fill="#6576ff" />
        <rect x="70" y="16" width="40" height="4" rx="1.5" fill="white" fillOpacity="0.6" />
        <rect x="70" y="26" width="60" height="7" rx="2" fill="white" />
        <rect x="70" y="38" width="30" height="4" rx="1.5" fill="white" fillOpacity="0.5" />
        {/* Stats */}
        <rect x="152" y="10" width="58" height="20" rx="3" fill="#232b4e" />
        <rect x="156" y="14" width="20" height="3" rx="1" fill="#6576ff" fillOpacity="0.7" />
        <rect x="156" y="20" width="30" height="4" rx="1" fill="white" fillOpacity="0.8" />
        <rect x="218" y="10" width="54" height="20" rx="3" fill="#232b4e" />
        <rect x="222" y="14" width="20" height="3" rx="1" fill="#6576ff" fillOpacity="0.7" />
        <rect x="222" y="20" width="28" height="4" rx="1" fill="white" fillOpacity="0.8" />
        {/* Chart area */}
        <rect x="152" y="36" width="120" height="62" rx="3" fill="#1e2540" />
        <rect x="156" y="40" width="30" height="3" rx="1" fill="white" fillOpacity="0.5" />
        <polyline points="156,88 168,76 180,80 195,68 210,72 224,58 238,62 252,52 264,56" fill="none" stroke="#6576ff" strokeWidth="1.5" />
        <polyline points="156,92 168,85 180,88 195,80 210,83 224,72 238,76 252,68 264,72" fill="none" stroke="#09c2de" strokeWidth="1.5" />
        <polyline points="156,95 168,90 180,94 195,86 210,90 224,82 238,86 252,79 264,83" fill="none" stroke="#1ee0ac" strokeWidth="1.5" />
        {/* Recent activity */}
        <rect x="64" y="62" width="80" height="50" rx="3" fill="#1e2540" />
        <rect x="68" y="66" width="30" height="3" rx="1" fill="white" fillOpacity="0.5" />
        <rect x="68" y="74" width="56" height="4" rx="1.5" fill="#2d3965" />
        <rect x="68" y="82" width="50" height="4" rx="1.5" fill="#2d3965" />
        <rect x="68" y="90" width="56" height="4" rx="1.5" fill="#2d3965" />
        <rect x="68" y="98" width="48" height="4" rx="1.5" fill="#2d3965" />
        {/* Bottom section */}
        <rect x="64" y="118" width="208" height="42" rx="3" fill="#1e2540" />
        <rect x="70" y="124" width="40" height="3" rx="1" fill="white" fillOpacity="0.5" />
        <rect x="70" y="132" width="160" height="4" rx="1.5" fill="#2d3965" />
        <rect x="70" y="140" width="130" height="4" rx="1.5" fill="#2d3965" />
      </svg>
    ),
  },
  {
    id: "invest",
    label: "Investment Dashboard",
    preview: (
      <svg viewBox="0 0 280 170" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
        {/* Light bg */}
        <rect width="280" height="170" fill="#f5f6fa" rx="6" />
        {/* Top nav */}
        <rect x="0" y="0" width="280" height="28" fill="#1a1f36" rx="6" />
        <rect x="0" y="20" width="280" height="8" fill="#1a1f36" />
        <rect x="8" y="8" width="40" height="10" rx="2" fill="#6576ff" />
        <rect x="56" y="10" width="28" height="6" rx="1.5" fill="white" fillOpacity="0.6" />
        <rect x="92" y="10" width="22" height="6" rx="1.5" fill="white" fillOpacity="0.6" />
        <rect x="122" y="10" width="22" height="6" rx="1.5" fill="white" fillOpacity="0.6" />
        <rect x="152" y="10" width="22" height="6" rx="1.5" fill="white" fillOpacity="0.6" />
        <rect x="228" y="6" width="44" height="16" rx="8" fill="#2d3561" />
        {/* Welcome */}
        <rect x="10" y="34" width="80" height="8" rx="2" fill="#1a1f36" />
        <rect x="10" y="46" width="50" height="5" rx="1.5" fill="#8091a7" />
        {/* Active plan card */}
        <rect x="170" y="32" width="100" height="30" rx="4" fill="white" />
        <rect x="176" y="38" width="50" height="4" rx="1.5" fill="#8091a7" />
        <rect x="176" y="46" width="70" height="5" rx="1.5" fill="#6576ff" />
        {/* Stats row */}
        <rect x="10" y="60" width="82" height="36" rx="4" fill="#6576ff" />
        <rect x="16" y="66" width="40" height="3" rx="1" fill="white" fillOpacity="0.7" />
        <rect x="16" y="74" width="55" height="7" rx="2" fill="white" />
        <rect x="100" y="60" width="82" height="36" rx="4" fill="white" />
        <rect x="106" y="66" width="40" height="3" rx="1" fill="#8091a7" />
        <rect x="106" y="74" width="55" height="7" rx="2" fill="#1a1f36" />
        <rect x="190" y="60" width="82" height="36" rx="4" fill="white" />
        <rect x="196" y="66" width="40" height="3" rx="1" fill="#8091a7" />
        <rect x="196" y="74" width="55" height="7" rx="2" fill="#1a1f36" />
        {/* Details row */}
        <rect x="10" y="104" width="82" height="58" rx="4" fill="white" />
        <rect x="16" y="110" width="40" height="3" rx="1" fill="#8091a7" />
        <rect x="16" y="118" width="55" height="5" rx="1.5" fill="#1a1f36" />
        <rect x="16" y="128" width="30" height="3" rx="1" fill="#8091a7" />
        <rect x="16" y="135" width="55" height="4" rx="1.5" fill="#1a1f36" />
        <rect x="16" y="142" width="42" height="4" rx="1.5" fill="#1a1f36" />
        <rect x="100" y="104" width="82" height="58" rx="4" fill="white" />
        <rect x="106" y="110" width="40" height="3" rx="1" fill="#8091a7" />
        <rect x="106" y="118" width="55" height="5" rx="1.5" fill="#1a1f36" />
        <rect x="106" y="128" width="30" height="3" rx="1" fill="#8091a7" />
        <rect x="106" y="135" width="55" height="4" rx="1.5" fill="#1a1f36" />
        <rect x="190" y="104" width="82" height="58" rx="4" fill="white" />
        <rect x="196" y="110" width="40" height="3" rx="1" fill="#8091a7" />
        <rect x="196" y="118" width="55" height="5" rx="1.5" fill="#1a1f36" />
        <rect x="196" y="128" width="30" height="3" rx="1" fill="#8091a7" />
      </svg>
    ),
  },
  {
    id: "account",
    label: "Account Dashboard",
    preview: (
      <svg viewBox="0 0 280 170" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
        {/* White bg */}
        <rect width="280" height="170" fill="#f5f6fa" rx="6" />
        {/* Left sidebar */}
        <rect x="0" y="0" width="70" height="170" fill="white" rx="6" />
        <rect x="0" y="0" width="6" height="170" fill="white" />
        <rect x="8" y="10" width="52" height="12" rx="3" fill="#6576ff" fillOpacity="0.15" />
        <rect x="12" y="13" width="28" height="6" rx="1.5" fill="#6576ff" />
        <rect x="10" y="30" width="8" height="8" rx="1.5" fill="#6576ff" fillOpacity="0.4" />
        <rect x="22" y="32" width="36" height="4" rx="1.5" fill="#1a1f36" />
        <rect x="10" y="44" width="8" height="8" rx="1.5" fill="#8091a7" fillOpacity="0.4" />
        <rect x="22" y="46" width="36" height="4" rx="1.5" fill="#8091a7" />
        <rect x="10" y="58" width="8" height="8" rx="1.5" fill="#8091a7" fillOpacity="0.4" />
        <rect x="22" y="60" width="30" height="4" rx="1.5" fill="#8091a7" />
        <rect x="10" y="72" width="8" height="8" rx="1.5" fill="#8091a7" fillOpacity="0.4" />
        <rect x="22" y="74" width="34" height="4" rx="1.5" fill="#8091a7" />
        <rect x="10" y="94" width="50" height="3" rx="1" fill="#e5e9f0" />
        <rect x="10" y="104" width="36" height="3" rx="1" fill="#8091a7" fillOpacity="0.5" />
        <rect x="10" y="112" width="44" height="4" rx="1.5" fill="#8091a7" />
        <rect x="10" y="122" width="36" height="4" rx="1.5" fill="#8091a7" />
        <rect x="10" y="132" width="40" height="4" rx="1.5" fill="#8091a7" />
        {/* Top header */}
        <rect x="70" y="0" width="210" height="22" fill="white" />
        <rect x="70" y="20" width="210" height="1" fill="#e5e9f0" />
        <rect x="76" y="6" width="80" height="10" rx="2" fill="#1a1f36" />
        <rect x="232" y="4" width="40" height="14" rx="7" fill="#f5f6fa" />
        {/* Main content */}
        <rect x="78" y="30" width="80" height="8" rx="2" fill="#1a1f36" />
        <rect x="78" y="42" width="120" height="4" rx="1.5" fill="#8091a7" />
        {/* 4 feature cards 2x2 */}
        <rect x="78" y="54" width="92" height="48" rx="4" fill="white" />
        <rect x="84" y="60" width="28" height="20" rx="3" fill="#6576ff" fillOpacity="0.1" />
        <rect x="86" y="66" width="20" height="8" rx="2" fill="#6576ff" fillOpacity="0.5" />
        <rect x="84" y="84" width="52" height="4" rx="1.5" fill="#1a1f36" />
        <rect x="84" y="92" width="72" height="3" rx="1.5" fill="#8091a7" />
        <rect x="178" y="54" width="92" height="48" rx="4" fill="white" />
        <rect x="184" y="60" width="28" height="20" rx="3" fill="#e85347" fillOpacity="0.1" />
        <rect x="186" y="66" width="20" height="8" rx="2" fill="#e85347" fillOpacity="0.5" />
        <rect x="184" y="84" width="52" height="4" rx="1.5" fill="#1a1f36" />
        <rect x="184" y="92" width="72" height="3" rx="1.5" fill="#8091a7" />
        <rect x="78" y="108" width="92" height="48" rx="4" fill="white" />
        <rect x="84" y="114" width="28" height="20" rx="3" fill="#6576ff" fillOpacity="0.1" />
        <rect x="86" y="120" width="20" height="8" rx="2" fill="#6576ff" fillOpacity="0.5" />
        <rect x="84" y="138" width="52" height="4" rx="1.5" fill="#1a1f36" />
        <rect x="84" y="146" width="72" height="3" rx="1.5" fill="#8091a7" />
        <rect x="178" y="108" width="92" height="48" rx="4" fill="white" />
        <rect x="184" y="114" width="28" height="20" rx="3" fill="#1ee0ac" fillOpacity="0.1" />
        <rect x="186" y="120" width="20" height="8" rx="2" fill="#1ee0ac" fillOpacity="0.5" />
        <rect x="184" y="138" width="52" height="4" rx="1.5" fill="#1a1f36" />
        <rect x="184" y="146" width="72" height="3" rx="1.5" fill="#8091a7" />
      </svg>
    ),
  },
];

const Login = () => {
  const [loading, setLoading] = useState(false);
  const [passState, setPassState] = useState(false);
  const [errorVal, setError] = useState("");
  const [selectedTemplate, setSelectedTemplate] = useState("crypto");
  const [activeSlide, setActiveSlide] = useState(0);
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const onFormSubmit = async (formData) => {
    setLoading(true);
    setError("");
    try {
      await login({ email: formData.email, password: formData.password });
      navigate(location.state?.from?.pathname || "/", { replace: true });
    } catch (error) {
      setError(error instanceof Error ? error.message : "Unable to sign in.");
    } finally {
      setLoading(false);
    }
  };

  const { register, handleSubmit, formState: { errors } } = useForm();

  return (
    <>
      <Head title="Login" />
      <div className="min-h-screen flex bg-white">
        {/* ── LEFT PANEL ── */}
        <div className="w-full lg:w-5/12 xl:w-2/5 flex flex-col justify-between px-8 sm:px-14 py-10">
          {/* Logo */}
          <div>
            <Link to="/" className="inline-flex items-center gap-2 mb-10">
              <img className="h-8 block dark:hidden" src={Logo} alt="logo" />
              <img className="h-8 hidden dark:block" src={LogoDark} alt="logo-dark" />
            </Link>

            {/* Form card */}
            <div className="max-w-sm">
              <h4 className="text-2xl font-bold text-gray-900 mb-1">Sign-In</h4>
              <p className="text-sm text-gray-500 mb-7">Access your salon administration account.</p>

              {errorVal && (
                <div className="mb-4 flex items-center gap-2 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-3">
                  <Icon name="alert-circle" className="text-base shrink-0" />
                  {errorVal}
                </div>
              )}

              <form onSubmit={handleSubmit(onFormSubmit)} noValidate className="space-y-5">
                {/* Email */}
                <div>
                  <div className="flex justify-between items-center mb-1.5">
                    <label htmlFor="default-01" className="block text-sm font-medium text-gray-700">
                      Email
                    </label>
                    <Link
                      to="/support/public"
                      className="text-xs text-indigo-500 hover:text-indigo-600 font-medium"
                    >
                      Need Help?
                    </Link>
                  </div>
                  <input
                    type="email"
                    id="default-01"
                    autoComplete="email"
                    disabled={loading}
                    {...register("email", {
                      required: "Email is required",
                      pattern: {
                        value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                        message: "Enter a valid email address",
                      },
                    })}
                    placeholder="Enter your email address or username"
                    className="w-full px-4 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-400 transition"
                  />
                  {errors.email && (
                    <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>
                  )}
                </div>

                {/* Password */}
                <div>
                  <div className="flex justify-between items-center mb-1.5">
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                      Passcode
                    </label>
                    <Link
                      to="/auth-reset"
                      className="text-xs text-indigo-500 hover:text-indigo-600 font-medium"
                    >
                      Forgot Code?
                    </Link>
                  </div>
                  <div className="relative">
                    <input
                      type={passState ? "text" : "password"}
                      id="password"
                      autoComplete="current-password"
                      disabled={loading}
                      {...register("password", {
                        required: "Password is required",
                        minLength: { value: 6, message: "Password must be at least 6 characters" },
                      })}
                      placeholder="Enter your passcode"
                      className="w-full px-4 py-2.5 pr-10 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-400 transition"
                    />
                    <button
                      type="button"
                      onClick={() => setPassState(!passState)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      <Icon name={passState ? "eye-off" : "eye"} className="text-base" />
                    </button>
                  </div>
                  {errors.password && (
                    <p className="mt-1 text-xs text-red-500">{errors.password.message}</p>
                  )}
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-indigo-500 hover:bg-indigo-600 text-white text-sm font-semibold rounded-lg transition disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {loading ? <Spinner size="sm" color="light" /> : "Sign in"}
                </button>
              </form>

              <p className="mt-5 text-sm text-center text-gray-500">
                New on our platform?{" "}
                <Link to="/auth-register" className="text-indigo-500 hover:underline font-medium">
                  Create an account
                </Link>
              </p>
              <p className="mt-2 text-sm text-center text-gray-500">
                Unable to sign in?{" "}
                <Link to="/support/public" className="text-indigo-500 hover:underline font-medium">
                  Contact support
                </Link>
              </p>

              {/* OR divider */}



            </div>
          </div>

          {/* Footer */}
          <div className="mt-10">
            <ul className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-400">
              <li>
                <a href="#terms" className="hover:text-indigo-500 transition">Terms &amp; Condition</a>
              </li>
              <li>
                <a href="#privacy" className="hover:text-indigo-500 transition">Privacy Policy</a>
              </li>
              <li>
                <a href="#help" className="hover:text-indigo-500 transition">Help</a>
              </li>
              <li>
                <button className="hover:text-indigo-500 transition flex items-center gap-1">
                  English <Icon name="chevron-down" className="text-xs" />
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* ── RIGHT PANEL ── */}
        <div className="hidden lg:flex lg:w-7/12 xl:w-3/5 bg-gray-50 flex-col items-center justify-center px-10 xl:px-16 py-12 relative overflow-hidden">
          {/* Decorative blobs */}
          <div className="absolute top-8 right-10 w-32 h-32 rounded-full border-[16px] border-indigo-200/50 pointer-events-none" />
          <div className="absolute bottom-16 left-8 w-16 h-0.5 bg-indigo-300/40 rotate-45 pointer-events-none" />
          <div className="absolute bottom-10 left-16 text-indigo-300/40 text-2xl pointer-events-none select-none">✦</div>

          {/* Active template large preview */}
          <div className="w-full max-w-xl mb-8 rounded-xl overflow-hidden shadow-2xl ring-1 ring-black/5 bg-white">
            <div className="aspect-[16/10]">
              {DashboardTemplates.find((t) => t.id === selectedTemplate)?.preview}
            </div>
          </div>

          {/* Headline */}
          <div className="text-center mb-8">
            <h5 className="text-xl font-bold text-gray-900 mb-1">Dashlite</h5>
            <p className="text-sm text-gray-500 max-w-xs mx-auto leading-relaxed">
              You can start to create your products easily with its user-friendly design &amp; most completed responsive layout.
            </p>
          </div>

          {/* Template selector thumbnails */}
          <div className="flex items-center gap-4">
            {DashboardTemplates.map((tpl, idx) => (
              <button
                key={tpl.id}
                onClick={() => { setSelectedTemplate(tpl.id); setActiveSlide(idx); }}
                className={`group relative rounded-lg overflow-hidden border-2 transition-all ${selectedTemplate === tpl.id
                  ? "border-indigo-500 shadow-lg shadow-indigo-200 scale-105"
                  : "border-transparent hover:border-indigo-300 hover:shadow-md opacity-70 hover:opacity-100"
                  }`}
                style={{ width: 88, height: 56 }}
                title={tpl.label}
              >
                {tpl.preview}
                {selectedTemplate === tpl.id && (
                  <div className="absolute inset-0 ring-2 ring-indigo-500 rounded-lg pointer-events-none" />
                )}
              </button>
            ))}
          </div>

          {/* Dot indicators */}
          <div className="flex gap-2 mt-5">
            {DashboardTemplates.map((tpl, idx) => (
              <button
                key={tpl.id}
                onClick={() => { setSelectedTemplate(tpl.id); setActiveSlide(idx); }}
                className={`rounded-full transition-all ${selectedTemplate === tpl.id
                  ? "w-6 h-2.5 bg-indigo-500"
                  : "w-2.5 h-2.5 bg-gray-300 hover:bg-indigo-300"
                  }`}
              />
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;