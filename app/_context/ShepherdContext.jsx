// // ShepherdContext.js
// "use client"
// import React, { createContext, useContext, useState } from 'react';
// import { ShepherdTour, ShepherdTourContext } from 'react-shepherd';
// import 'shepherd.js/dist/css/shepherd.css';

// const TourContext = createContext();

// const TourProvider = ({ children }) => {
//   const tourOptions = {
//     defaultStepOptions: {
//       classes: 'shepherd-theme-arrows',
//       scrollTo: true,
//     },
//     useModalOverlay: true,
//   };

//   const steps = [
//     {
//       id: 'welcome-button',
//       text: 'This is an example step.',
//       attachTo: { element: '.welcome-button', on: 'bottom' },
//       buttons: [
//         {
//           text: 'Next',
//           action: ShepherdTourContext.next,
//         },
//       ],
//     },{
//         id: 'home-button',
//         text: 'This button takes you to the home page.',
//         attachTo: { element: '.home-button', on: 'top' },
//         buttons: [
//           {
//             text: 'Back',
//             action: ShepherdTourContext.back,
//           },
//           {
//             text: 'Finish',
//             action: ShepherdTourContext.complete,
//           },
//         ],
//       },
//     // Add more steps as needed
//   ];

//   return (
//     <TourContext.Provider value={{ steps }}>
//       <ShepherdTour steps={steps} tourOptions={tourOptions}>
//         {children}
//       </ShepherdTour>
//     </TourContext.Provider>
//   );
// };

// export const useTour = () => useContext(TourContext);

// export default TourProvider;
