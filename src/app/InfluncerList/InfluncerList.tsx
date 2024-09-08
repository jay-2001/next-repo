import React from 'react';
import LoadingOverlay from '../loading/loadingoverlay';

interface InfluencersListProps {
  loading: boolean;
  influencers: any[];
  trimText: (text: string, length: number) => string;
}

const InfluencersList: React.FC<InfluencersListProps> = ({ loading, influencers, trimText }) => {
  return (
    <div className="relative space-y-4">
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 bg-opacity-30 z-10">
          <div className="relative">
            {/* Move the loading circle to 1/4th of the height */}
            <div className="absolute top-1/4 transform -translate-y-1/4">
              <LoadingOverlay />
            </div>
          </div>
        </div>
      )}
      {influencers.map((influencer, index) => (
        <div key={index} className="p-4 bg-white rounded-lg shadow-all-sides flex justify-between items-center">
          <div>
            <div className="text-l font-bold">{trimText(influencer.fullName, 25)}</div>
            {/* Display the username as @username and make it clickable */}
            <div className="text-sm text-gray-600">
              <a 
                href={`https://www.instagram.com/${influencer.username}`} 
                target="_blank" 
                rel="noopener noreferrer"
                className="hover:underline"
              >
                @{trimText(influencer.username, 30)}
              </a>
            </div>
          </div>
          <div className="follower-count">
            <div className="text-right">{influencer.totalFollowerCount} followers</div>
          </div>
          <div className="flex space-x-2">
            {influencer.categories.map((topic: string, idx: number) => (
              <span key={idx} className="bg-gray-300 py-1 px-2 rounded-md text-sm">
                {topic}
              </span>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default InfluencersList;
