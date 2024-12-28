import React from 'react'
import Banners from '../Components/Home/Banners/Banners'
import Posters from '../Components/Home/Posters/Posters'
import Appendix from '../Components/Home/Appendix/Appendix'

export default function HomePage() {
  return (
    <div>
       <Banners /> 
       <Posters />
       <Appendix />
    </div>
  )
}
