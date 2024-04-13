import React from 'react';
import { FaChalkboardTeacher} from "react-icons/fa";
import { FaBuildingUser } from "react-icons/fa6";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
 import { faBullhorn,faNewspaper,faCalendarDays} from '@fortawesome/free-solid-svg-icons';
 
const visitorcount = () => {
  return (
    <div className="visitcount">
        <div className="vcard">

        <div className='icons'><FontAwesomeIcon icon={faBullhorn} /></div>
          <div class="content">
           <h4>Announcements</h4>
            <p>3</p>
            </div>
        </div>


        <div className="vcard">
        <div className="icons"><FontAwesomeIcon icon={faCalendarDays}/></div>
        <div class="content">
           <h4>Events</h4>
            <p>3</p>
            </div>
        </div>
        <div className="vcard">
        <div className="icons"> <FontAwesomeIcon icon={faNewspaper}/></div>
        <div class="content">
           <h4>Blogs</h4>
            <p>3</p>
            </div>
        </div>
        <div className="vcard">
        <div className="icons">  <FaBuildingUser /></div>
        <div class="content">
           <h4>Companies</h4>
            <p> 3</p>
            </div>
        </div>
        <div className="vcard">
        <div className="icons"> <FaChalkboardTeacher /></div>
        <div class="content">
           <h4>Mentors</h4>
            <p> 3</p>
        </div>
        </div>
       
      
    </div>
  )
}

export default visitorcount
