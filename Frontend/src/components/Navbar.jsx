import { useAuthStore } from "../store/useAuthStore";
import { Link } from "react-router-dom";
import { LogOut, User, Menu, X } from 'lucide-react';
import { useState } from 'react';
import SignIn from '../pages/SignIn';
import SignUp from '../pages/SignUp';
import { Cover } from "./ui/cover";
import { useUIStore } from "../store/useUIStore";

const navLinkClass = "relative text-gray-500 hover:text-black after:content-[''] after:absolute after:left-0 after:bottom-[-2px] after:w-full after:h-[1px] after:bg-black after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:duration-300 after:origin-left";

export default function Navbar() {
    const { user, logout } = useAuthStore();
    const {
        isSignInOpen, isSignUpOpen,
        openSignIn, openSignUp,
        closeSignIn, closeSignUp
    } = useUIStore();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    return (
        <>
            <nav className="w-full border-b-2 border-gray-200 relative">
                <div className="flex items-center justify-between px-4 sm:px-6 lg:px-25 py-3">
                    <div className="flex items-center space-x-1">
                        <img src="/logo1.png" alt="logo" className="w-10 h-10" />
                        <Link to="/"><Cover><h1 className="font-bold">STREAK</h1></Cover></Link>
                        </div>
                    <ul className="hidden lg:flex items-center space-x-10">
                        <li><Link to="/practice" className={navLinkClass}>Practice</Link></li>
                        <li><Link to="/contest" className={navLinkClass}>Contest</Link></li>
                        <li><Link to="/companies" className={navLinkClass}>Companies</Link></li>
                        <li><Link to="/playground" className={navLinkClass}>Playground</Link></li>
                        <li><Link to="/payment" className={navLinkClass}>Subscription</Link></li>
                    </ul>

                    <div className="hidden lg:flex items-center space-x-4">
                        {!user && (
                            <>
                                <button
                                    onClick={openSignIn}
                                    className="bg-white text-black px-4 py-2 rounded-md hover:bg-gray-200"
                                >
                                    Sign In
                                </button>
                                <button
                                    onClick={openSignUp}
                                    className="bg-black text-white px-4 py-2 rounded-md hover:bg-gray-600"
                                >
                                    Sign Up
                                </button>
                            </>
                        )}
                        {user && (
                            <>
                                <button><Link to="/profile"><User /></Link></button>
                                <button onClick={logout} className="bg-black text-white px-4 py-2 rounded-md hover:bg-gray-800 flex items-center gap-2"><LogOut size={18} /> Log Out</button>
                            </>
                        )}
                    </div>
                    <button
                        className="lg:hidden p-2 text-gray-600 hover:text-black"
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        aria-label="Toggle menu"
                    >
                        {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>

                {mobileMenuOpen && (
                    <div className="lg:hidden border-t border-gray-200 bg-white px-4 py-4 space-y-4">
                        <Link to="/practice" className="block text-gray-600 hover:text-black py-2" onClick={() => setMobileMenuOpen(false)}>Practice</Link>
                        <Link to="/contest" className="block text-gray-600 hover:text-black py-2" onClick={() => setMobileMenuOpen(false)}>Contest</Link>
                        <Link to="/companies" className="block text-gray-600 hover:text-black py-2" onClick={() => setMobileMenuOpen(false)}>Companies</Link>
                        <Link to="/playground" className="block text-gray-600 hover:text-black py-2" onClick={() => setMobileMenuOpen(false)}>Playground</Link>
                        <Link to="/payment" className="block text-gray-600 hover:text-black py-2" onClick={() => setMobileMenuOpen(false)}>Subscription</Link>
                        <div className="border-t border-gray-200 pt-4 flex flex-col gap-2">
                            {!user && (
                                <>
                                    <button onClick={() => { openSignIn(); setMobileMenuOpen(false); }} className="w-full bg-white text-black px-4 py-2 rounded-md border border-gray-300 hover:bg-gray-100">Sign In</button>
                                    <button onClick={() => { openSignUp(); setMobileMenuOpen(false); }} className="w-full bg-black text-white px-4 py-2 rounded-md hover:bg-gray-600">Sign Up</button>
                                </>
                            )}
                            {user && (
                                <>
                                    <Link to="/profile" className="flex items-center gap-2 text-gray-600 hover:text-black py-2" onClick={() => setMobileMenuOpen(false)}><User size={18} /> Profile</Link>
                                    <button onClick={() => { logout(); setMobileMenuOpen(false); }} className="w-full bg-black text-white px-4 py-2 rounded-md hover:bg-gray-800 flex items-center justify-center gap-2"><LogOut size={18} /> Log Out</button>
                                </>
                            )}
                        </div>
                    </div>
                )}
            </nav>
            {isSignInOpen && <SignIn onClose={closeSignIn} onSwitchToSignUp={openSignUp} />}
            {isSignUpOpen && <SignUp onClose={closeSignUp} onSwitchToSignIn={openSignIn} />}
        </>
    )
}