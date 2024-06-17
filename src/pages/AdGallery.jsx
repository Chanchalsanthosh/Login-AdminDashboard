import React from 'react';
import Sidebar from '../components/sidebar';
import "../styles/sidebar.css"
import Adgallery from "../components/Admin_Gallery";
import "../styles/Adgallery.css";
import "../styles/Admin_gallery.css";

const AdGallery = () => {
  return (
   <div id="gallery">
    <div className='gside'>
      <Sidebar/>
    </div>
    <div className='gleft'>
    <Adgallery/>
    </div>
    </div> 
  )
}

export default AdGallery
