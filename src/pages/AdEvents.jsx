import React, { useEffect, useState, useRef } from 'react';
import Sidebar from '../components/sidebar';
import "../styles/sidebar.css";
import { firestore, storage } from '../components/firebase';
import { getDocs, collection, deleteDoc, query, where, doc, updateDoc, addDoc } from '@firebase/firestore';
import { ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';
import { v4 as uuidv4 } from 'uuid';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faPencilAlt } from '@fortawesome/free-solid-svg-icons';
import '../styles/admin.css';

const AdEvents = () => {
    const [isAddPopupOpen, setIsAddPopupOpen] = useState(false);
    const [isEditPopupOpen, setIsEditPopupOpen] = useState(false);
    const [url, setUrl] = useState('');
    const [imageUpload, setImageUpload] = useState(null);
    const [numDocuments, setNumDocuments] = useState(0);
    const [Events, setEvents] = useState([]);
    const [existingData, setExistingData] = useState(null);
    const [file, setFile] = useState(null);

    const DateRef2 = useRef();
    const NameRef2 = useRef();
    const ReglinkRef2 = useRef();
    const VenueRef2 = useRef();
    const descRef2 = useRef();

    const DateRef = useRef();
    const NameRef = useRef();
    const ReglinkRef = useRef();
    const VenueRef = useRef();
    const descRef = useRef();

    const uploadImage = () => {
        if (!imageUpload) {
            alert('Please select a file.');
            return;
        }

        const uniqueFilename = uuidv4() + '-' + imageUpload.name;
        const imageRef = storageRef(storage, `EventData/${uniqueFilename}`);

        uploadBytes(imageRef, imageUpload)
            .then(() => {
                alert('Image uploaded successfully');
                getDownloadURL(imageRef)
                    .then((downloadUrl) => {
                        setUrl(downloadUrl);
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
                setImageUpload(null);
            });
    };

    const fetchNumDocuments = async () => {
        try {
            const querySnapshot = await getDocs(collection(firestore, "Events"));
            setNumDocuments(querySnapshot.size);
        } catch (error) {
            console.error("Error getting documents: ", error);
        }
    };

    useEffect(() => {
        fetchNumDocuments();
    }, []);

    const handleSubmitAdd = async (e) => {
        e.preventDefault();
        fetchNumDocuments();
        const data = {
            Date: new Date(DateRef2.current.value),
            Name: NameRef2.current.value,
            Reglink: ReglinkRef2.current.value,
            Venue: VenueRef2.current.value,
            desc: descRef2.current.value,
            imglink: url,
        };

        try {
            await addDoc(collection(firestore, "Events"), data);
            alert("Event added successfully");
            setIsAddPopupOpen(false);
            fetchData();
        } catch (error) {
            console.error("Error adding document: ", error);
            alert("Failed to add event");
        }
    };

    const toggleAddPopup = () => {
        setIsAddPopupOpen(!isAddPopupOpen);
    };

    const closeAddPopup = () => {
        setIsAddPopupOpen(false);
    };

    const closeEditPopup = () => {
        setIsEditPopupOpen(false);
        setExistingData(null);
    };

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const fetchData = async () => {
        try {
            const ref = collection(firestore, 'Events');
            const querySnapshot = await getDocs(ref);
            const newData = querySnapshot.docs.map(doc => doc.data());
            setEvents(newData);
        } catch (error) {
            console.error('Error fetching documents', error);
            alert("Failed to fetch events");
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleApply = (eve) => {
        setExistingData(eve);
        setIsEditPopupOpen(true);
        window.scrollTo(0, 0);
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            const q = query(collection(firestore, "Events"), where("desc", "==", existingData.desc));
            const querySnapshot = await getDocs(q);

            querySnapshot.forEach(async (document) => {
                const docRef = doc(firestore, "Events", document.id);
                const newData = {
                    Date: new Date(DateRef.current.value),
                    Name: NameRef.current.value,
                    Reglink: ReglinkRef.current.value,
                    Venue: VenueRef.current.value,
                    desc: descRef.current.value,
                    imglink: existingData.imglink,
                };
                if (file) {
                    const storageReff = storageRef(storage, 'EventData/' + file.name);
                    await uploadBytes(storageReff, file);
                    newData.imglink = await getDownloadURL(storageReff);
                }
                await updateDoc(docRef, newData);
                alert("Event updated successfully");
                closeEditPopup();
                fetchData();
            });
        } catch (error) {
            console.error("Error updating event: ", error);
            alert("Failed to update event");
        }
    };

    const handleDelete = async (id) => {
        try {
            const q = query(collection(firestore, "Events"), where("Name", "==", id));
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

    return (
        <>
            <div className='annmain'>
                <div className='side'>
                    <Sidebar />
                </div>
                <div className='wholebody'>
                    <div className='Announcement_list'>
                        <h1 className='head1'>Events</h1>
                        <div className='ra'>
                            <button className='btn2' onClick={toggleAddPopup}>Add</button>
                        </div>
                        {isAddPopupOpen && (
                            <div className="popup">
                                <div className="popup-inner">
                                    <button className="close-btn" onClick={closeAddPopup}>Close</button>
                                    <form onSubmit={handleSubmitAdd}>
                                        <label>Date</label>
                                        <input type="date" ref={DateRef2} />
                                        <label>Name</label>
                                        <textarea ref={NameRef2}></textarea>
                                        <label>Reglink</label>
                                        <input type="text" ref={ReglinkRef2} />
                                        <label>Venue</label>
                                        <input type="text" ref={VenueRef2} />
                                        <label>Description</label>
                                        <input type="text" ref={descRef2} />
                                        <input type="file" id="file-upload" onChange={(event) => setImageUpload(event.target.files[0])} />
                                        <div className="button-group">
                                            <button type="button" className="cancel-btn" onClick={closeAddPopup}>Cancel</button>
                                            <button type="button" className="upload-btn" onClick={uploadImage}>Upload</button>
                                            <label className="label">Upload file before clicking on add </label>
                                        </div>
                                        <button type='submit' className='add'>Add</button>
                                    </form>
                                </div>
                            </div>
                        )}
                        <table>
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Description</th>
                                    <th>Venue</th>
                                    <th>Date</th>
                                    <th>Time</th>
                                    <th>Registration Link</th>
                                    <th>Image</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {Events.map((eve, index) => (
                                    <tr key={index}>
                                        <td>{eve.Name}</td>
                                        <td>{eve.desc}</td>
                                        <td>{eve.Venue}</td>
                                        <td>{eve.Date.toDate().toLocaleDateString()}</td>
                                        <td>{eve.Date.toDate().toLocaleTimeString()}</td>
                                        <td>{eve.Reglink && <a style={{ color: "blue" }} href={eve.Reglink}>Register Here</a>}</td>
                                        <td><img src={eve.imglink} alt="Event" style={{ width: '100px' }} /></td>
                                        <td>
                                            <FontAwesomeIcon icon={faTrash} className='icon1' onClick={() => handleDelete(eve.Name)} />
                                            <FontAwesomeIcon icon={faPencilAlt} className='icon2' onClick={() => handleApply(eve)} />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {existingData && isEditPopupOpen && (
                            <div className="popup">
                                <div className="popup-inner">
                                    <button className="close-btn" onClick={closeEditPopup}>Close</button>
                                    <form onSubmit={handleUpdate}>
                                        <label>Date</label>
                                        <input type="date" ref={DateRef} defaultValue={new Date(existingData.Date.seconds * 1000).toISOString().split('T')[0]} />
                                        <label>Name</label>
                                        <textarea ref={NameRef} defaultValue={existingData.Name}></textarea>
                                        <label>Reglink</label>
                                        <input type="text" ref={ReglinkRef} defaultValue={existingData.Reglink} />
                                        <label>Venue</label>
                                        <input type="text" ref={VenueRef} defaultValue={existingData.Venue} />
                                        <label>Description</label>
                                        <input type="text" ref={descRef} defaultValue={existingData.desc} />
                                        <input type="file" id="file-upload" onChange={handleFileChange} />
                                        <div className="button-group">
                                            <button type="button" className="cancel-btn" onClick={closeEditPopup}>Cancel</button>
                                            <button type="submit" className="update-btn">Update</button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};

export default AdEvents;
