import React from 'react';

const ComingSoon: React.FC = () => {
  return (
    <div className="flex items-center justify-center h-full text-center p-8">
      <div>
        <h2 className="text-3xl font-bold text-gray-800">Coming Soon!</h2>
        <p className="text-gray-600 mt-2">This feature is under construction and will be available shortly.</p>
      </div>
    </div>
  );
};

export default ComingSoon;
