import { useContext, useState } from "react";
import BorderAnimatedContainer from "../components/BorderAnimatedContainer";
import { MessageCircleIcon, MailIcon, LoaderIcon, LockIcon } from "lucide-react";
import OTPInput from "react-otp-input"
import { Link } from "react-router";
import { AuthContext } from "../contexts/AuthContext";
import toast from "react-hot-toast";

function LoginPage() {
  console.log("this is login page")
  const { isLoggingIn, setIsLoggingIn, login, sendOtp, isOtpsent, setIsOtpsent, otpSending } = useContext(AuthContext)
  const [formData, setFormData] = useState({ email: "", password: "" })
  const [otpInput, setOtpinput] = useState(null)
  const handleOtp = async (e) => {
    e.preventDefault();
    await sendOtp(formData);
  }
  const handleSubmit = async (e) => {
    e.preventDefault();
    await login({
      email: formData.email,
      otp: Number(otpInput)
    });
    setOtpinput(null);
    setIsOtpsent(null)
    setFormData({ email: "", password: "" });
  }


  return (
<>
    <div className="h-screen w-full flex items-center justify-center p-4 overflow-hidden">
      <div className="w-full max-w-2xl">
        {/* LOGIN CARD */}
        <div className="w-full bg-slate-900/95 border border-white/20 rounded-3xl shadow-2xl p-8">

          {/* ICON */}
          <div className="flex justify-center mb-5">
            <div className="w-20 h-20 rounded-full bg-white/20 border-4 border-white/40 flex items-center justify-center shadow-lg">
              <MessageCircleIcon className="w-10 h-10 text-white" />
            </div>
          </div>

          {/* HEADING TEXT */}
          <div className="text-center mb-7">
            <h2 className="text-2xl font-bold text-white mb-2">
              Welcome to WEB-CHAT
            </h2>

            <p className="text-blue-100 text-sm">
              Login to access your account
            </p>
          </div>

          {/* FORM */}
          <form onSubmit={handleSubmit} className="space-y-5">

            {/* EMAIL INPUT */}
            <div>
              <label className="block text-sm text-blue-100 mb-2">
                Email
              </label>

              <div className="relative">
                <MailIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-blue-100" />

                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      email: e.target.value
                    })
                  }
                  className="w-full h-12 pl-12 pr-4 rounded-xl bg-white/10 border border-white/30 text-white placeholder-blue-100/70 outline-none focus:border-white focus:bg-white/15 transition"
                  placeholder="Email@id.com"
                />
              </div>
            </div>

            {/* PASSWORD INPUT */}
            <div>
              <label className="block text-sm text-blue-100 mb-2">
                Password
              </label>

              <div className="relative">
                <LockIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-blue-100" />

                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      password: e.target.value
                    })
                  }
                  className="w-full h-12 pl-12 pr-4 rounded-xl bg-white/10 border border-white/30 text-white placeholder-blue-100/70 outline-none focus:border-white focus:bg-white/15 transition"
                  placeholder="Enter your password"
                />
              </div>
            </div>

            {!isOtpsent ? (
              // send otp btn
              <button
                type="button"
                className="w-full h-12 rounded-xl bg-white text-blue-600 font-semibold hover:bg-blue-50 transition shadow-lg cursor-pointer"
                onClick={handleOtp}
              >
                {otpSending ? (
                  <LoaderIcon className="w-full h-5 animate-spin text-center" />
                ) : (
                  "Send Otp"
                )}
              </button>
            ) : (
              <>
                <p className="text-center text-sm text-blue-100">
                  OTP sent to your email
                </p>

                <div className="text-center">
                  <button
                    type="button"
                    onClick={handleOtp}
                    className="text-sm text-white underline hover:text-blue-100"
                  >
                    Resend Otp
                  </button>
                </div>

                <div className="flex justify-center w-full">
                  <OTPInput
                    value={otpInput}
                    onChange={setOtpinput}
                    numInputs={6}
                    renderInput={(props) => (
                      <input
                        {...props}
                        style={{
                          width: "48px",
                          height: "48px",
                          flexShrink: 0,
                        }}
                        className="mx-1 rounded-lg bg-white/10 border border-white/30 text-white text-center outline-none focus:border-white"
                      />
                    )}
                  />
                </div>

                {/* SUBMIT BUTTON */}
                <button
                  className="w-full h-12 rounded-xl bg-white text-blue-600 font-semibold hover:bg-blue-50 transition shadow-lg cursor-pointer"
                  type="submit"
                  disabled={isLoggingIn}
                >
                  {/* //if button type="submit" then if enter then onSubmit in form will work.
              //if button type="button" then if enter then onSubmit in form will not work then we have to write onClick and after clicking on the button it will work. */}
                  {isLoggingIn ? (
                    <LoaderIcon className="w-full h-5 animate-spin text-center" />
                  ) : (
                    "verify otp & Login"
                  )}
                </button>
              </>
            )}
          </form>

          {/* SIGNUP LINK */}
          <div className="mt-6 text-center">
            <Link
              to="/signup"
              onClick={() => {
                if (isOtpsent) setIsOtpsent(false)
              }}
              className="text-sm text-blue-100 hover:text-white transition"
            >
              Don't have an account? Sign Up
            </Link>
          </div>

        </div>
      </div>
    </div>
</>
  );
}
export default LoginPage;
