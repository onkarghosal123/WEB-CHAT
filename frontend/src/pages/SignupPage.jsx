import { useContext, useState } from "react"
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext"
import BorderAnimatedContainer from "../components/BorderAnimatedContainer"
import { MessageCircleIcon, UserIcon, MailIcon, LockIcon, LoaderIcon } from "lucide-react"
import { Link } from "react-router-dom"

function SignupPage() {
    const navigate = useNavigate();
    const { isSigningUp, setIsSigningUp, signup } = useContext(AuthContext)
    const [formData, setFormData] = useState({ fullName: "", email: "", password: "" })
    const handleSubmit = async (e) => {
        e.preventDefault();
        const success = await signup(formData);
        console.log("success:", success)
        if (success) {
            navigate("/login");
            console.log("navigated login")
        }
        console.log("success:", success)

    }

    return (
        <>
            <div className="w-full min-h-screen bg-gradient-to-br from-[#111827] via-[#1e1b4b] to-[#4c1d95] flex items-center justify-center p-4">
                <div className="w-full max-w-6xl">

                    {/* LOGIN CARD */}
                    <div className="w-full bg-slate-900/95 border border-white/20 rounded-3xl shadow-2xl p-8">

                        <div className="flex flex-col md:flex-row gap-8">

                            {/* FORM CLOUMN - LEFT SIDE */}
                            <div className="md:w-1/2 p-4 flex items-center justify-center md:border-r border-white/20">
                                <div className="w-full max-w-md">

                                    {/* HEADING TEXT */}
                                    <div className="text-center mb-8">
                                        <MessageCircleIcon className="w-12 h-12 mx-auto text-white mb-4" />

                                        <h2 className="text-2xl font-bold text-white mb-2">
                                            Create Account
                                        </h2>

                                        <p className="text-blue-100">
                                            Sign up for a new account
                                        </p>
                                    </div>

                                    {/* FORM */}
                                    <form onSubmit={handleSubmit} className="space-y-5">

                                        {/* FULL NAME */}
                                        <div>
                                            <label className="block text-sm text-blue-100 mb-2">
                                                Full Name
                                            </label>

                                            <div className="relative">
                                                <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-blue-100" />

                                                <input
                                                    type="text"
                                                    value={formData.fullName}
                                                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                                                    className="w-full h-12 pl-12 pr-4 rounded-xl bg-white/10 border border-white/30 text-white placeholder-blue-100/70 outline-none focus:border-white focus:bg-white/15 transition"
                                                    placeholder="Full Name"
                                                />
                                            </div>
                                        </div>

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
                                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
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
                                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                                    className="w-full h-12 pl-12 pr-4 rounded-xl bg-white/10 border border-white/30 text-white placeholder-blue-100/70 outline-none focus:border-white focus:bg-white/15 transition"
                                                    placeholder="Enter your password"
                                                />
                                            </div>
                                        </div>

                                        {/* SUBMIT BUTTON */}
                                        <button
                                            className="w-full h-12 rounded-xl bg-white text-blue-600 font-semibold hover:bg-blue-50 transition shadow-lg cursor-pointer"
                                            type="submit"
                                            disabled={isSigningUp}
                                        >
                                            {isSigningUp ? (
                                                <LoaderIcon className="w-full h-5 animate-spin text-center" />
                                            ) : (
                                                "Create Account"
                                            )}
                                        </button>
                                    </form>

                                    <div className="mt-6 text-center">
                                        <Link
                                            to="/login"
                                            className="text-sm text-blue-100 hover:text-white transition"
                                        >
                                            Already have an account? Login
                                        </Link>
                                    </div>

                                </div>
                            </div>

                            <div className="hidden md:w-1/2 md:flex items-center justify-center p-6">
                                <div className="text-center">

                                    {/* CHAT ICON */}
                                    <div className="flex justify-center mb-5">
                                        <div className="w-28 h-28 rounded-full bg-white/10 border-4 border-white/30 flex items-center justify-center shadow-lg">
                                            <MessageCircleIcon className="w-15 h-15 text-white" />
                                        </div>
                                    </div>

                                    {/* WEB-CHAT */}
                                    <h2 className="text-3xl font-bold text-white mb-3">
                                        WEB-CHAT
                                    </h2>

                                    <p className="text-blue-100 text-base">
                                        Connect and chat with your friends anytime
                                    </p>



                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
export default SignupPage;