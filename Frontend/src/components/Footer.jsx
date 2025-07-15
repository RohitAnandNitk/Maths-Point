import React from 'react';

export default function Footer() {
    return (
        <footer className="bg-gray-900 text-white">
            <div className="max-w-screen-xl mx-auto px-4 py-12">
                <div className="grid grid-cols-4 gap-8">
                    <div>
                        <h3 className="font-bold mb-4">EduAssess</h3>
                        <p className="text-gray-400 text-sm">
                            Empowering education through intelligent assessment solutions.
                        </p>
                    </div>
                    
                    <div>
                        <h4 className="font-semibold mb-4">Resources</h4>
                        <ul className="space-y-2">
                            <li><a href="/documentation" className="text-gray-400 hover:text-white">Documentation</a></li>
                            <li><a href="/help" className="text-gray-400 hover:text-white">Help Center</a></li>
                            <li><a href="/pricing" className="text-gray-400 hover:text-white">Pricing</a></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-semibold mb-4">Company</h4>
                        <ul className="space-y-2">
                            <li><a href="/about" className="text-gray-400 hover:text-white">About Us</a></li>
                            <li><a href="/careers" className="text-gray-400 hover:text-white">Careers</a></li>
                            <li><a href="/contact" className="text-gray-400 hover:text-white">Contact</a></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-semibold mb-4">Connect</h4>
                        <div className="flex space-x-4">
                            <a href="#" className="text-gray-400 hover:text-white">Twitter</a>
                            <a href="#" className="text-gray-400 hover:text-white">LinkedIn</a>
                            <a href="#" className="text-gray-400 hover:text-white">GitHub</a>
                        </div>
                    </div>
                </div>
                
                <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
                    <p>© 2024 EduAssess. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
}
