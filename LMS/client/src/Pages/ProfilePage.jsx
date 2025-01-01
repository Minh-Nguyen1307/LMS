import React from 'react'
import Side from '../Components/Profile/Side/Side'
import { Outlet } from 'react-router-dom'

export default function ProfilePage() {
  return (
    <div>
        <div className='h-screen flex'>
    <div className=" w-1/6">
      <Side />
      
      
    </div>
    <div className='h-screen w-5/6'>
        <Outlet />
      </div>
    </div>
    </div>
  )
}
