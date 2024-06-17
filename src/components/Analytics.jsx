import React from 'react'
import { firestore } from './firebase';
import {getDocs,collection} from '@firebase/firestore'
import { useEffect,useState } from 'react';
function Analytics(){
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
                setEventCount[temp_count];
                console.log(EventCount);
                 querySnapshot = await getDocs(BlogRef);
                 newData = querySnapshot.docs.map(doc => doc.data()
                );
                 temp_count=newData.length;
                setBlogCount[temp_count];
                console.log(BlogCount);
                 querySnapshot = await getDocs(IncubatorRef);
                 newData = querySnapshot.docs.map(doc => doc.data()
                );
                 temp_count=newData.length;
                setIncubateeCount[temp_count];
                console.log(incubatorCount);
                 querySnapshot = await getDocs(subRef);
                 newData = querySnapshot.docs.map(doc => doc.data()
                );
                 temp_count=newData.length;
                 setSubscribersCount[temp_count];
                console.log(subscribersCount);
            } catch (error) {
                console.error('Error fetching documents: ', error);
            }
        };

        fetchData();
    }, []);

    return(
        <>
        <div>
            <h1>Announcements: {AnnCount}</h1>
            <h1>Blogs: {BlogCount}</h1>
            <h1>Events: {EventCount}</h1>
            <h1>Incubatees: {incubatorCount}</h1>
            <h1>subscribers: {subscribersCount}</h1>
            
           

        </div>
        </>
    )
}

export default Analytics;