// import React from 'react';

// function Home() {
//   return (
//     <div style={{ padding: '2rem' }}>
//       <h2>🏠 Home</h2>
//       <p>Welcome to your Electron + React desktop app!</p>
//       <p>This is the Home view. You can put dashboards or quick actions here.</p>
//     </div>
//   );
// }

// export default Home;





import React from 'react';
import SetupViewer from '../components/SetupViewer';

export default function Powertrain({ selectedSetup }) {
  return (
    <div>
      <h2>🏠 Powertrain</h2>
        <SetupViewer selectedSetup={selectedSetup} />
    </div>
  );
}
