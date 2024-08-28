"use client";

import React, { useState } from 'react';
import Link from 'next/link';

const Header = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [suggestions, setSuggestions] = useState<string[]>([]);
    const [isLoggedIn, setIsLoggedIn] = useState(false); // Replace with actual auth logic

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
        // Fetch and set profile suggestions based on searchTerm
        // Example: setSuggestions(['Profile1', 'Profile2']);
    };

    return (
        <header className="fixed top-0 left-0 right-0 flex items-center justify-between p-4 bg-white shadow-md z-10">
            <div className="flex-grow flex items-center space-x-4">
                <div className="text-xl font-bold">Dashboard</div>
                <div className="flex-grow">
                    <input
                        type="text"
                        className="w-full p-2 border rounded-md"
                        placeholder="Search profiles..."
                        value={searchTerm}
                        onChange={handleSearchChange}
                    />
                    {suggestions.length > 0 && (
                        <ul className="absolute bg-white border rounded-md mt-1 w-full max-w-sm">
                            {suggestions.map((suggestion, index) => (
                                <li key={index} className="p-2 hover:bg-gray-200">
                                    {suggestion}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>
            <div>
                {isLoggedIn ? (
                    <div className="relative">
                        <button className="flex items-center space-x-2 focus:outline-none">
                            <span className="font-medium">Hrushi Patel</span>
                            <img src="/path/to/user-icon.jpg" alt="User" className="w-8 h-8 rounded-full" />
                        </button>
                        <div className="absolute right-0 mt-2 bg-white border rounded-md shadow-lg">
                            <Link href="/settings" className="block px-4 py-2 hover:bg-gray-100">
                                Settings
                            </Link>
                            <button className="block w-full text-left px-4 py-2 hover:bg-gray-100" onClick={() => setIsLoggedIn(false)}>
                                Log out
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="space-x-4">
                        <Link href="/login" className="text-blue-500 hover:underline">
                            Login
                        </Link>
                        <Link href="/signup" className="text-blue-500 hover:underline">
                            Sign Up
                        </Link>
                    </div>
                )}
            </div>
        </header>
    );
};

export default Header;
