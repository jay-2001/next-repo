/** @format */
"use client";

import { useState, useEffect } from "react";

interface Filter {
    label: string;
}

interface Influencer {
    name: string;
    country: string;
    platform: string[];
    language: string;
    followers: string;
    growth: string;
    topics: string[];
    niche: string;
}

const Dashboard: React.FC = () => {
    const [locationFilter, setLocationFilter] = useState<Filter[]>([]);
    const [followerFilter, setFollowerFilter] = useState<Filter[]>([]);
    const [categoryFilter, setCategoryFilter] = useState<Filter[]>([]);

    // Temporary options
    const followerOptions = [
        "0-1000",
        "1000-3000",
        "3000-5000",
        "5000-10000",
        "10000-50000",
        "50000-100000",
        "100000-500000",
        "500000-1M",
        ">1M",
    ];

    const categoryOptions = ["Tech", "Food", "Lifestyle", "Travel"];

    // Handling removal of filters
    const handleRemoveFilter = (label: string, type: string) => {
        if (type === "location") {
            setLocationFilter(locationFilter.filter(filter => filter.label !== label));
        } else if (type === "follower") {
            setFollowerFilter(followerFilter.filter(filter => filter.label !== label));
        } else if (type === "category") {
            setCategoryFilter(categoryFilter.filter(filter => filter.label !== label));
        }
    };

    // Handling selection of location
    const handleSelectLocation = (label: string) => {
        if (!locationFilter.some(filter => filter.label === label)) {
            setLocationFilter([...locationFilter, { label }]);
        }
    };

    // Handling selection of follower count
    const handleSelectFollower = (label: string) => {
        if (!followerFilter.some(filter => filter.label === label)) {
            setFollowerFilter([...followerFilter, { label }]);
        }
    };

    // Handling selection of category
    const handleSelectCategory = (label: string) => {
        if (!categoryFilter.some(filter => filter.label === label)) {
            setCategoryFilter([...categoryFilter, { label }]);
        }
    };

    // Location suggestions (dummy implementation)
    const [locationSuggestions, setLocationSuggestions] = useState<string[]>([]);
    const [locationInput, setLocationInput] = useState<string>("");

    useEffect(() => {
        if (locationInput) {
            // Call backend API to fetch location suggestions based on locationInput
            // For now, use dummy data
            setLocationSuggestions(["India", "Indonesia", "Indore"]);
        } else {
            setLocationSuggestions([]);
        }
    }, [locationInput]);

    const influencers: Influencer[] = [
        {
            name: 'krilovee',
            country: 'India',
            platform: ['Instagram'],
            language: 'English',
            followers: '1,260,000',
            growth: '2.44%',
            topics: ['Food', 'Lifestyle', 'Travel Guide'],
            niche: 'Shorts',
        },
        {
            name: 'Tech Logic in Telugu',
            country: 'India',
            platform: ['Instagram'],
            language: 'English',
            followers: '655,000',
            growth: '0.61%',
            topics: ['Apple', 'Technology Design', 'Gadget'],
            niche: 'Gadget',
        },
    ];

    return (
        <div className="p-8 bg-white text-gray-900">
            {/* Filters Card */}
            <div className="flex flex-col p-6 bg-white rounded-lg shadow-lg mb-6 shadow-all-sides">
                <div className="flex space-x-4 mb-4">
                    {/* Location Input */}
                    <div className="relative flex-grow">
                        <input
                            type="text"
                            value={locationInput}
                            onChange={(e) => setLocationInput(e.target.value)}
                            placeholder="Enter location"
                            className="w-full p-2 rounded-md bg-gray-200 border border-gray-300"
                        />
                        {locationSuggestions.length > 0 && (
                            <div className="absolute top-full left-0 right-0 bg-white border border-gray-300 mt-1 rounded-md">
                                {locationSuggestions.map((suggestion, index) => (
                                    <div
                                        key={index}
                                        className="p-2 cursor-pointer hover:bg-gray-100"
                                        onClick={() => {
                                            handleSelectLocation(suggestion);
                                            setLocationInput("");
                                        }}
                                    >
                                        {suggestion}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Follower Count Dropdown */}
                    <select
                        className="w-40 p-2 rounded-md bg-gray-200 border border-gray-300"
                        onChange={(e) => handleSelectFollower(e.target.value)}
                        defaultValue=""
                    >
                        <option value="" disabled>Follower Count</option>
                        {followerOptions.map((option, index) => (
                            <option key={index} value={option}>{option}</option>
                        ))}
                    </select>

                    {/* Category Dropdown */}
                    <select
                        className="w-40 p-2 rounded-md bg-gray-200 border border-gray-300"
                        onChange={(e) => handleSelectCategory(e.target.value)}
                        defaultValue=""
                    >
                        <option value="" disabled>Category</option>
                        {categoryOptions.map((option, index) => (
                            <option key={index} value={option}>{option}</option>
                        ))}
                    </select>
                </div>

                {/* Selected Filters */}
                <div className="flex flex-wrap space-x-2 mb-4">
                    {locationFilter.map((filter, index) => (
                        <div key={index} className="flex items-center space-x-2 bg-gray-200 py-1 px-3 rounded-md">
                            <span>{filter.label}</span>
                            <button onClick={() => handleRemoveFilter(filter.label, "location")} className="text-gray-600">✕</button>
                        </div>
                    ))}
                    {followerFilter.map((filter, index) => (
                        <div key={index} className="flex items-center space-x-2 bg-gray-200 py-1 px-3 rounded-md">
                            <span>{filter.label}</span>
                            <button onClick={() => handleRemoveFilter(filter.label, "follower")} className="text-gray-600">✕</button>
                        </div>
                    ))}
                    {categoryFilter.map((filter, index) => (
                        <div key={index} className="flex items-center space-x-2 bg-gray-200 py-1 px-3 rounded-md">
                            <span>{filter.label}</span>
                            <button onClick={() => handleRemoveFilter(filter.label, "category")} className="text-gray-600">✕</button>
                        </div>
                    ))}
                </div>

                {/* Profile Count and Search inside Filters Card */}
                <div className="flex justify-between items-center">
                    <span className="text-gray-600">228,814 users with profiles</span>
                    <button className="py-2 px-4 rounded-md bg-gray-800 text-white">Search</button>
                </div>
            </div>

            {/* Influencers List */}
            <div className="space-y-4">
                {influencers.map((influencer, index) => (
                    <div key={index} className="p-4 bg-white rounded-lg shadow-all-sides flex justify-between items-center">
                        <div>
                            <div className="text-xl font-bold">{influencer.name}</div>
                            <div className="text-sm text-gray-600">{influencer.country}</div>
                        </div>
                        <div>
                            <div className="text-right">{influencer.followers} followers</div>
                            <div className="text-green-500">{influencer.growth} growth</div>
                        </div>
                        <div className="flex space-x-2">
                            {influencer.topics.map((topic, idx) => (
                                <span key={idx} className="bg-gray-300 py-1 px-2 rounded-md text-sm">{topic}</span>
                            ))}
                        </div>
                        <div className="text-sm text-gray-600">{influencer.niche}</div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Dashboard;
