import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../Dashboard/Sidebar/Sidebar';







export default function Home() {
  return (
    <div className='h-screen flex'>
    <div className=" w-1/6">
      <Sidebar />
      
      
    </div>
    <div className='h-screen w-5/6'>
        <Outlet />
      </div>
    </div>
  );
}