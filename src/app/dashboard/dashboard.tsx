"use client";

import { useState, useEffect, useRef } from "react";
import LoadingOverlay from "../loading/loadingoverlay";
import InfluencersList from "../InfluncerList/InfluncerList";

interface Filter {
  label: string;
}

interface Influencer {
  fullName: string;
  username: string;
  profilePicId: string;
  totalFollowerCount: string;
  categories: string[];
}

const Dashboard: React.FC = () => {
  const [locationFilter, setLocationFilter] = useState<Filter[]>([]);
  const [followerFilter, setFollowerFilter] = useState<Filter[]>([]);
  const [categoryFilter, setCategoryFilter] = useState<Filter[]>([]);
  const [loading, setLoading] = useState(false);

  const [influencers, setInfluencers] = useState<Influencer[]>([]);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [currentPage, setCurrentPage] = useState<number>(0);

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

  const categoryOptions = [
    "Fashion", 
    "Beauty", 
    "Health", 
    "Food", 
    "Travel", 
    "Lifestyle", 
    "Automotive", 
    "Art and Design", 
    "Education", 
    "Pets", 
    "Home Decor"
  ];

  const [locationSuggestions, setLocationSuggestions] = useState<string[]>([]);
  const [locationInput, setLocationInput] = useState<string>("");
  const [lastQuery, setLastQuery] = useState<string>("");
  const debounceTimer = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (locationInput.length >= 1 && locationInput !== lastQuery) {
      // Clear any existing debounce timer
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }

      // Set a new debounce timer
      debounceTimer.current = setTimeout(() => {
        fetchLocationSuggestions(locationInput);
      }, 1000); // 1-second delay

      // Save the current input as the last query to avoid duplicate calls
      setLastQuery(locationInput);
    }
  }, [locationInput]);

  const fetchLocationSuggestions = async (pattern: string) => {
    try {
      const response = await fetch(`http://localhost:8080/api/locations/suggestions?pattern=${pattern}&size=10&page=0`, {
        method: 'GET',
        credentials: 'include', // Ensure credentials are included
        headers: {
          'Content-Type': 'application/json',
        }
      });
      if (response.ok) {
        const data = await response.json();
        setLocationSuggestions(data.content);
      } else {
        console.error("Error fetching location suggestions");
      }
    } catch (error) {
      console.error("Error fetching location suggestions", error);
    }
  };

  const handleInputChange = (value: string) => {
    setLocationInput(value);

    if (value.length < 1) {
      // Clear suggestions if input is shorter than 3 characters
      setLocationSuggestions([]);
    }
  };

  const handleBlur = () => {
    setTimeout(() => setLocationSuggestions([]), 200); // Small delay to allow click event to register
  };

  const parseLocation = (location: string) => {
    const parts = location.split(", ");
    const first = parts.length > 0 ? parts[0].split(": ")[1] : "";
    const sec = parts.length > 1 ? parts[1].split(": ")[1] : "";
    const third = parts.length > 2 ? parts[2].split(": ")[1] : "";
    if (third.length) return `${first}, ${sec}, ${third}`;
    if (sec.length) return `${first}, ${sec}`;
    return first;
  };

  // Other handlers...
  const handleSelectLocation = (label: string) => {
    setLocationFilter([{label}]);
    setLocationInput("");
    setLocationSuggestions([]);
  };

  // Handling removal of filters
  const handleRemoveFilter = (label: string, type: string) => {
    if (type === "location") {
      setLocationFilter(locationFilter.filter((filter) => filter.label !== label));
    } else if (type === "follower") {
      setFollowerFilter(followerFilter.filter((filter) => filter.label !== label));
    } else if (type === "category") {
      setCategoryFilter(categoryFilter.filter((filter) => filter.label !== label));
    }
  };

  // Handling selection of follower count
  const handleSelectFollower = (label: string) => {
    setFollowerFilter([{label}]);
  };

  // Handling selection of category
  const handleSelectCategory = (label: string) => {
    if (!categoryFilter.some((filter) => filter.label === label)) {
      setCategoryFilter([...categoryFilter, { label }]);
    }
  };

  const handleSearch = async (page: number = 0, retryCount: number = 2) => {
    setLoading(true);
    try{
      setCurrentPage(page);

      // Build query parameters
      let queryParams = `page=${page}&size=10`;
      if (locationFilter.length > 0) {
        const locationToSearch = locationFilter[0].label.split(",");
        if(locationToSearch.length == 3)
        {
          queryParams+="&city="+locationToSearch[0].toString().trimStart();
          queryParams+="&state="+locationToSearch[1].toString().trimStart();
          queryParams+="&country="+locationToSearch[2].toString().trimStart();
        }
        else if(locationToSearch.length == 2)
        {
          queryParams+="&state="+locationToSearch[0].toString().trimStart();
          queryParams+="&country="+locationToSearch[1].toString().trimStart();
        }
        else if(locationToSearch.length == 1)
        {
          queryParams+="&country="+locationToSearch[0].toString().trimStart();
        }
      }
      
      if (followerFilter.length > 0) {
        const [minFollowers, maxFollowers] = followerFilter[0].label.split("-").map((v) => v.replace(">", ""));
        queryParams+="&minFollowers="+minFollowers;
        if (maxFollowers) {
          queryParams+="&maxFollowers="+maxFollowers;
        }
      }

      if (categoryFilter.length > 0) {
        queryParams+="&categoryNames="+categoryFilter.map((filter) => filter.label).join(",");
      }
      queryParams+="&followerSort=true";
      try {
        const response = await fetch(`http://localhost:8080/api/instagram/get/influencer?${queryParams.toString()}`, {
          method: "GET",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        });
        if (response.ok) {
          const data = await response.json();
          setInfluencers(data.content);
          setTotalPages(data.totalPages);
        } else {
          console.error("Error fetching influencers");
          if(retryCount<=0)
          {
            return;
          }
          await new Promise(resolve => setTimeout(resolve, 15000));
          handleSearch(page, retryCount-1);
        }
      } catch (error) {
        console.error("Error fetching influencers", error);
      }
    }
    catch (error) {
      console.error('Error fetching influencers:', error);
    } finally {
      setLoading(false); // Hide loading overlay
    }
  };

  const handlePageClick = (pageNumber: number) => {
    console.log("called");
    handleSearch(pageNumber, 2);
  };

  const trimText = (text: string, maxLength: number = 16): string => {
    if (text.length > maxLength) {
      return text.substring(0, maxLength - 3) + "...";
    }
    return text;
  };

  const getVisiblePages = () => {
    const pageWindowSize = 10;
    let start = 0;
    let end = Math.min(pageWindowSize, totalPages);

    if (currentPage > 6 && totalPages > pageWindowSize) {
      start = currentPage - 6;
      end = Math.min(currentPage + 4, totalPages);
    }

    return Array.from({ length: end - start }, (_, i) => start + i);
  };

  useEffect(() => {
    handlePageClick(0);
  }, []);

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
              onChange={(e) => handleInputChange(e.target.value)}
              onBlur={handleBlur} // Handle when input loses focus
              placeholder="Enter location"
              className="w-full p-2 rounded-md bg-gray-200 border border-gray-300"
            />
            {locationSuggestions.length > 0 && (
              <div className="absolute top-full left-0 right-0 bg-white border border-gray-300 mt-1 rounded-md z-10">
                {locationSuggestions.map((suggestion, index) => (
                  <div
                    key={index}
                    className="p-2 cursor-pointer hover:bg-gray-100"
                    onMouseDown={() => {handleSelectLocation(parseLocation(suggestion));}}
                  >
                    {parseLocation(suggestion)}
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
            <option value="" disabled>
              Follower Count
            </option>
            {followerOptions.map((option, index) => (
              <option key={index} value={option}>
                {option}
              </option>
            ))}
          </select>

          {/* Category Dropdown */}
          <select
            className="w-40 p-2 rounded-md bg-gray-200 border border-gray-300"
            onChange={(e) => handleSelectCategory(e.target.value)}
            defaultValue=""
          >
            <option value="" disabled>
              Category
            </option>
            {categoryOptions.map((option, index) => (
              <option key={index} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>

        {/* Selected Filters */}
        <div className="flex flex-wrap space-x-2 mb-4">
          {locationFilter.map((filter, index) => (
            <div key={index} className="flex items-center space-x-2 bg-gray-200 py-1 px-3 rounded-md">
              <span>{filter.label}</span>
              <button onClick={() => handleRemoveFilter(filter.label, "location")} className="text-gray-600">
                ✕
              </button>
            </div>
          ))}
          {followerFilter.map((filter, index) => (
            <div key={index} className="flex items-center space-x-2 bg-gray-200 py-1 px-3 rounded-md">
              <span>{filter.label}</span>
              <button onClick={() => handleRemoveFilter(filter.label, "follower")} className="text-gray-600">
                ✕
              </button>
            </div>
          ))}
          {categoryFilter.map((filter, index) => (
            <div key={index} className="flex items-center space-x-2 bg-gray-200 py-1 px-3 rounded-md">
              <span>{filter.label}</span>
              <button onClick={() => handleRemoveFilter(filter.label, "category")} className="text-gray-600">
                ✕
              </button>
            </div>
          ))}
        </div>

        {/* Profile Count and Search inside Filters Card */}
        <div className="flex justify-between items-center">
          <span className="text-gray-600">228,814 users with profiles</span>
          <button onClick={() => handleSearch(0)} className="py-2 px-4 rounded-md bg-gray-800 text-white">Search</button>
        </div>
      </div>

      {/* Influencers List */}
      <InfluencersList loading={loading} influencers={influencers} trimText={trimText} />
      {/* Pagination */}
      <div className="mt-6 flex justify-center">
        <nav className="inline-flex ">
          {currentPage > 0 && (
            <button
              onClick={() => handlePageClick(currentPage - 1)}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-r-md rounded-l-md hover:bg-gray-50"
            >
              &lt;
            </button>
          )}
          {getVisiblePages().map((pageNumber) => (
            <button
              key={pageNumber}
              onClick={() => handlePageClick(pageNumber)}
              className={`px-4 py-2 text-sm font-medium${
                pageNumber === currentPage
                  ? "border border-gray-300 rounded-l-md rounded-r-md bg-gray-500 text-white"
                  : "bg-white text-gray-700 hover:bg-gray-50"
              }`}
            >
              {pageNumber + 1}
            </button>
          ))}
          {currentPage < totalPages - 1 && (
            <button
              onClick={() => handlePageClick(currentPage + 1)}
              className="px-4 py-2 text-l font-medium text-gray-700 bg-white border border-gray-300 rounded-l-md rounded-r-md hover:bg-gray-50"
            >
              &gt;
            </button>
          )}
        </nav>
      </div>
    </div>
  );
};

export default Dashboard;
