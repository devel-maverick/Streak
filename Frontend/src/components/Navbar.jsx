import { useAuthStore } from "../store/useAuthStore";
import { Link } from "react-router-dom";
import { LogOut, User } from 'lucide-react'

export default function Navbar() {
    const { user } = useAuthStore()
    return (
        <>
            <nav className="w-full border-b-2 border-gray-200">
                <div className="flex item-center justify-between px-25 py-3">
                    <div className="flex items-center space-x-1">
                        <img src="logo1.png" alt="logo" className="w-10 h-10" />
                        <Link to="/"><h1 className="text-2xl font-bold">STREAK</h1></Link>
                    </div>
                    <ul className="flex items-center space-x-10">
                        <li><Link to="/practice" className="relative text-gray-500 hover:text-black after:content-[''] after:absolute after:left-0 after:bottom-[-2px] after:w-full after:h-[1px] after:bg-black after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:duration-300 after:origin-left">Practice</Link></li>
                        <li><Link to="/contest" className="relative text-gray-500 hover:text-black after:content-[''] after:absolute after:left-0 after:bottom-[-2px] after:w-full after:h-[1px] after:bg-black after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:duration-300 after:origin-left">Contest</Link></li>
                        <li><Link to="/companies" className="relative text-gray-500 hover:text-black after:content-[''] after:absolute after:left-0 after:bottom-[-2px] after:w-full after:h-[1px] after:bg-black after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:duration-300 after:origin-left">Companies</Link></li>
                        <li><Link to="/playground" className="relative text-gray-500 hover:text-black after:content-[''] after:absolute after:left-0 after:bottom-[-2px] after:w-full after:h-[1px] after:bg-black after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:duration-300 after:origin-left">Playground</Link></li>
                        <li><Link to="/payment" className="relative text-gray-500 hover:text-black after:content-[''] after:absolute after:left-0 after:bottom-[-2px] after:w-full after:h-[1px] after:bg-black after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:duration-300 after:origin-left">Subscription</Link></li>
                    </ul>
                    <div className="flex items-center space-x-4">
                        {!user && (
                            <>
                                <button className="bg-black text-white px-4 py-2 rounded-md hover:bg-gray-800"><Link to="/signin">Sign In</Link></button>
                                <button className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600"><Link to="/signup">Sign Up</Link></button>
                            </>
                        )}
                        {user && (
                            <>
                                <button><Link to="/profile"><User /></Link></button>
                                <button className="bg-black text-white px-4 py-2 rounded-md hover:bg-gray-800"><Link to="/logout"><LogOut /> Log</Link></button>
                            </>
                        )}
                    </div>
                </div>
            </nav>
        </>
    )
}