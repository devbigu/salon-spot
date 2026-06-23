import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Logo from "@/images/logo.png";
import LogoDark from "@/images/logo-dark.png";
import Head from "@/layout/head/Head";
import { Icon } from "@/components/Component";
import { Spinner } from "reactstrap";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { useAuth } from "@/auth/AuthContext";

const DashboardTemplates = [
  {
    id: "crypto",
    label: "Crypto Dashboard",
    preview: (
      <svg viewBox="0 0 280 170" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
        <rect width="280" height="170" fill="#1a1f36" rx="6" />
        <rect x="0" y="0" width="56" height="170" fill="#141929" rx="6" />
        <rect x="8" y="12" width="40" height="8" rx="2" fill="#6576ff" />
        <rect x="10" y="30" width="36" height="5" rx="1.5" fill="#2d3561" />
        <rect x="10" y="42" width="28" height="4" rx="1.5" fill="#2d3561" />
        <rect x="10" y="54" width="32" height="4" rx="1.5" fill="#6576ff" fillOpacity="0.7" />
        <rect x="10" y="66" width="28" height="4" rx="1.5" fill="#2d3561" />
        <rect x="10" y="78" width="30" height="4" rx="1.5" fill="#2d3561" />
        <rect x="10" y="90" width="26" height="4" rx="1.5" fill="#2d3561" />
        <rect x="64" y="10" width="80" height="44" rx="4" fill="#6576ff" />
        <rect x="70" y="16" width="40" height="4" rx="1.5" fill="white" fillOpacity="0.6" />
        <rect x="70" y="26" width="60" height="7" rx="2" fill="white" />
        <rect x="70" y="38" width="30" height="4" rx="1.5" fill="white" fillOpacity="0.5" />
        <rect x="152" y="10" width="58" height="20" rx="3" fill="#232b4e" />
        <rect x="156" y="14" width="20" height="3" rx="1" fill="#6576ff" fillOpacity="0.7" />
        <rect x="156" y="20" width="30" height="4" rx="1" fill="white" fillOpacity="0.8" />
        <rect x="218" y="10" width="54" height="20" rx="3" fill="#232b4e" />
        <rect x="222" y="14" width="20" height="3" rx="1" fill="#6576ff" fillOpacity="0.7" />
        <rect x="222" y="20" width="28" height="4" rx="1" fill="white" fillOpacity="0.8" />
        <rect x="152" y="36" width="120" height="62" rx="3" fill="#1e2540" />
        <rect x="156" y="40" width="30" height="3" rx="1" fill="white" fillOpacity="0.5" />
        <polyline points="156,88 168,76 180,80 195,68 210,72 224,58 238,62 252,52 264,56" fill="none" stroke="#6576ff" strokeWidth="1.5" />
        <polyline points="156,92 168,85 180,88 195,80 210,83 224,72 238,76 252,68 264,72" fill="none" stroke="#09c2de" strokeWidth="1.5" />
        <polyline points="156,95 168,90 180,94 195,86 210,90 224,82 238,86 252,79 264,83" fill="none" stroke="#1ee0ac" strokeWidth="1.5" />
        <rect x="64" y="62" width="80" height="50" rx="3" fill="#1e2540" />
        <rect x="68" y="66" width="30" height="3" rx="1" fill="white" fillOpacity="0.5" />
        <rect x="68" y="74" width="56" height="4" rx="1.5" fill="#2d3965" />
        <rect x="68" y="82" width="50" height="4" rx="1.5" fill="#2d3965" />
        <rect x="68" y="90" width="56" height="4" rx="1.5" fill="#2d3965" />
        <rect x="68" y="98" width="48" height="4" rx="1.5" fill="#2d3965" />
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
        <rect width="280" height="170" fill="#f5f6fa" rx="6" />
        <rect x="0" y="0" width="280" height="28" fill="#1a1f36" rx="6" />
        <rect x="0" y="20" width="280" height="8" fill="#1a1f36" />
        <rect x="8" y="8" width="40" height="10" rx="2" fill="#6576ff" />
        <rect x="56" y="10" width="28" height="6" rx="1.5" fill="white" fillOpacity="0.6" />
        <rect x="92" y="10" width="22" height="6" rx="1.5" fill="white" fillOpacity="0.6" />
        <rect x="122" y="10" width="22" height="6" rx="1.5" fill="white" fillOpacity="0.6" />
        <rect x="152" y="10" width="22" height="6" rx="1.5" fill="white" fillOpacity="0.6" />
        <rect x="228" y="6" width="44" height="16" rx="8" fill="#2d3561" />
        <rect x="10" y="34" width="80" height="8" rx="2" fill="#1a1f36" />
        <rect x="10" y="46" width="50" height="5" rx="1.5" fill="#8091a7" />
        <rect x="170" y="32" width="100" height="30" rx="4" fill="white" />
        <rect x="176" y="38" width="50" height="4" rx="1.5" fill="#8091a7" />
        <rect x="176" y="46" width="70" height="5" rx="1.5" fill="#6576ff" />
        <rect x="10" y="60" width="82" height="36" rx="4" fill="#6576ff" />
        <rect x="16" y="66" width="40" height="3" rx="1" fill="white" fillOpacity="0.7" />
        <rect x="16" y="74" width="55" height="7" rx="2" fill="white" />
        <rect x="100" y="60" width="82" height="36" rx="4" fill="white" />
        <rect x="106" y="66" width="40" height="3" rx="1" fill="#8091a7" />
        <rect x="106" y="74" width="55" height="7" rx="2" fill="#1a1f36" />
        <rect x="190" y="60" width="82" height="36" rx="4" fill="white" />
        <rect x="196" y="66" width="40" height="3" rx="1" fill="#8091a7" />
        <rect x="196" y="74" width="55" height="7" rx="2" fill="#1a1f36" />
        <rect x="10" y="104" width="82" height="58" rx="4" fill="white" />
        <rect x="16" y="110" width="40" height="3" rx="1" fill="#8091a7" />
        <rect x="16" y="118" width="55" height="5" rx="1.5" fill="#1a1f36" />
        <rect x="16" y="128" width="30" height="3" rx="1" fill="#8091a7" />
        <rect x="16" y="135" width="55" height="4" rx="1.5" fill="#1a1f36" />
        <rect x="16" y="142" width="42" height="4" rx="1.5" fill="#1a1f36" />
        <rect x="100" y="104" width="82" height="58" rx="4" fill="white" />
        <rect x="106" y="110" width="40" height="3" rx="1" fill="#8091a7" />
        <rect x="106" y="118" width="55" height="5" rx="1.5" fill="#1a1f36" />
        <rect x="190" y="104" width="82" height="58" rx="4" fill="white" />
        <rect x="196" y="110" width="40" height="3" rx="1" fill="#8091a7" />
        <rect x="196" y="118" width="55" height="5" rx="1.5" fill="#1a1f36" />
      </svg>
    ),
  },
  {
    id: "account",
    label: "Account Dashboard",
    preview: (
      <svg viewBox="0 0 280 170" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
        <rect width="280" height="170" fill="#f5f6fa" rx="6" />
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
        <rect x="70" y="0" width="210" height="22" fill="white" />
        <rect x="70" y="20" width="210" height="1" fill="#e5e9f0" />
        <rect x="76" y="6" width="80" height="10" rx="2" fill="#1a1f36" />
        <rect x="232" y="4" width="40" height="14" rx="7" fill="#f5f6fa" />
        <rect x="78" y="30" width="80" height="8" rx="2" fill="#1a1f36" />
        <rect x="78" y="42" width="120" height="4" rx="1.5" fill="#8091a7" />
        <rect x="78" y="54" width="92" height="48" rx="4" fill="white" />
        <rect x="84" y="60" width="28" height="20" rx="3" fill="#6576ff" fillOpacity="0.1" />
        <rect x="86" y="66" width="20" height="8" rx="2" fill="#6576ff" fillOpacity="0.5" />
        <rect x="84" y="84" width="52" height="4" rx="1.5" fill="#1a1f36" />
        <rect x="84" y="92" width="72" height="3" rx="1.5" fill="#8091a7" />
        <rect x="178" y="54" width="92" height="48" rx="4" fill="white" />
        <rect x="184" y="60" width="28" height="20" rx="3" fill="#e85347" fillOpacity="0.1" />
        <rect x="186" y="66" width="20" height="8" rx="2" fill="#e85347" fillOpacity="0.5" />
        <rect x="184" y="84" width="52" height="4" rx="1.5" fill="#1a1f36" />
        <rect x="78" y="108" width="92" height="48" rx="4" fill="white" />
        <rect x="84" y="114" width="28" height="20" rx="3" fill="#6576ff" fillOpacity="0.1" />
        <rect x="86" y="120" width="20" height="8" rx="2" fill="#6576ff" fillOpacity="0.5" />
        <rect x="178" y="108" width="92" height="48" rx="4" fill="white" />
        <rect x="184" y="114" width="28" height="20" rx="3" fill="#1ee0ac" fillOpacity="0.1" />
        <rect x="186" y="120" width="20" height="8" rx="2" fill="#1ee0ac" fillOpacity="0.5" />
      </svg>
    ),
  },
];

const Register = () => {
  const [passState, setPassState] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorVal, setError] = useState("");
  const [selectedTemplate, setSelectedTemplate] = useState("crypto");
  const { register, handleSubmit, formState: { errors } } = useForm();
  const navigate = useNavigate();
  const { register: createAccount } = useAuth();

  const handleFormSubmit = async (formData) => {
    setLoading(true);
    setError("");
    try {
      await createAccount({
        name: formData.name,
        email: formData.email,
        phoneNumber: formData.phoneNumber,
        password: formData.password,
      });
      navigate("/", { replace: true });
    } catch (error) {
      setError(error instanceof Error ? error.message : "Unable to create the account.");
    } finally {
      setLoading(false);
    }
  };

  const inputCls = "w-full px-3.5 py-2.5 text-sm text-gray-800 bg-white border border-gray-200 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-400 transition";

  return (
    <>
      <Head title="Register" />

      {/* ── PAGE SHELL ── mobile scrolls, desktop locked */}
      <div className="min-h-screen lg:h-screen lg:overflow-hidden flex flex-col lg:flex-row bg-white">

        {/* ══ LEFT PANEL ══ */}
        <div className="w-full lg:w-5/12 xl:w-[42%] flex flex-col lg:h-full lg:overflow-y-auto bg-white">

          {/* Inner wrapper — centres content on mobile, top-aligns on desktop */}
          <div className="flex-1 flex flex-col justify-between px-5 sm:px-10 lg:px-10 xl:px-14 pt-8 pb-8">

            {/* Top section */}
            <div className="w-full max-w-[380px] mx-auto lg:mx-0">

              {/* Logo */}
              <Link to="/" className="inline-flex items-center gap-2 mb-8">
                <img className="h-8 block dark:hidden" src={Logo} alt="logo" />
                <img className="h-8 hidden dark:block" src={LogoDark} alt="logo-dark" />
              </Link>

              {/* Heading */}
              <div className="mb-6">
                <h4 className="text-[1.6rem] font-bold tracking-tight text-gray-900 leading-tight">Register</h4>
                <p className="mt-1 text-sm text-gray-500">Create a new salon SaaS administrator account.</p>
              </div>

              {/* Error banner */}
              {errorVal && (
                <div className="mb-5 flex items-start gap-2.5 text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
                  <Icon name="alert-circle" className="text-base shrink-0 mt-0.5" />
                  <span>{errorVal}</span>
                </div>
              )}

              {/* ── FORM ── */}
              <form onSubmit={handleSubmit(handleFormSubmit)} noValidate className="space-y-4">

                {/* Name */}
                <div className="space-y-1">
                  <label htmlFor="name" className="block text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Name
                  </label>
                  <input
                    type="text" id="name" autoComplete="name" disabled={loading}
                    {...register("name", { required: "Name is required", minLength: { value: 3, message: "At least 3 characters" } })}
                    placeholder="Enter your name"
                    className={inputCls}
                  />
                  {errors.name && <p className="text-xs text-red-500">{errors.name.message}</p>}
                </div>

                {/* Email */}
                <div className="space-y-1">
                  <label htmlFor="default-01" className="block text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Email
                  </label>
                  <input
                    type="email" id="default-01" autoComplete="email" disabled={loading}
                    {...register("email", {
                      required: "Email is required",
                      pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: "Enter a valid email address" },
                    })}
                    placeholder="Enter your email address"
                    className={inputCls}
                  />
                  {errors.email && <p className="text-xs text-red-500">{errors.email.message}</p>}
                </div>

                {/* Phone Number */}
                <div className="space-y-1">
                  <label htmlFor="phone-number" className="block text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Phone Number
                  </label>
                  <input
                    type="tel" id="phone-number" inputMode="numeric" autoComplete="tel" disabled={loading}
                    {...register("phoneNumber", {
                      required: "Phone number is required",
                      pattern: { value: /^\d{10}$/, message: "Enter a valid 10-digit phone number" },
                    })}
                    placeholder="Enter 10-digit phone number"
                    className={inputCls}
                  />
                  {errors.phoneNumber && <p className="text-xs text-red-500">{errors.phoneNumber.message}</p>}
                </div>

                {/* Passcode */}
                <div className="space-y-1">
                  <label htmlFor="password" className="block text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Passcode
                  </label>
                  <div className="relative">
                    <input
                      type={passState ? "text" : "password"} id="password" autoComplete="new-password" disabled={loading}
                      {...register("password", { required: "Password is required", minLength: { value: 6, message: "At least 6 characters" } })}
                      placeholder="Enter your passcode"
                      className={`${inputCls} pr-11`}
                    />
                    <button
                      type="button" onClick={() => setPassState(!passState)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 p-0.5 text-gray-400 hover:text-indigo-500 transition"
                    >
                      <Icon name={passState ? "eye-off" : "eye"} className="text-base" />
                    </button>
                  </div>
                  {errors.password && <p className="text-xs text-red-500">{errors.password.message}</p>}
                </div>

                {/* Terms */}
                <div className="space-y-1">
                  <label className="flex items-start gap-3 cursor-pointer group">
                    <input
                      type="checkbox" id="terms" disabled={loading}
                      {...register("terms", { required: "You must accept the terms and privacy policy" })}
                      className="mt-0.5 h-4 w-4 rounded border-gray-300 text-indigo-500 focus:ring-indigo-400 cursor-pointer shrink-0 accent-indigo-500"
                    />
                    <span className="text-sm text-gray-600 leading-snug">
                      I agree to the{" "}
                      <Link to="/pages/terms-policy" className="text-indigo-500 hover:text-indigo-600 underline underline-offset-2">
                        Terms and Privacy Policy
                      </Link>.
                    </span>
                  </label>
                  {errors.terms && <p className="text-xs text-red-500">{errors.terms.message}</p>}
                </div>

                {/* Submit */}
                <button
                  type="submit" disabled={loading}
                  className="w-full flex items-center justify-center gap-2 py-3 px-4 mt-1
                             bg-indigo-500 hover:bg-indigo-600 active:bg-indigo-700
                             text-white text-sm font-semibold rounded-xl shadow-sm shadow-indigo-200
                             transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {loading ? <Spinner size="sm" color="light" /> : "Register"}
                </button>
              </form>

              {/* Sign-in link */}
              <p className="mt-5 text-sm text-center text-gray-500">
                Already have an account?{" "}
                <Link to="/auth-login" className="text-indigo-500 hover:text-indigo-600 font-semibold">
                  Sign in instead
                </Link>
              </p>
            </div>

            {/* Footer */}
            <div className="mt-8 w-full max-w-[380px] mx-auto lg:mx-0">
              <div className="h-px bg-gray-100 mb-4" />
              <ul className="flex flex-wrap gap-x-5 gap-y-1.5 text-xs text-gray-400">
                <li><a href="#terms" className="hover:text-indigo-500 transition">Terms &amp; Condition</a></li>
                <li><a href="#privacy" className="hover:text-indigo-500 transition">Privacy Policy</a></li>
                <li><a href="#help" className="hover:text-indigo-500 transition">Help</a></li>
                <li>
                  <button className="flex items-center gap-1 hover:text-indigo-500 transition">
                    English <Icon name="chevron-down" className="text-xs" />
                  </button>
                </li>
              </ul>
            </div>

          </div>
        </div>

        {/* ══ RIGHT PANEL — desktop only ══ */}
        <div className="hidden lg:flex lg:w-7/12 xl:w-[58%] bg-slate-50
                        flex-col items-center justify-center
                        px-10 xl:px-16 py-8
                        lg:h-full relative overflow-hidden">

          {/* Decorative accents */}
          <div className="absolute top-6 right-8 w-36 h-36 rounded-full border-[18px] border-indigo-100 pointer-events-none" />
          <div className="absolute top-1/2 right-4 -translate-y-1/2 w-2 h-24 bg-indigo-100 rounded-full pointer-events-none" />
          <div className="absolute bottom-12 left-10 text-indigo-200 text-3xl pointer-events-none select-none leading-none">✦</div>
          <div className="absolute bottom-20 left-20 w-12 h-0.5 bg-indigo-200 rotate-45 pointer-events-none" />

          {/* Active template preview */}
          <div className="w-full max-w-[560px] mb-6 rounded-2xl overflow-hidden shadow-2xl shadow-indigo-100/60 ring-1 ring-black/5 bg-white">
            <div className="aspect-[16/10]">
              {DashboardTemplates.find((t) => t.id === selectedTemplate)?.preview}
            </div>
          </div>

          {/* Caption */}
          <div className="text-center mb-6">
            <h5 className="text-xl font-bold text-gray-900 mb-1.5">Dashlite</h5>
            <p className="text-sm text-gray-500 max-w-[280px] mx-auto leading-relaxed">
              You can start to create your products easily with its user-friendly design &amp; most completed responsive layout.
            </p>
          </div>

          {/* Template thumbnails */}
          <div className="flex items-center gap-3">
            {DashboardTemplates.map((tpl) => (
              <button
                key={tpl.id}
                onClick={() => setSelectedTemplate(tpl.id)}
                title={tpl.label}
                className={`relative rounded-xl overflow-hidden border-2 transition-all duration-200 ${selectedTemplate === tpl.id
                    ? "border-indigo-500 shadow-lg shadow-indigo-200/70 scale-105"
                    : "border-transparent opacity-60 hover:opacity-90 hover:border-indigo-300 hover:scale-105"
                  }`}
                style={{ width: 92, height: 58 }}
              >
                {tpl.preview}
              </button>
            ))}
          </div>

          {/* Pill indicators */}
          <div className="flex items-center gap-2 mt-5">
            {DashboardTemplates.map((tpl) => (
              <button
                key={tpl.id}
                onClick={() => setSelectedTemplate(tpl.id)}
                className={`rounded-full transition-all duration-200 ${selectedTemplate === tpl.id
                    ? "w-7 h-2.5 bg-indigo-500"
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

export default Register;