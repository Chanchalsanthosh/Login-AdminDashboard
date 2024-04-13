import React from 'react'
 import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
 import { faImage ,faBullhorn,faChalkboardTeacher,faNewspaper,faBuildingUser,faCalendarDays,faChartSimple} from '@fortawesome/free-solid-svg-icons';
 import { Link } from 'react-router-dom';
 import { IoSchool } from "react-icons/io5";
 import { BiLogOut } from "react-icons/bi"; 
function Sidebar({openSidebarToggle, OpenSidebar}) {
  return (
    <div className='wholeside'>
    <aside id="sidebar" className={openSidebarToggle ? "sidebar-responsive": ""}>
        <div className='sidebar-title'>
            <div className='sidebar-brand'>
                <img src="logo.jpg"alt=""/><h1 className='tbi'>TBI GEC</h1> 
            </div>
            <span className='icon close_icon' onClick={OpenSidebar}>X</span>
        </div>

        <ul className='sidebar-list'>
            <li className='sidebar-list-item'>
            <FontAwesomeIcon icon={faImage}style={{ color: 'rgb(87 13 147)' }}/>
            <Link to="/adgallery">Gallery</Link>
            </li>
            <li className='sidebar-list-item'>
              <FontAwesomeIcon icon={faBullhorn} style={{ color: 'rgb(87 13 147)' }}/>
                <Link to="/adannounce">Announcement
                </Link>
               
                
            </li>
            <li className='sidebar-list-item'>
            <IoSchool icon={faChalkboardTeacher} style={{ color: 'rgb(87 13 147)' }} />
            <Link to="/adstartup"> 
                
                 Start-Up School
                </Link>
            </li>
            <li className='sidebar-list-item'>
            <FontAwesomeIcon icon={faNewspaper} style={{ color: 'rgb(87 13 147)' }} /> 
            <Link to="/adblogs">
                        Blogs
                        </Link>
            </li>
            <li className='sidebar-list-item'>
            <FontAwesomeIcon icon={faBuildingUser} style={{ color: 'rgb(87 13 147)' }}/>
            <Link to="/adcompanies">
                 Companies
                 </Link>
            </li>
            <li className='sidebar-list-item'>
            <FontAwesomeIcon icon={faCalendarDays} style={{ color: 'rgb(87 13 147)' }}/>
            <Link to="/adevents">
                Events
                </Link>
            </li>
            <li className='sidebar-list-item'>
            <FontAwesomeIcon icon={faChartSimple}  style={{ color: 'rgb(87 13 147)' }}/>
             <Link to="/adhome">
                 Statistics
                 </Link>
            </li>
            <li className='sidebar-list-item'>
            <FontAwesomeIcon icon={faChalkboardTeacher}  style={{ color: 'rgb(87 13 147)' }}/>
             <Link to="/admentor">
                 Mentor
                 </Link>
            </li>
            <li className='sidebar-list-item'>
            <BiLogOut icon={faChartSimple}  style={{ color: 'rgb(87 13 147)' }}/>
             <Link to="/logout">
                 Logout
                 </Link>
            </li>
        </ul>
    </aside>
    </div>
  )
}

export default Sidebar;