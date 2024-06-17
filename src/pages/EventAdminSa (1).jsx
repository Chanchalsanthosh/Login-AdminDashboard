import React, { useEffect, useState, useRef } from 'react';
import { firestore, storage } from '../components/firebase';  // Ensure correct imports
import { getDocs, collection, deleteDoc, query, where, doc, updateDoc, addDoc } from '@firebase/firestore';
import { ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';
import { v4 as uuidv4 } from 'uuid';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faPencilAlt } from '@fortawesome/free-solid-svg-icons';
import { Timestamp } from '@firebase/firestore';
import Sidebar from '../components/sidebar';
import "../styles/sidebar.css";
function Admin_Events() {
    const [isUpdatePopupOpen, setIsUpdatePopupOpen] = useState(false);
    const [isAddPopupOpen, setIsAddPopupOpen] = useState(false);
    const [dateedit,setDateEdit]=useState(false)
    const [selectedDate, setSelectedDate] = useState('');
    const [selectedTime, setSelectedTime] = useState('');
    const [Name, setName] = useState('');
    const [Reglink, setReglink] = useState('');
    const [Venue, setVenue] = useState('');
    const [desc, setDesc] = useState('');
    const [selectedFile, setSelectedFile] = useState(null);
    const [url, setUrl] = useState('');
    const [existingData, setExistingData] = useState(null); // State to hold existing data for update

    const uploadImage = () => {
        if (!selectedFile) {
            alert('Please select a file.');
            return;
        }

        const uniqueFilename = uuidv4() + '-' + selectedFile.name;
        const imageRef = storageRef(storage, `EventData/${uniqueFilename}`);

        uploadBytes(imageRef, selectedFile)
            .then(() => {
                alert('Image uploaded successfully');
                getDownloadURL(imageRef)
                    .then((downloadUrl) => {
                        setUrl(downloadUrl); // Set URL here
                    })
                    .catch((error) => {
                        console.error('Error getting download URL:', error);
                    });
            })
            .catch((error) => {
                console.error('Error uploading image:', error);
                alert('Error uploading image. Please try again.');
            })
            .finally(() => {
                setSelectedFile(null); // Reset the state after upload
            });
    };

    const handleSubmitAdd = async (e) => {
        e.preventDefault();
        if (!selectedDate || !selectedTime || !Name ||   !Venue || !desc ) {
            alert('Please fill in all required fields (Date,Time,Name,Venue');
            return;
        }

        const dateTimeString = `${selectedDate}T${selectedTime}`;
        const timestamp = Timestamp.fromDate(new Date(dateTimeString));

        const data = {
            Date: timestamp,
            Name: Name,
            Reglink: Reglink,
            Venue: Venue,
            desc: desc,
            imglink: url,
        };

        try {
            await addDoc(collection(firestore, "Events"), data);
            alert("Event added successfully");
            fetchData(); // Update events list after adding
            resetForm(); // Reset form fields
        } catch (error) {
            console.error("Error adding document: ", error);
            alert("Failed to add Event");
        }
    };

    const resetForm = () => {
        setSelectedDate('');
        setSelectedTime('');
        setName('');
        setReglink('');
        setVenue('');
        setDesc('');
        setUrl('');
        setDateEdit(false);
        setSelectedFile(null)
    };

    const changeDate = () =>{
        setDateEdit(true)
    }


    const toggleUpdatePopup = async (event) => {
        try {
            if (event) {
                setExistingData(event); // Set existing data first
            } else {
                throw new Error('Event parameter is null or undefined.');
            }
        } catch (error) {
            console.error(error);
            return;
        }
    };
    
    // useEffect to handle applying changes after existingData is set
    useEffect(() => {
        if (existingData) {
            handleApply();
        }
    }, [existingData]);
    
    const handleApply = () => {
        try {
            if (existingData && existingData.Date) {
                console.log(existingData.Date); // Log existing data for confirmation
                setIsUpdatePopupOpen(true); // Toggle update form visibility
                window.scrollTo(0, 0);
                setName(existingData.Name);
                setReglink(existingData.Reglink);
                setDesc(existingData.desc);
                setUrl(existingData.imglink);
                setVenue(existingData.Venue);

            } else {
                throw new Error('existingData or existingData.Date is null or undefined.');
            }
        } catch (error) {
            console.error(error);
        }
    }

    const handleUpdateCancel=()=>{
        console.log("update cancelled")
        setIsUpdatePopupOpen(false);
        setIsAddPopupOpen(false);
        setDateEdit(false)
        setExistingData(null)
    }
    const handleUpdateClose=()=>{
        console.log("update closed")
        setIsUpdatePopupOpen(false);
        setIsAddPopupOpen(false);
        setDateEdit(false)
        setExistingData(null)
    }
    const handleAddClose=()=>{
        console.log("add closed")
        setIsAddPopupOpen(false)
        setIsUpdatePopupOpen(false);
        setDateEdit(false)
    }

    const handleAddCancel=()=>{
        console.log("add cancelled")
        setIsAddPopupOpen(false)
        setIsUpdatePopupOpen(false);
        setDateEdit(false)
    }
    
    const [Events, setEvents] = useState([]);

    const fetchData = async () => {
        try {
            const ref = collection(firestore, 'Events');
            const querySnapshot = await getDocs(ref);
            const newData = querySnapshot.docs.map(doc => {
                const data = doc.data();
                const eventDate = data.Date.toDate(); // Convert Firestore timestamp to JavaScript Date
            const formattedDate = eventDate.toLocaleDateString(); // Format date
            const formattedTime = eventDate.toLocaleTimeString(); // Format time
                return {
                    ...data,
                    Date: `${formattedDate} ${formattedTime}`, // Convert Firestore timestamp to Date and format
                };
            });
            setEvents(newData);
        } catch (error) {
            console.error('Error fetching documents', error);
            alert("Failed to fetch Events");
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleDelete = async (id,d) => {
        try {
            const q = query(collection(firestore, "Events"), where("Name", "==", id ),where("desc","==",d));
            const querySnapshot = await getDocs(q);

            querySnapshot.forEach(async (doc) => {
                await deleteDoc(doc.ref);
            });

            alert("Event deleted successfully");
            fetchData();
        } catch (error) {
            console.error("Error deleting event: ", error);
            alert("Failed to delete event");
        }
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            const q = query(collection(firestore, "Events"), where("Name", "==", existingData.Name));
            const querySnapshot = await getDocs(q);

            querySnapshot.forEach(async (document) => {
                const docRef = doc(firestore, "Events", document.id);
                let newData={}
                if (dateedit){
                    newData = {
                        Date: Timestamp.fromDate(new Date(selectedDate + 'T' + selectedTime)),
                        Name: Name,
                        Reglink: Reglink,
                        Venue: Venue,
                        desc: desc,
                        imglink: existingData.imglink,
                    };
                }
                else{
                     newData = {
                        
                        Name: Name,
                        Reglink: Reglink,
                        Venue: Venue,
                        desc: desc,
                        imglink: existingData.imglink,
                    };

                }
                

                if (selectedFile) {
                    const storageReff = storageRef(storage, 'EventData/' + selectedFile.name);
                    await uploadBytes(storageReff, selectedFile);
                    newData.imglink = await getDownloadURL(storageReff);
                }

                await updateDoc(docRef, newData);
                alert("Event updated successfully");
                setExistingData(null); // Reset existing data state
                setSelectedFile(null); // Reset selected file state
                setDateEdit(false);
                setIsUpdatePopupOpen(false); // Close update popup after update
                fetchData(); // Update events list after updating
            });
        } catch (error) {
            console.error("Error updating Event: ", error);
            alert("Failed to update Event");
        }
    };
    

    return (
        <>
            <div className='annmain'>
                <div className='side'>
                    <Sidebar></Sidebar>
                </div>
                <div className='wholebody'>
                    <div className='Announcement_list'>
                        <h1 className='head1'>Events</h1>

                        <div className='ra'>
                            <button className='btn2' onClick={() => setIsAddPopupOpen(true)}>Add</button>
                        </div>
                        {isUpdatePopupOpen && (
                            <div className="popup">
                                <div className="popup-inner">
                                    <button className="close-btn" onClick={() => handleUpdateClose()}>Close</button>
                                    <form onSubmit={handleUpdate}>
                                        <label>Date</label>
                                        {!dateedit && existingData &&<p>{existingData.Date}</p>}
                                        {!dateedit && <FontAwesomeIcon icon={faPencilAlt} className='icon3' onClick={() => changeDate()} />}
                                        {dateedit && <input type="date"  onChange={(e) => setSelectedDate(e.target.value)} />}
                                        {dateedit && <input type="time"  onChange={(e) => setSelectedTime(e.target.value)} />}
                                        <label>Name</label>
                                        {existingData &&<textarea defaultValue={existingData.Name} onChange={(e) => setName(e.target.value)}></textarea>}
                                        <label>Reglink</label>
                                        {existingData &&<input type="text" defaultValue={existingData.Reglink}  onChange={(e) => setReglink(e.target.value)} />}
                                        <label>Venue</label>
                                        {existingData &&<input type="text" defaultValue={existingData.Venue} onChange={(e) => setVenue(e.target.value)} />}
                                        <label>Description</label>
                                        {existingData &&<input type="text" defaultValue={existingData.desc} onChange={(e) => setDesc(e.target.value)} />}

                                        {existingData &&<input type="file" id="file-upload" onChange={(event) => setSelectedFile(event.target.files[0])} />}
                                        <div className="button-group">
                                            <button type="button" className="cancel-btn" onClick={() => handleUpdateCancel()}>Cancel</button>
                                            <button type="submit" className="update-btn">Update</button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        )}
                        {isAddPopupOpen && (
                            <div className="popup">
                                <div className="popup-inner">
                                    <button className="close-btn" onClick={() => handleAddClose()}>Close</button>
                                    <form onSubmit={handleSubmitAdd}>
                                        <label>Date</label>
                                        <input type="date" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} />
                                        <label>Time</label>
                                        <input type="time" value={selectedTime} onChange={(e) => setSelectedTime(e.target.value)} />
                                        <label>Name</label>
                                        <textarea  onChange={(e) => setName(e.target.value)}></textarea>
                                        <label>Reglink</label>
                                        <input type="text"  onChange={(e) => setReglink(e.target.value)} />
                                        <label>Venue</label>
                                        <input type="text"  onChange={(e) => setVenue(e.target.value)} />
                                        <label>Description</label>
                                        <input type="text"  onChange={(e) => setDesc(e.target.value)} />

                                        <input type="file" id="file-upload" onChange={(event) => setSelectedFile(event.target.files[0])} />
                                        
                                        <div className="button-group">
                                        <button type="button" className="cancel-btn" onClick={() => handleAddCancel()}>Cancel</button>
                                        <button type="button" className="upload-btn" onClick={uploadImage}>Upload</button>
                                        <label className="label">Upload file before clicking on add </label>
                                    </div>
                                    <button type='submit' className='add'>Add</button>
                                    </form>
                                </div>
                            </div>
                        )}
                        <table className="events-table">
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Description</th>
                                    <th>Venue</th>
                                    <th>Time</th>
                                    <th>Register Link</th>
                                    <th>Image</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {Events.map((eve, index) => (
                                    <tr key={index}>
                                        <td>{eve.Name}</td>
                                        <td>{eve.desc}</td>
                                        <td>{eve.Venue}</td>
                                        <td>{eve.Date}</td>
                                        <td>{eve.Reglink && <a style={{ color: "blue" }} href={eve.Reglink}>Register Here</a>}</td>
                                        <td><img src={eve.imglink} alt="Event" className="event-image" /></td>
                                        <td>
                                            <FontAwesomeIcon icon={faTrash} className='icon1' onClick={() => handleDelete(eve.Name,eve.desc)} />
                                            <FontAwesomeIcon icon={faPencilAlt} className='icon2' onClick={() => toggleUpdatePopup(eve)} />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Admin_Events;

                                           
