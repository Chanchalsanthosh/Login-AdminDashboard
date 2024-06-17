import React from 'react';
import { FaChalkboardTeacher} from "react-icons/fa";
import { FaBuildingUser } from "react-icons/fa6";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
 import { faBullhorn,faNewspaper,faCalendarDays} from '@fortawesome/free-solid-svg-icons';
 import { firestore } from './firebase';
import {getDocs,collection} from '@firebase/firestore'
import { useEffect,useState } from 'react';
 
const Visitorcount = () => {
  const [AnnCount,setAnnCount]=useState(0);
  const [EventCount,setEventCount]=useState(0);
  const [BlogCount,setBlogCount]=useState(0);
  const [incubatorCount,setIncubateeCount]=useState(0);
  const [subscribersCount,setSubscribersCount]=useState(0);
  useEffect(() => {
      const fetchData = async () => {
          const AnnRef = collection(firestore, 'Announcements');
          const BlogRef = collection(firestore, 'Blogs');
          const EventRef = collection(firestore, 'Events');
          const IncubatorRef = collection(firestore, 'Incubatees');
          const subRef = collection(firestore, 'Subscribers');
          try {
              let querySnapshot = await getDocs(AnnRef);
              let newData1 = querySnapshot.docs.map(doc => doc.data()
              );
              let temp_count1=newData1.length;
              setAnnCount(temp_count1);
              console.log(AnnCount);
               querySnapshot = await getDocs(EventRef);
               let newData = querySnapshot.docs.map(doc => doc.data()
              );
               let temp_count=newData.length;
              setEventCount(temp_count);
              console.log(EventCount);
               querySnapshot = await getDocs(BlogRef);
               newData = querySnapshot.docs.map(doc => doc.data()
              );
               temp_count=newData.length;
              setBlogCount(temp_count);
              console.log(BlogCount);
               querySnapshot = await getDocs(IncubatorRef);
               newData = querySnapshot.docs.map(doc => doc.data()
              );
               temp_count=newData.length;
              setIncubateeCount(temp_count);
              console.log(incubatorCount);
               querySnapshot = await getDocs(subRef);
               newData = querySnapshot.docs.map(doc => doc.data()
              );
               temp_count=newData.length;
               setSubscribersCount(temp_count);
              console.log(subscribersCount);
          } catch (error) {
              console.error('Error fetching documents: ', error);
          }
      };

      fetchData();
  }, []);

  return (
    <div className="visitcount">
        <div className="vcard">

        <div className='icons'><FontAwesomeIcon icon={faBullhorn} /></div>
          <div class="content">
           <h4>Announcements</h4>
            <p>{AnnCount}</p>
            </div>
        </div>


        <div className="vcard">
        <div className="icons"><FontAwesomeIcon icon={faCalendarDays}/></div>
        <div class="content">
           <h4>Events</h4>
            <p>{EventCount}</p>
            </div>
        </div>
        <div className="vcard">
        <div className="icons"> <FontAwesomeIcon icon={faNewspaper}/></div>
        <div class="content">
           <h4>Blogs</h4>
            <p>{BlogCount}</p>
            </div>
        </div>
        <div className="vcard">
        <div className="icons">  <FaBuildingUser /></div>
        <div class="content">
           <h4>Incubators</h4>
            <p>{incubatorCount}</p>
            </div>
        </div>
        <div className="vcard">
        <div className="icons"> <FaChalkboardTeacher /></div>
        <div class="content">
           <h4>Subscribers</h4>
            <p>{subscribersCount}</p>
        </div>
        </div>
       
      
    </div>
  )
}

export default Visitorcount
