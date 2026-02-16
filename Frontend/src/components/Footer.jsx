import { Github, Linkedin, Mail, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Footer() {
    return (
        <footer className="bg-black text-white pt-16 pb-8 border-t border-gray-800">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
                    <div className="col-span-1 md:col-span-1">
                        <div className="flex items-center gap-2 mb-4">
                            <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
                                STREAK
                            </span>
                        </div>
                        <p className="text-gray-400 text-sm leading-relaxed mb-6">
                            Master competitive programming with consistency. Join thousands of developers building their streak today.
                        </p>
                        <div className="flex gap-4">
                            <a
                                href="https://github.com/devel-maverick"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-gray-400 hover:text-white transition-colors"
                            >
                                <Github size={20} />
                            </a>
                            <a
                                href="https://www.linkedin.com/in/vinay-sharma-500596377/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-gray-400 hover:text-white transition-colors"
                            >
                                <Linkedin size={20} />
                            </a>
                        </div>
                    </div>
                    <div>
                        <h3 className="text-sm font-semibold uppercase tracking-wider mb-4 text-gray-200">Platform</h3>
                        <ul className="space-y-3">
                            <li><Link to="/practice" className="text-gray-400 hover:text-white text-sm transition-colors">Practice</Link></li>
                            <li><Link to="/contest" className="text-gray-400 hover:text-white text-sm transition-colors">Contests</Link></li>
                            <li><Link to="/companies" className="text-gray-400 hover:text-white text-sm transition-colors">Companies</Link></li>
                            <li><Link to="/playground" className="text-gray-400 hover:text-white text-sm transition-colors">Playground</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-sm font-semibold uppercase tracking-wider mb-4 text-gray-200">Resources</h3>
                        <ul className="space-y-3">
                            <li><a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">Blog</a></li>
                            <li><a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">Community</a></li>
                            <li><a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">Privacy Policy</a></li>
                            <li><a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">Terms of Service</a></li>
                        </ul>
                    </div>


                </div>

                {/* Bottom Bar */}
                <div className="pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-gray-500 text-xs">
                        © {new Date().getFullYear()} Streak. All rights reserved.
                    </p>
                    <div className="flex items-center gap-1 text-gray-500 text-xs">
                        <span>Made with</span>
                        <Heart size={12} className="text-red-500 fill-red-500" />
                        <span>by CodeMaverick</span>
                    </div>
                </div>
            </div>
        </footer>
    );
}
