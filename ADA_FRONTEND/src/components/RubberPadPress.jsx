import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const RubberPadPress = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    materialType: '',
    thickness: '',
    rubberDurometer: '',
    pressure: '',
    formingDepth: '',
    cycleTime: '',
    temperature: ''
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
    console.log('Rubber Pad Press Configuration:', formData);
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
              RUBBER PAD PRESS
            </h1>
            <p className="text-gray-600 text-lg">Configure rubber pad press forming operations</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Configuration Panel */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
              <img src="/rub_image.png" alt="Rubber Pad" className="w-8 h-8 mr-3" />
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
                    <option value="aluminum">Aluminum</option>
                    <option value="steel">Steel</option>
                    <option value="titanium">Titanium</option>
                    <option value="inconel">Inconel</option>
                    <option value="stainless-steel">Stainless Steel</option>
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
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Rubber Durometer (Shore A)
                  </label>
                  <select
                    name="rubberDurometer"
                    value={formData.rubberDurometer}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select Durometer</option>
                    <option value="40">40 Shore A (Soft)</option>
                    <option value="60">60 Shore A (Medium)</option>
                    <option value="80">80 Shore A (Hard)</option>
                    <option value="90">90 Shore A (Very Hard)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Forming Pressure (MPa)
                  </label>
                  <input
                    type="number"
                    name="pressure"
                    value={formData.pressure}
                    onChange={handleInputChange}
                    placeholder="Enter pressure"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Forming Depth (mm)
                  </label>
                  <input
                    type="number"
                    name="formingDepth"
                    value={formData.formingDepth}
                    onChange={handleInputChange}
                    placeholder="Enter forming depth"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Cycle Time (seconds)
                  </label>
                  <input
                    type="number"
                    name="cycleTime"
                    value={formData.cycleTime}
                    onChange={handleInputChange}
                    placeholder="Enter cycle time"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div className="md:col-span-2">
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
                Configure Rubber Pad Press
              </button>
            </form>
          </div>

          {/* Process Information Panel */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Process Information</h2>
            
            <div className="space-y-6">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-blue-800 mb-2">Rubber Pad Press Overview</h3>
                <p className="text-gray-700 text-sm leading-relaxed">
                  Rubber pad press forming uses flexible rubber tooling to form complex shapes in sheet metal. 
                  This process is ideal for prototyping and low-volume production with minimal tooling costs.
                </p>
              </div>

              <div className="bg-green-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-green-800 mb-2">Key Advantages</h3>
                <ul className="text-gray-700 text-sm space-y-1">
                  <li>• Low tooling costs</li>
                  <li>• Excellent for prototyping</li>
                  <li>• Uniform pressure distribution</li>
                  <li>• Reduced springback</li>
                  <li>• Complex shape capability</li>
                </ul>
              </div>

              <div className="bg-orange-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-orange-800 mb-2">Process Parameters</h3>
                <div className="text-gray-700 text-sm space-y-2">
                  <div className="flex justify-between">
                    <span>Max Forming Depth:</span>
                    <span className="font-semibold">50mm</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Material Thickness:</span>
                    <span className="font-semibold">0.5-3.0mm</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Forming Pressure:</span>
                    <span className="font-semibold">10-100 MPa</span>
                  </div>
                </div>
              </div>

              <div className="bg-purple-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-purple-800 mb-2">Machine Status</h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Rubber Pad Condition:</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 rounded-full bg-green-400"></div>
                      <span className="text-sm font-medium">Good</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Press Status:</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 rounded-full bg-green-400 animate-pulse"></div>
                      <span className="text-sm font-medium">Ready</span>
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

export default RubberPadPress;