// src/components/ComingSoon.jsx
import React from 'react'
import tiktokCopaLiveLogo from '../assets/img/tikTokCopaLive-Logo.png'
import Soon from '../assets/img/tikTokCopaLive-Soon.png'
import logoLive from '../assets/img/tikTokCopaLive-LogoHeader.png'

function ComingSoon() {
  return (
    <>
       <div className='col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12 col-xxl-12 pe-md-0 pe-lg-5 pe-xl-5 pe-xxl-5 imagecontainer logoLive d-flex flex-row justify-content-center justify-content-sm-center justify-content-md-center justify-content-lg-end'>
        <img src={logoLive} alt="TikTok Live" />
      </div>
      <div className='col-12 col-sm-12 col-md-12 col-lg-6 col-xl-6 col-xxl-6 imagecontainer logoSoonContainer mb-5'>
        <img src={tiktokCopaLiveLogo} alt="Logo TikTok Copa Live" />
      </div>
      <div className='col-12 col-sm-12 col-md-12 col-lg-6 col-xl-6 col-xxl-6 imagecontainer soonContainer ps-5 pe-5'>
        <img src={Soon} alt="Coming Soon" />
      </div>
    </>
  )
}

export default ComingSoon
