import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const StretchForming = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    materialType: '',
    thickness: '',
    stretchRatio: '',
    clampingForce: '',
    formingSpeed: '',
    lubricant: '',
    temperature: '',
    partLength: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleBack = () => {
    navigate('/home/sheet-metal');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Stretch Forming Configuration:', formData);
    // Add your submission logic here
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={handleBack}
            className="flex items-center space-x-2 mb-6 px-4 py-2 rounded-lg transition-all duration-300 hover:bg-blue-100"
            style={{color: '#246679'}}
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
            <span className="font-semibold">Back to Sheet Metal</span>
          </button>

          <div className="text-center">
            <h1 
              className="text-4xl font-bold tracking-wider mb-2"
              style={{
                fontFamily: 'Times New Roman, serif',
                color: '#246679'
              }}
            >
              STRETCH FORMING
            </h1>
            <p className="text-gray-600 text-lg">Configure advanced stretch forming operations</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Configuration Panel */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
              <img src="/sheet_metal_icon-removebg-preview.png" alt="Stretch Forming" className="w-8 h-8 mr-3" />
              Machine Configuration
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Material Type
                  </label>
                  <select
                    name="materialType"
                    value={formData.materialType}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select Material</option>
                    <option value="aluminum-2024">Aluminum 2024</option>
                    <option value="aluminum-6061">Aluminum 6061</option>
                    <option value="aluminum-7075">Aluminum 7075</option>
                    <option value="titanium">Titanium</option>
                    <option value="steel">Steel</option>
                    <option value="inconel">Inconel</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Material Thickness (mm)
                  </label>
                  <input
                    type="number"
                    name="thickness"
                    value={formData.thickness}
                    onChange={handleInputChange}
                    placeholder="Enter thickness"
                    step="0.1"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Stretch Ratio (%)
                  </label>
                  <input
                    type="number"
                    name="stretchRatio"
                    value={formData.stretchRatio}
                    onChange={handleInputChange}
                    placeholder="Enter stretch ratio"
                    min="1"
                    max="20"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Clamping Force (kN)
                  </label>
                  <input
                    type="number"
                    name="clampingForce"
                    value={formData.clampingForce}
                    onChange={handleInputChange}
                    placeholder="Enter clamping force"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Forming Speed (mm/min)
                  </label>
                  <input
                    type="number"
                    name="formingSpeed"
                    value={formData.formingSpeed}
                    onChange={handleInputChange}
                    placeholder="Enter forming speed"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Part Length (mm)
                  </label>
                  <input
                    type="number"
                    name="partLength"
                    value={formData.partLength}
                    onChange={handleInputChange}
                    placeholder="Enter part length"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Lubricant Type
                  </label>
                  <select
                    name="lubricant"
                    value={formData.lubricant}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select Lubricant</option>
                    <option value="dry-film">Dry Film Lubricant</option>
                    <option value="polyethylene-film">Polyethylene Film</option>
                    <option value="soap-solution">Soap Solution</option>
                    <option value="wax-based">Wax-Based Lubricant</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Temperature (°C)
                  </label>
                  <input
                    type="number"
                    name="temperature"
                    value={formData.temperature}
                    onChange={handleInputChange}
                    placeholder="Enter temperature (optional)"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 px-6 rounded-lg font-semibold text-white transition-all duration-300 hover:scale-105 shadow-lg"
                style={{backgroundColor: '#246679'}}
              >
                Configure Stretch Forming
              </button>
            </form>
          </div>

          {/* Process Information Panel */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Process Information</h2>
            
            <div className="space-y-6">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-blue-800 mb-2">Stretch Forming Overview</h3>
                <p className="text-gray-700 text-sm leading-relaxed">
                  Stretch forming is a metal forming process where sheet metal is stretched and simultaneously 
                  bent to achieve complex contours. Commonly used in aerospace for large structural components.
                </p>
              </div>

              <div className="bg-green-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-green-800 mb-2">Applications</h3>
                <ul className="text-gray-700 text-sm space-y-1">
                  <li>• Aircraft wing panels</li>
                  <li>• Fuselage sections</li>
                  <li>• Automotive body panels</li>
                  <li>• Architectural cladding</li>
                  <li>• Large radius components</li>
                </ul>
              </div>

              <div className="bg-yellow-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-yellow-800 mb-2">Process Advantages</h3>
                <ul className="text-gray-700 text-sm space-y-1">
                  <li>• Excellent dimensional accuracy</li>
                  <li>• Minimal springback</li>
                  <li>• Large part capability</li>
                  <li>• Smooth surface finish</li>
                  <li>• Reduced material waste</li>
                </ul>
              </div>

              <div className="bg-red-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-red-800 mb-2">Critical Parameters</h3>
                <div className="text-gray-700 text-sm space-y-2">
                  <div className="flex justify-between">
                    <span>Max Stretch Ratio:</span>
                    <span className="font-semibold">15-20%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Material Thickness:</span>
                    <span className="font-semibold">0.8-6.0mm</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Forming Speed:</span>
                    <span className="font-semibold">50-500 mm/min</span>
                  </div>
                </div>
              </div>

              <div className="bg-purple-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-purple-800 mb-2">Machine Status</h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Hydraulic System:</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 rounded-full bg-green-400"></div>
                      <span className="text-sm font-medium">Operational</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Clamps Status:</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 rounded-full bg-green-400 animate-pulse"></div>
                      <span className="text-sm font-medium">Ready</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Form Block:</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 rounded-full bg-blue-400"></div>
                      <span className="text-sm font-medium">Positioned</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StretchForming;