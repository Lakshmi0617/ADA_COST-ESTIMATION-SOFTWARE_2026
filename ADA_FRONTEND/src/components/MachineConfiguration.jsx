


// import React, { useState } from 'react';
// import { ChevronRight, ChevronDown, Settings, Wrench, Sheet, Layers, ArrowLeft } from 'lucide-react';
// import { useNavigate } from 'react-router-dom';
// import MillingComponent from './MillingMaterials';
// import MillingParametersComponent from './MillingParametersComponent';
// import MillingMachineRate from './MillingMachineRate';
// import MillingManufacturingPercentage from './MillingManufacturingPercentage';
// import MillingPercentages from './MillingPercentages';
// import TurningMaterials from './TurningMaterials';
// import TurningParametersComponent from './TurningParametersComponent';
// import TurningMachineRate from './TurningMachineRate';
// import TurningManufacturingPercentage from './TurningManufacturingPercentage';
// import TurningPercentages from './TurningPercentages';
// // StatCard Component - Now clickable
// const StatCard = ({ title, value, icon: Icon, color, onClick }) => (
//   <div 
//     onClick={onClick}
//     className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-300 border border-gray-100 cursor-pointer hover:scale-105 transform transition-transform"
//   >
//     <div className="flex items-center justify-between mb-4">
//       <div className={`p-3 rounded-lg ${color}`}>
//         <Icon className="w-6 h-6 text-white" />
//       </div>
//     </div>
//     <h3 className="text-gray-600 text-sm font-medium mb-1">{title}</h3>
//     <p className="text-2xl font-bold text-gray-800">{value}</p>
//   </div>
// );

// // Turning Component
// const TurningComponent = ({ onNavigate }) => {
//   const stats = [
//     { title: 'Materials', icon: Layers, color: 'bg-[#246679]', onClick: () => onNavigate('turning-materials') },
//     { title: 'Parameters', icon: Settings, color: 'bg-[#2a7589]', onClick: () => onNavigate('turning-parameters') },
//     { title: 'Machine Rates', icon: Wrench, color: 'bg-[#1f5766]', onClick: () => onNavigate('turning-machine-rates') },
//     { title: 'Manufacturing %', icon: Sheet, color: 'bg-[#2d8599]', onClick: () => onNavigate('turning-manufacturing') },
//     { title: 'Efficiency', icon: Settings, color: 'bg-[#327a8d]', onClick: () => onNavigate('turning-percentages') },
//   ];

//   return (
//     <div>
//       <h2 className="text-2xl font-bold mb-6 text-gray-800">Turning Configuration</h2>
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
//         {stats.map((stat, index) => (
//           <StatCard key={index} {...stat} />
//         ))}
//       </div>
//     </div>
//   );
// };

// // Sheet Metal Component
// const SheetMetalComponent = () => {
//   const stats = [
//     { title: 'Materials', value: '52', icon: Layers, color: 'bg-[#246679]' },
//     { title: 'Parameters', value: '142', icon: Settings, color: 'bg-[#2a7589]' },
//     { title: 'Machine Rates', value: '₹800/hr', icon: Wrench, color: 'bg-[#1f5766]' },
//     { title: 'Manufacturing %', value: '91%', icon: Sheet, color: 'bg-[#2d8599]' },
//     { title: 'Efficiency', value: '94%', icon: Settings, color: 'bg-[#327a8d]' }
//   ];

//   return (
//     <div>
//       <h2 className="text-2xl font-bold mb-6 text-gray-800">Sheet Metal Configuration</h2>
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
//         {stats.map((stat, index) => (
//           <StatCard key={index} {...stat} />
//         ))}
//       </div>
//     </div>
//   );
// };

// // Composite Component
// const CompositeComponent = () => {
//   const stats = [
//     { title: 'Materials', value: '29', icon: Layers, color: 'bg-[#246679]' },
//     { title: 'Parameters', value: '84', icon: Settings, color: 'bg-[#2a7589]' },
//     { title: 'Machine Rates', value: '₹1,500/hr', icon: Wrench, color: 'bg-[#1f5766]' },
//     { title: 'Manufacturing %', value: '78%', icon: Sheet, color: 'bg-[#2d8599]' },
//     { title: 'Efficiency', value: '85%', icon: Settings, color: 'bg-[#327a8d]' }
//   ];

//   return (
//     <div>
//       <h2 className="text-2xl font-bold mb-6 text-gray-800">Composite Configuration</h2>
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
//         {stats.map((stat, index) => (
//           <StatCard key={index} {...stat} />
//         ))}
//       </div>
//     </div>
//   );
// };

// // Main App Component
// const MachineConfigurationApp = () => {
//   const navigate = useNavigate();
//   const [expandedModule, setExpandedModule] = useState('machining');
//   const [selectedComponent, setSelectedComponent] = useState('milling');

//   const handleBackToModules = () => {
//     navigate('/home');
//   };

//   const modules = [
//     {
//       id: 'machining',
//       name: 'Machining Module',
//       icon: Wrench,
//       subModules: [
//         { id: 'milling', name: 'Milling' },
//         { id: 'turning', name: 'Turning' }
//       ]
//     },
//     {
//       id: 'sheetmetal',
//       name: 'Sheet Metal Module',
//       icon: Sheet,
//       subModules: [
//         { id: 'sheetmetal-config', name: 'Sheet Metal Config' }
//       ]
//     },
//     {
//       id: 'composite',
//       name: 'Composite Module',
//       icon: Layers,
//       subModules: [
//         { id: 'composite-config', name: 'Composite Config' }
//       ]
//     }
//   ];

//   const toggleModule = (moduleId) => {
//     setExpandedModule(expandedModule === moduleId ? null : moduleId);
//   };

//   const selectComponent = (componentId) => {
//     console.log('Selecting component:', componentId);
//     setSelectedComponent(componentId);
//   };

//   const handleStatCardClick = (componentName) => {
//     console.log('Stat card clicked:', componentName);
//     setSelectedComponent(componentName);
//   };

//   const handleBackFromParameters = () => {
//     console.log('Back from parameters');
//     setSelectedComponent('milling');
//   };

//   const handleBackFromMachineRates = () => {
//     console.log('Back from machine rates');
//     setSelectedComponent('milling');
//   };

//   const renderComponent = () => {
//     console.log('Rendering component:', selectedComponent);
    
//     switch(selectedComponent) {
//       case 'milling':
//         return <MillingComponent onNavigate={handleStatCardClick} />;
//       case 'milling-parameters':
//         return <MillingParametersComponent onBack={handleBackFromParameters} />;
//       case 'milling-machine-rates':
//         return <MillingMachineRate onBack={handleBackFromMachineRates} />;
//       case 'milling-manufacturing': // NEW CASE
//         return <MillingManufacturingPercentage onBack={() => setSelectedComponent('milling')} />;
//       case 'milling-percentages': // NEW CASE
//         return <MillingPercentages onBack={() => setSelectedComponent('milling')} />;
//       case 'turning':
//       return <TurningComponent onNavigate={handleStatCardClick} />;
//     case 'turning-materials':
//       return <TurningMaterials onBack={() => setSelectedComponent('turning')} />;
//     case 'turning-parameters':
//       return <TurningParametersComponent onBack={() => setSelectedComponent('turning')} />;
//     case 'turning-machine-rates':
//       return <TurningMachineRate onBack={() => setSelectedComponent('turning')} />;
//     case 'turning-manufacturing':
//       return <TurningManufacturingPercentage onBack={() => setSelectedComponent('turning')} />;
//     case 'turning-percentages':
//       return <TurningPercentages onBack={() => setSelectedComponent('turning')} />;
    
//     // Other modules

//       case 'sheetmetal-config':
//         return <SheetMetalComponent />;
//       case 'composite-config':
//         return <CompositeComponent />;
//       default:
//         return (
//           <div className="flex items-center justify-center h-full">
//             <div className="text-center">
//               <Settings className="w-16 h-16 text-gray-300 mx-auto mb-4" />
//               <h2 className="text-2xl font-bold text-gray-700 mb-2">
//                 Welcome to Machine Configuration
//               </h2>
//               <p className="text-gray-500">
//                 Select a module from the sidebar to get started
//               </p>
//             </div>
//           </div>
//         );
//     }
//   };

//   return (
//     <div className="flex h-screen bg-gray-50">
//       {/* Vertical Navbar */}
//       <div className="w-64 bg-white shadow-lg overflow-y-auto">
//         <div className="p-4 bg-[#246679]">
//           <button
//             onClick={handleBackToModules}
//             className="flex items-center space-x-2 mb-3 text-white hover:text-gray-200 transition-colors duration-200"
//           >
//             <ArrowLeft className="w-4 h-4" />
//             <span className="text-sm font-medium">Back to Modules</span>
//           </button>
//           <h1 className="text-white text-lg font-bold">Machine Configuration</h1>
//         </div>
        
//         <nav className="p-2">
//           {modules.map((module) => (
//             <div key={module.id} className="mb-2">
//               <button
//                 onClick={() => toggleModule(module.id)}
//                 className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-gray-100 transition-colors duration-200"
//               >
//                 <div className="flex items-center space-x-3">
//                   <module.icon className="w-5 h-5 text-[#246679]" />
//                   <span className="font-medium text-gray-700">{module.name}</span>
//                 </div>
//                 {expandedModule === module.id ? (
//                   <ChevronDown className="w-4 h-4 text-gray-500" />
//                 ) : (
//                   <ChevronRight className="w-4 h-4 text-gray-500" />
//                 )}
//               </button>
              
//               {expandedModule === module.id && (
//                 <div className="ml-8 mt-1 space-y-1">
//                   {module.subModules.map((subModule) => (
//                     <button
//                       key={subModule.id}
//                       onClick={() => selectComponent(subModule.id)}
//                       className={`w-full text-left p-2 rounded-md transition-colors duration-200 ${
//                         selectedComponent === subModule.id
//                           ? 'bg-[#246679] text-white font-medium'
//                           : 'text-gray-600 hover:bg-gray-100'
//                       }`}
//                     >
//                       {subModule.name}
//                     </button>
//                   ))}
//                 </div>
//               )}
//             </div>
//           ))}
//         </nav>
//       </div>

//       {/* Main Content Area */}
//       <div className="flex-1 overflow-y-auto">
//         <div className="p-8">
//           {renderComponent()}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default MachineConfigurationApp;




import React, { useState } from 'react';
import { ChevronRight, ChevronDown, Settings, Wrench, Sheet, Layers, ArrowLeft,Timer, Grid, Activity,LayoutGrid,ToolCase,ClipboardList,History } from 'lucide-react';
// import { ChevronRight, ChevronDown, Settings, Wrench, Sheet, Layers, ArrowLeft, Factory,Clock,Timer, Grid, Activity,LayoutGrid,ToolCase,ClipboardList,DraftingCompass } from 'lucide-react'; //this line is commented uncomment to see all the icon used in Mastretoolhours
import { useNavigate } from 'react-router-dom';
import MillingComponent from './MillingMaterials';
import MillingParametersComponent from './MillingParametersComponent';
import MillingMachineRate from './MillingMachineRate';
import MillingManufacturingPercentage from './MillingManufacturingPercentage';
import MillingPercentages from './MillingPercentages';
import MillingHistoryTable from './MillingHistoryTable';
import TurningHistoryTable from './TurningHistoryTable';
import TurningMaterials from './TurningMaterials';
import TurningParametersComponent from './TurningParametersComponent';
import TurningMachineRate from './TurningMachineRate';
import TurningManufacturingPercentage from './TurningManufacturingPercentage';
import TurningPercentages from './TurningPercentages';
import SheetMetalMaterials from './SheetMetalMaterials'; // Import the SheetMetalMaterials component
import SheetMetalParametersComponent from './SheetMetalParametersComponent'; // Import the SheetMetalParametersComponent
import SheetMetalMachineRate from './SheetMetalMachineRate'; // Add this line
import SheetMetalManufacturing from './SheetMetalManufacturing';
import SheetMetalPercentages from './SheetMetalPercentages';
import SheetMetalTooling from './SheetMetalTooling';
import CompositesMaterialTable from './CompositesMaterialTable';
import MasterToolTable from './MasterToolTable';
import CompositesPartToolCostTable from './CompositesPartToolCostTable';
import CompositesPartFabricationCostTable from './CompositesPartFabricationCostTable';
import SheetMetalHistoryTable from './SheetMetalHistoryTable';
import CompositeHistoryTable from './CompositeHistoryTable';
// import CompositesMasterToolHoursTable from './CompositesMasterToolHoursTable';
// import CompositesPartToolHoursTable from './CompositesPartToolHoursTable';
// import CompositesPartToolLayupHours from './CompositesPartToolLayupHours';
// import CompositesPartFabricationHours from './CompositesPartFabricationHours';
// import CompositesPartFabricationLayupHours from './CompositesPartFabricationLayupHours';

// StatCard Component - Now clickable
const StatCard = ({ title, value, icon: Icon, color, onClick }) => (
  <div 
    onClick={onClick}
    className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-300 border border-gray-100 cursor-pointer hover:scale-105 transform transition-transform"
  >
    <div className="flex items-center justify-between mb-4">
      <div className={`p-3 rounded-lg ${color}`}>
        <Icon className="w-6 h-6 text-white" />
      </div>
    </div>
    <h3 className="text-gray-600 text-sm font-medium mb-1">{title}</h3>
    <p className="text-2xl font-bold text-gray-800">{value}</p>
  </div>
);

// Turning Component
const TurningComponent = ({ onNavigate }) => {
  const stats = [
    { title: 'Materials', icon: Layers, color: 'bg-[#246679]', onClick: () => onNavigate('turning-materials') },
    { title: 'Parameters', icon: Settings, color: 'bg-[#2a7589]', onClick: () => onNavigate('turning-parameters') },
    { title: 'Machine Rates', icon: Wrench, color: 'bg-[#1f5766]', onClick: () => onNavigate('turning-machine-rates') },
    { title: 'Machining time wrt Manufaturing time %', icon: Sheet, color: 'bg-[#2d8599]', onClick: () => onNavigate('turning-manufacturing') },
    { title: 'Roughing %', icon: Settings, color: 'bg-[#327a8d]', onClick: () => onNavigate('turning-percentages') },
    { 
      title: 'History', 
      icon: History, 
      color: 'bg-[#4a5568]',
      onClick: () => onNavigate('turning-history')
    }
  ];

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Turning Configuration</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        {stats.map((stat, index) => (
          <StatCard key={index} {...stat} />
        ))}
      </div>
    </div>
  );
};

// Sheet Metal Component - NOW WITH NAVIGATION
const SheetMetalComponent = ({ onNavigate }) => {
  const stats = [
    { 
      title: 'Materials', 
      // value: '52', 
      icon: Layers, 
      color: 'bg-[#246679]',
      onClick: () => onNavigate('sheetmetal-materials') 
    },
    { 
      title: 'Parameters', 
      // value: '142', 
      icon: Settings, 
      color: 'bg-[#2a7589]',
      onClick: () => onNavigate('sheetmetal-parameters') 
    },
    { 
      title: 'Machine Rates', 
      // value: '₹800/hr', 
      icon: Wrench, 
      color: 'bg-[#1f5766]',
      onClick: () => onNavigate('sheetmetal-machine-rates') 
    },
     { 
      title: 'Tooling', 
      icon: Wrench, 
      color: 'bg-[#1a4d5c]',
      onClick: () => onNavigate('sheetmetal-tooling') 
    },
    { 
      title: 'Machining time wrt Manufaturing time %', 
      // value: '91%', 
      icon: Sheet, 
      color: 'bg-[#2d8599]',
      onClick: () => onNavigate('sheetmetal-manufacturing') 
    },
    { 
      title: 'Roughing %', 
      // value: '94%', 
      icon: Settings, 
      color: 'bg-[#327a8d]',
      onClick: () => onNavigate('sheetmetal-percentages') 
    },
    { 
      title: 'History', 
      icon: History, 
      color: 'bg-[#4a5568]',
      onClick: () => onNavigate('sheetmetal-history')
    }
  ];

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Sheet Metal Configuration</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        {stats.map((stat, index) => (
          <StatCard key={index} {...stat} />
        ))}
      </div>
    </div>
  );
};

// Composite Component
// const CompositeComponent = () => {
//   const stats = [
//     { title: 'Materials', value: '29', icon: Layers, color: 'bg-[#246679]' },
//     { title: 'Parameters', value: '84', icon: Settings, color: 'bg-[#2a7589]' },
//     { title: 'Machine Rates', value: '₹1,500/hr', icon: Wrench, color: 'bg-[#1f5766]' },
//     { title: 'Machining time wrt Manufaturing time %', value: '78%', icon: Sheet, color: 'bg-[#2d8599]' },
//     { title: 'Roughing %', value: '85%', icon: Settings, color: 'bg-[#327a8d]' }
//   ];

//   return (
//     <div>
//       <h2 className="text-2xl font-bold mb-6 text-gray-800">Composite Configuration</h2>
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
//         {stats.map((stat, index) => (
//           <StatCard key={index} {...stat} />
//         ))}
//       </div>
//     </div>
//   );
// };
// Composite Component - Updated with navigation
const CompositeComponent = ({ onNavigate }) => {
  const stats = [
    { 
      title: 'Materials', 
      icon: Layers, 
      color: 'bg-[#246679]',
      onClick: () => onNavigate('composite-materials')
    },
     { 
      title: 'Master Tool Cost', 
      icon: Wrench, 
      color: 'bg-[#2a7589]',
      onClick: () => onNavigate('composite-master-tool')
    },
    { 
      title: 'Part Tool Cost', 
      icon: ClipboardList, 
      color: 'bg-[#1f5766]',
      onClick: () => onNavigate('composite-part-tool')
    },
    { 
      title: 'Part Fabrication Cost', 
      icon: ToolCase, 
      color: 'bg-[#2d8599]',
      onClick: () => onNavigate('composite-part-fabrication')
    },
    { 
      title: 'History', 
      icon: History, 
      color: 'bg-[#4a5568]',
      onClick: () => onNavigate('composite-history')
    }
  //   { 
  // title: 'Master Tool Hours', 
  // icon: Clock, 
  // color: 'bg-[#1f5766]',
  // onClick: () => onNavigate('composite-master-tool-hours')
  //  },
  //  { 
  //     title: 'Part Tool Hours',  // ADD THIS NEW ENTRY
  //     icon: Timer, 
  //     color: 'bg-[#327a8d]',
  //     onClick: () => onNavigate('composite-part-tool-hours')  // NEW NAVIGATION
  //   },
  //      { 
  //     title: 'Part Tool Layup Hours',  // ADD THIS NEW ONE
  //     icon: Grid, 
  //     color: 'bg-[#2a7589]',
  //     onClick: () => onNavigate('composite-part-tool-layup-hours')
  //   },
//     { 
//   title: 'Part Fabrication Hours',  
//   icon: Activity, 
//   color: 'bg-[#1a4d5c]',
//   onClick: () => onNavigate('composite-part-fabrication-hours')
// },
//     { 
//   title: 'Part Fabrication Layup Hours',  
//   icon: LayoutGrid, 
//   color: 'bg-[#2d8599]',
//   onClick: () => onNavigate('composite-part-fabrication-layup-hours')
// }
  ];

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Composite Configuration</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        {stats.map((stat, index) => (
          <StatCard key={index} {...stat} />
        ))}
      </div>
    </div>
  );
};

// Main App Component
const MachineConfigurationApp = () => {
  const navigate = useNavigate();
  const [expandedModule, setExpandedModule] = useState('machining');
  const [selectedComponent, setSelectedComponent] = useState('milling');

  const handleBackToModules = () => {
    navigate('/home');
  };

  const modules = [
    {
      id: 'machining',
      name: 'Machining Module',
      icon: Wrench,
      subModules: [
        { id: 'milling', name: 'Milling' },
        { id: 'turning', name: 'Turning' }
      ]
    },
    {
      id: 'sheetmetal',
      name: 'Sheet Metal Module',
      icon: Sheet,
      subModules: [
        { id: 'sheetmetal-config', name: 'Sheet Metal Config' }
      ]
    },
    {
      id: 'composite',
      name: 'Composite Module',
      icon: Layers,
      subModules: [
        { id: 'composite-config', name: 'Composite Config' }
      ]
    }
  ];

  const toggleModule = (moduleId) => {
    setExpandedModule(expandedModule === moduleId ? null : moduleId);
  };

  const selectComponent = (componentId) => {
    console.log('Selecting component:', componentId);
    setSelectedComponent(componentId);
  };

  const handleStatCardClick = (componentName) => {
    console.log('Stat card clicked:', componentName);
    setSelectedComponent(componentName);
  };

  const handleBackFromParameters = () => {
    console.log('Back from parameters');
    setSelectedComponent('milling');
  };

  const handleBackFromMachineRates = () => {
    console.log('Back from machine rates');
    setSelectedComponent('milling');
  };

  const renderComponent = () => {
    console.log('Rendering component:', selectedComponent);
    
    switch(selectedComponent) {
      // MILLING CASES
      case 'milling':
        return <MillingComponent onNavigate={handleStatCardClick} />;
      case 'milling-parameters':
        return <MillingParametersComponent onBack={handleBackFromParameters} />;
      case 'milling-machine-rates':
        return <MillingMachineRate onBack={handleBackFromMachineRates} />;
      case 'milling-manufacturing':
        return <MillingManufacturingPercentage onBack={() => setSelectedComponent('milling')} />;
      case 'milling-percentages':
        return <MillingPercentages onBack={() => setSelectedComponent('milling')} />;
      case 'milling-history':
        return <MillingHistoryTable onBack={() => setSelectedComponent('milling')} />;
      
      // TURNING CASES
      case 'turning':
        return <TurningComponent onNavigate={handleStatCardClick} />;
      case 'turning-materials':
        return <TurningMaterials onBack={() => setSelectedComponent('turning')} />;
      case 'turning-parameters':
        return <TurningParametersComponent onBack={() => setSelectedComponent('turning')} />;
      case 'turning-machine-rates':
        return <TurningMachineRate onBack={() => setSelectedComponent('turning')} />;
      case 'turning-manufacturing':
        return <TurningManufacturingPercentage onBack={() => setSelectedComponent('turning')} />;
      case 'turning-percentages':
        return <TurningPercentages onBack={() => setSelectedComponent('turning')} />;
      case 'turning-history':
        return <TurningHistoryTable onBack={() => setSelectedComponent('turning')} />;
      
      // SHEET METAL CASES
      case 'sheetmetal-config':
        return <SheetMetalComponent onNavigate={handleStatCardClick} />;
      case 'sheetmetal-materials':
        return <SheetMetalMaterials onBack={() => setSelectedComponent('sheetmetal-config')} />;
      case 'sheetmetal-parameters':
        return <SheetMetalParametersComponent onBack={() => setSelectedComponent('sheetmetal-config')} />;
      case 'sheetmetal-machine-rates':
        return <SheetMetalMachineRate onBack={() => setSelectedComponent('sheetmetal-config')} />;
      case 'sheetmetal-manufacturing':
        return <SheetMetalManufacturing onBack={() => setSelectedComponent('sheetmetal-config')} />;
      case 'sheetmetal-percentages':
        return <SheetMetalPercentages onBack={() => setSelectedComponent('sheetmetal-config')} />;
      case 'sheetmetal-tooling':
        return <SheetMetalTooling onBack={() => setSelectedComponent('sheetmetal-config')} />;
      case 'sheetmetal-history':
        return <SheetMetalHistoryTable onBack={() => setSelectedComponent('sheetmetal-config')} />;
      // COMPOSITE CASES
      case 'composite-config':
        return <CompositeComponent onNavigate={handleStatCardClick} />;
      case 'composite-materials':
        return <CompositesMaterialTable onBack={() => setSelectedComponent('composite-config')} />;
      case 'composite-master-tool':
        return <MasterToolTable onBack={() => setSelectedComponent('composite-config')} />;
      case 'composite-part-tool':
        return <CompositesPartToolCostTable onBack={() => setSelectedComponent('composite-config')} />;
      case 'composite-part-fabrication':
        return <CompositesPartFabricationCostTable onBack={() => setSelectedComponent('composite-config')} />;
      case 'composite-history':
        return <CompositeHistoryTable onBack={() => setSelectedComponent('composite-config')} />;
  // case 'composite-part-fabrication-hours':
  // return <CompositesPartFabricationHours onBack={() => setSelectedComponent('composite-config')} />;
  // case 'composite-part-fabrication-layup-hours':
  // return <CompositesPartFabricationLayupHours onBack={() => setSelectedComponent('composite-config')} />;
    
      // DEFAULT CASE
      default:
        return (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <Settings className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-700 mb-2">
                Welcome to Machine Configuration
              </h2>
              <p className="text-gray-500">
                Select a module from the sidebar to get started
              </p>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="flex h-screen ">
      {/* Vertical Navbar */}
      <div className="w-64 bg-white shadow-lg overflow-y-auto">
        <div className="p-4 bg-[#246679]">
          <button
            onClick={handleBackToModules}
            className="flex items-center space-x-2 mb-3 text-white hover:text-gray-200 transition-colors duration-200"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm font-medium">Back to Modules</span>
          </button>
          <h1 className="text-white text-lg font-bold">Machine Configuration</h1>
        </div>
        
        <nav className="p-2">
          {modules.map((module) => (
            <div key={module.id} className="mb-2">
              <button
                onClick={() => toggleModule(module.id)}
                className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-gray-100 transition-colors duration-200"
              >
                <div className="flex items-center space-x-3">
                  <module.icon className="w-5 h-5 text-[#246679]" />
                  <span className="font-medium text-gray-700">{module.name}</span>
                </div>
                {expandedModule === module.id ? (
                  <ChevronDown className="w-4 h-4 text-gray-500" />
                ) : (
                  <ChevronRight className="w-4 h-4 text-gray-500" />
                )}
              </button>
              
              {expandedModule === module.id && (
                <div className="ml-8 mt-1 space-y-1">
                  {module.subModules.map((subModule) => (
                    <button
                      key={subModule.id}
                      onClick={() => selectComponent(subModule.id)}
                      className={`w-full text-left p-2 rounded-md transition-colors duration-200 ${
                        selectedComponent === subModule.id
                          ? 'bg-[#246679] text-white font-medium'
                          : 'text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      {subModule.name}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-8 pb-36">
          {renderComponent()}
        </div>
      </div>
    </div>
  );
};

export default MachineConfigurationApp;