/** @format */
"use client";

import { useState } from "react";

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
    const [selectedFilters, setSelectedFilters] = useState<Filter[]>([{ label: 'Location: India' }]);

    const handleRemoveFilter = (label: string) => {
        setSelectedFilters(selectedFilters.filter(filter => filter.label !== label));
    };

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
            {/* Platform Selector */}
            <div className="flex space-x-4 mb-6">
                <button className="py-2 px-4 rounded-md text-white bg-gray-800">Instagram</button>
            </div>

            {/* Filters Row */}
            <div className="flex space-x-4 mb-6">
                <select className="p-2 rounded-md bg-gray-200 border border-gray-300">
                    <option>Country</option>
                    <option>India</option>
                    <option>USA</option>
                </select>
                <select className="p-2 rounded-md bg-gray-200 border border-gray-300">
                    <option>State</option>
                    <option>Karnataka</option>
                    <option>California</option>
                </select>
                <select className="p-2 rounded-md bg-gray-200 border border-gray-300">
                    <option>City</option>
                    <option>Bangalore</option>
                    <option>San Francisco</option>
                </select>
                <select className="p-2 rounded-md bg-gray-200 border border-gray-300">
                    <option>Category</option>
                    <option>Tech</option>
                    <option>Food</option>
                </select>
            </div>

            {/* Selected Filters */}
            <div className="flex space-x-2 mb-6">
                {selectedFilters.map((filter, index) => (
                    <div key={index} className="flex items-center space-x-2 bg-gray-200 py-1 px-3 rounded-md">
                        <span>{filter.label}</span>
                        <button onClick={() => handleRemoveFilter(filter.label)} className="text-gray-600">✕</button>
                    </div>
                ))}
            </div>

            {/* Profile Count and Search */}
            <div className="flex justify-between items-center mb-6">
                <span className="text-gray-600">228,814 users with profiles</span>
                <button className="py-2 px-4 rounded-md bg-gray-800 text-white">Search</button>
            </div>

            {/* Influencers List */}
            <div className="space-y-4">
                {influencers.map((influencer, index) => (
                    <div key={index} className="p-4 bg-gray-100 rounded-md flex justify-between items-center">
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
