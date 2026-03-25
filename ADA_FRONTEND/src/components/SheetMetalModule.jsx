// import { Routes, Route } from 'react-router-dom';
// import PressBrakeForming from './PressBrakeForming';
// import RubberPadPress from './RubberPadPress';
// import StretchForming from './StretchForming';

// const SheetMetalModule = () => {
//   return (
//     <Routes>
//       <Route path="bending" element={<PressBrakeForming />} />
//       <Route path="cutting" element={<RubberPadPress />} />
//       <Route path="welding" element={<StretchForming />} />
//     </Routes>
//   );
// };

// export default SheetMetalModule;










import React from 'react';
import { Routes, Route } from 'react-router-dom';
import SheetMetalUploadPage from './SheetMetalUploadPage';
import SheetMetalViewerPage from './SheetMetalViewerPage';

const SheetMetalModule = () => {
  return (
    <Routes>
      <Route path="upload" element={<SheetMetalUploadPage />} />
      <Route path="viewer/:id" element={<SheetMetalViewerPage />} />
      {/* <Route path="*" element={<SheetMetalUploadPage />} /> */}
    </Routes>
  );
};

export default SheetMetalModule;