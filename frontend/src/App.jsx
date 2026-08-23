import { useState } from 'react'
import { Toaster } from 'react-hot-toast';
import { Outlet } from 'react-router-dom';

function App() {

  return (
<div className="h-screen overflow-hidden bg-gradient-to-br from-[#111827] via-[#1e1b4b] to-[#4c1d95] flex items-center justify-center">
  <Outlet />
  <Toaster />
</div>

  );
}

export default App
