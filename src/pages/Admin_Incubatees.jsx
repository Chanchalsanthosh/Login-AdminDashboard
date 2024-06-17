import React,{ useEffect, useState } from 'react'
import { firestore, storage } from '../components/firebase';
import {getDocs,collection,query,where,orderBy} from '@firebase/firestore';
import Sidebar from '../components/sidebar';
import "../styles/sidebar.css";
import "../styles/Adincubatee.css";
function Admin_Incubatees(){
  let [Incs,setIncs]=useState([]);
  useEffect(() => {
        const fetchData = async () => {
            const ref = collection(firestore, 'Incubatees');
            try {
                const q = query(ref, orderBy('year', 'desc'), orderBy('month', 'desc'));
                const querySnapshot = await getDocs(ref);
                const newData = querySnapshot.docs.map(doc => doc.data()
                );
                
                setIncs(newData);
                console.log(Incs);
            } catch (error) {
                console.error('Error fetching documents: ', error);
            }
        };

        fetchData();
    }, );
  
  return (
    <div className='ExtendedAnnouncements'>
      <div className='side'>
        <Sidebar></Sidebar>
      </div>
    
     <div className='incubateelist'>
     <h1>INCUBATEES</h1>
     <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Abstract</th>
              <th>Email</th>
              <th>Phone no</th>
              
            </tr>
          </thead>
          <tbody>
            {Incs.map((inc, index) => (
              <tr key={index}>
                <td>{inc.name}</td>
                <td>{inc.abstract}</td>
                <td>{inc.email}</td>
                <td>{inc.phone_number}</td>
                
              </tr>
            ))}
          </tbody>
        </table>
      </div>
            </div>
     
    </div> 
  )
}

export default Admin_Incubatees;


/*{Incs.map((inc, index) => (
  <div className='ViewApplicant' key={index}>
      <h1>Name: {inc.name}</h1>
      <p>Abstract: {inc.abstract}</p>
      <p>Email: {inc.email}</p>
      <p>Phone no: {inc.phone_number}</p>
      {inc.filelink && <p><a href={inc.filelink}>Proposal</a></p>}


  </div>
))}*/