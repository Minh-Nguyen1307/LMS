import React from 'react'
import Banners from '../Components/Home/Banners/Banners'
import Posters from '../Components/Home/Posters/Posters'
import Appendix from '../Components/Home/Appendix/Appendix'
import TopCourses from '../Components/Home/TopCourses/TopCourses'

export default function HomePage() {
  return (
    <div>
       <Banners /> 
       <Posters />
       <TopCourses />
       <Appendix />
    </div>
  )
}
