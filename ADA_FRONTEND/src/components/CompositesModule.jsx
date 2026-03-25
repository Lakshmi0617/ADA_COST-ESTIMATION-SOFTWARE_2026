import React from 'react';

const CompositesModule = () => {
  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Composites Module'''''''''''''''''</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-green-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-green-800 mb-2">Fiber Layup</h3>
              <p className="text-gray-600">Configure fiber layup processes and material costs.</p>
            </div>
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-blue-800 mb-2">Resin Transfer</h3>
              <p className="text-gray-600">Set up resin transfer molding parameters.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompositesModule;