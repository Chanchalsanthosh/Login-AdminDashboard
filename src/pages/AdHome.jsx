import React from 'react';
import Sidebar from '../components/sidebar';
import "../styles/sidebar.css";
import Visitorcount from '../components/visitorcount';
import "../styles/visitcount.css";
import "../styles/home.css";
import Chart from "../components/chart";
import "../styles/chart.css";


const AdHome = () => {
  return (
    <div id='adminhome'>
    <div className='sides'>
      <Sidebar/>
    </div>
    <div className='visit'>
      <Visitorcount/>
      <Chart />
    </div>
    </div>
  )
}

export default AdHome
