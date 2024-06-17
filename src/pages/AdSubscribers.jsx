
import React, { useEffect, useState } from 'react';
import { firestore } from '../components/firebase';
import { getDocs, collection } from '@firebase/firestore';
import '../styles/sidebar.css';
import '../styles/Adincubatee.css';
import Sidebar from '../components/sidebar';

function AdSubscribers() {
  const [Subs, setSubs] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const ref = collection(firestore, 'Subscribers');
      try {
        const querySnapshot = await getDocs(ref);
        const newData = querySnapshot.docs.map(doc => doc.data());
        setSubs(newData);
      } catch (error) {
        console.error('Error fetching documents: ', error);
      }
    };

    fetchData();
  }, []);

  const handleComposeEmail = () => {
    const recipients = Subs.map(sub => sub.email).join(',');
    const subject = 'Your Subject Here'; // Set your email subject here
    const body = 'Your email body text here'; // Set your email body here

    // Constructing mailto link
    const mailtoLink = `mailto:${recipients}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

    // Open the mail client with the mailto link
    window.open(mailtoLink);
  };

  return (
    <div className='ExtendedAnnouncements'>
      <div className='side'>
        <Sidebar></Sidebar>
      </div>
      <div className='incubateelist'>
        <h1>SUBSCRIBERS</h1>
        <div className='table-container'>
          <table className='data-table'>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Apply Date</th>
              </tr>
            </thead>
            <tbody>
              {Subs.map((sub, index) => (
                <tr key={index}>
                  <td>{sub.name}</td>
                  <td>{sub.email}</td>
                  <td>{sub.day + '/' + sub.month + '/' + sub.year}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <button className='mail-icon' onClick={handleComposeEmail}>
          <svg
            xmlns='http://www.w3.org/2000/svg'
            width='24'
            height='24'
            viewBox='0 0 24 24'
            fill='none'
            stroke='currentColor'
            strokeWidth='2'
            strokeLinecap='round'
            strokeLinejoin='round'
            className='feather feather-mail'
          >
            <path d='M3 6l9 6 9-6' />
            <path d='M21 8l-9 5-9-5' />
            <path d='M21 12l-9 5-9-5' />
            <path d='M21 16l-9 5-9-5' />
          </svg>
          Compose Email
        </button>
      </div>
    </div>
  );
}

export default AdSubscribers;

