import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const CompositesLayupProcess = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');

  const handleBackToComposites = () => {
    navigate('/home/composites');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
      {/* Header */}
      <div className="mb-8">
        <button
          onClick={handleBackToComposites}
          className="flex items-center space-x-2 mb-6 px-4 py-2 rounded-lg transition-all duration-300 hover:bg-blue-100"
          style={{color: '#246679'}}
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
          <span className="font-semibold">Back to Composites Module</span>
        </button>

        <div className="text-center">
          <div className="flex items-center justify-center space-x-4 mb-4">
            <img 
              src="/composites-icon1.png" 
              alt="Layup Process" 
              className="w-16 h-16"
            />
            <h1 
              className="text-4xl font-bold tracking-wider"
              style={{
                fontFamily: 'Times New Roman, serif',
                color: '#246679'
              }}
            >
              LAYUP PROCESS
            </h1>
          </div>
          <p className="text-gray-600 text-lg">Composite layup and lamination operations</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="max-w-6xl mx-auto mb-6">
        <div className="flex space-x-2 border-b border-gray-300">
          {['overview', 'process', 'materials'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-3 font-semibold transition-all duration-300 ${
                activeTab === tab 
                  ? 'border-b-2 text-white' 
                  : 'text-gray-600 hover:text-gray-800'
              }`}
              style={{
                borderBottomColor: activeTab === tab ? '#246679' : 'transparent',
                backgroundColor: activeTab === tab ? '#246679' : 'transparent'
              }}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Content Area */}
      <div className="max-w-6xl mx-auto">
        <div 
          className="rounded-xl shadow-xl p-8"
          style={{backgroundColor: 'white'}}
        >
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold" style={{color: '#246679'}}>
                Process Overview
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-6 rounded-lg" style={{backgroundColor: 'rgba(36, 102, 121, 0.1)'}}>
                  <div className="text-3xl font-bold mb-2" style={{color: '#246679'}}>01</div>
                  <h3 className="font-semibold mb-2">Material Preparation</h3>
                  <p className="text-sm text-gray-600">Prepare composite materials and tooling for the layup process</p>
                </div>
                <div className="p-6 rounded-lg" style={{backgroundColor: 'rgba(36, 102, 121, 0.1)'}}>
                  <div className="text-3xl font-bold mb-2" style={{color: '#246679'}}>02</div>
                  <h3 className="font-semibold mb-2">Layer Application</h3>
                  <p className="text-sm text-gray-600">Apply composite layers according to specified orientation</p>
                </div>
                <div className="p-6 rounded-lg" style={{backgroundColor: 'rgba(36, 102, 121, 0.1)'}}>
                  <div className="text-3xl font-bold mb-2" style={{color: '#246679'}}>03</div>
                  <h3 className="font-semibold mb-2">Quality Control</h3>
                  <p className="text-sm text-gray-600">Inspect and verify layup quality before curing</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'process' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold" style={{color: '#246679'}}>
                Process Parameters
              </h2>
              <div className="space-y-4">
                <div className="border rounded-lg p-4">
                  <h3 className="font-semibold mb-2">Layup Configuration</h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Layer Orientation:</span>
                      <span className="ml-2 font-semibold">0°/45°/90°/-45°</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Stacking Sequence:</span>
                      <span className="ml-2 font-semibold">Symmetric</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Ply Thickness:</span>
                      <span className="ml-2 font-semibold">0.125 mm</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Total Layers:</span>
                      <span className="ml-2 font-semibold">16 plies</span>
                    </div>
                  </div>
                </div>

                <div className="border rounded-lg p-4">
                  <h3 className="font-semibold mb-2">Environmental Conditions</h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Temperature:</span>
                      <span className="ml-2 font-semibold">20-25°C</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Humidity:</span>
                      <span className="ml-2 font-semibold">45-55%</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'materials' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold" style={{color: '#246679'}}>
                Material Specifications
              </h2>
              <div className="space-y-4">
                <div className="border rounded-lg p-4">
                  <h3 className="font-semibold mb-3">Available Materials</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center p-3 rounded" style={{backgroundColor: 'rgba(36, 102, 121, 0.05)'}}>
                      <div>
                        <div className="font-semibold">Carbon Fiber Prepreg</div>
                        <div className="text-sm text-gray-600">High-strength carbon fiber with epoxy matrix</div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 rounded-full bg-green-500"></div>
                        <span className="text-sm font-semibold">Available</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center p-3 rounded" style={{backgroundColor: 'rgba(36, 102, 121, 0.05)'}}>
                      <div>
                        <div className="font-semibold">Glass Fiber Prepreg</div>
                        <div className="text-sm text-gray-600">E-glass fiber with polyester resin</div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 rounded-full bg-green-500"></div>
                        <span className="text-sm font-semibold">Available</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center p-3 rounded" style={{backgroundColor: 'rgba(36, 102, 121, 0.05)'}}>
                      <div>
                        <div className="font-semibold">Aramid Fiber Prepreg</div>
                        <div className="text-sm text-gray-600">Kevlar with epoxy resin system</div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 rounded-full bg-green-500"></div>
                        <span className="text-sm font-semibold">Available</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Status Bar */}
      <div className="fixed bottom-6 left-6 right-6">
        <div 
          className="border rounded-xl p-4 mx-auto max-w-md"
          style={{
            backgroundColor: 'rgba(36, 102, 121, 0.1)',
            borderColor: 'rgba(36, 102, 121, 0.3)'
          }}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div 
                className="w-3 h-3 rounded-full animate-pulse"
                style={{backgroundColor: '#246679'}}
              />
              <span 
                className="text-sm font-mono font-bold"
                style={{color: '#73b6ca'}}
              >
                LAYUP PROCESS READY
              </span>
            </div>
            <span 
              className="text-sm font-mono font-bold"
              style={{color: '#246679'}}
            >
              {activeTab.toUpperCase()} VIEW
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompositesLayupProcess;