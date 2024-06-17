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

function AdAnnouncemnts() {
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [isEditPopupOpen, setIsEditPopupOpen] = useState(false);
    const [title, setTitle] = useState('');
    const [body, setBody] = useState('');
    const [selectedFile, setSelectedFile] = useState(null);
    const [url, setUrl] = useState('');
    const [imageUpload, setImageUpload] = useState(null);
    const [numDocuments, setNumDocuments] = useState(0);
    const TitleRef2 = useRef();
    const bodyRef2 = useRef();
    const TitleRef = useRef();
    const bodyRef = useRef();
    const fileRef = useRef();
    const [Anns, setAnns] = useState([]);
    const [existingData, setExistingData] = useState(null);
    const [file, setFile] = useState(null);

    const uploadImage = () => {
        if (!imageUpload) {
            alert('Please select a file.');
            return;
        }

        const uniqueFilename = uuidv4() + '-' + imageUpload.name;
        const imageRef = storageRef(storage, `AnnouncementData/${uniqueFilename}`);

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
            const querySnapshot = await getDocs(collection(firestore, "Announcements"));
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
            Title: TitleRef2.current.value,
            body: bodyRef2.current.value,
            id: numDocuments + 1,
            filelink: url,
        };

        try {
            await addDoc(collection(firestore, "Announcements"), data);
            alert("Announcement added successfully");
            setIsPopupOpen(false); // Close the popup after adding
            fetchData(); // Refresh the data
        } catch (error) {
            console.error("Error adding document: ", error);
            alert("Failed to add announcement");
        }
    };

    const togglePopup = () => {
        setIsPopupOpen(!isPopupOpen);
    };

    const closePopup = () => {
        setIsPopupOpen(false);
        setExistingData(null);
    };

    const closeEditPopup = () => {
        setIsEditPopupOpen(false);
        setExistingData(null);
    };

    const handleTitleChange = (e) => {
        setTitle(e.target.value);
    };

    const handleBodyChange = (e) => {
        setBody(e.target.value);
    };

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const fetchData = async () => {
        try {
            const ref = collection(firestore, 'Announcements');
            const querySnapshot = await getDocs(ref);
            const newData = querySnapshot.docs.map(doc => doc.data());
            const sortedData = newData.sort((a, b) => b.id - a.id);
            setAnns(sortedData);
        } catch (error) {
            console.error('Error fetching documents', error);
            alert("Failed to fetch announcements");
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleApply = (ann) => {
        setExistingData(ann);
        setIsEditPopupOpen(true);
        window.scrollTo(0, 0);
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            const q = query(collection(firestore, "Announcements"), where("id", "==", existingData.id));
            const querySnapshot = await getDocs(q);

            querySnapshot.forEach(async (document) => {
                const docRef = doc(firestore, "Announcements", document.id);
                const newData = {
                    Title: TitleRef.current.value,
                    body: bodyRef.current.value,
                    filelink: existingData.filelink,
                };
                if (file) {
                    const storageReff = storageRef(storage, 'AnnouncementData/' + file.name);
                    await uploadBytes(storageReff, file);
                    newData.filelink = await getDownloadURL(storageReff);
                }
                await updateDoc(docRef, newData);
                alert("Announcement updated successfully");
                closeEditPopup();
                fetchData();
            });
        } catch (error) {
            console.error("Error updating announcement: ", error);
            alert("Failed to update announcement");
        }
    };

    const handleDelete = async (id) => {
        try {
            const q = query(collection(firestore, "Announcements"), where("id", "==", id));
            const querySnapshot = await getDocs(q);

            querySnapshot.forEach(async (doc) => {
                await deleteDoc(doc.ref);
            });

            alert("Announcement deleted successfully");
            const annRef = collection(firestore, "Announcements");
            const querySnapshot2 = await getDocs(query(annRef, where("id", ">", id)));
            querySnapshot2.docs.map(doc => {
                const docRef = doc(firestore, "Announcements", doc.id);
                const updatedId = doc.data().id - 1;
                return updateDoc(docRef, { id: updatedId });
            });
            fetchData();
        } catch (error) {
            console.error("Error deleting announcement: ", error);
            alert("Failed to delete announcement");
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
                        <h1 className='head1'>Announcements</h1>
                        <div className='ra'>
                            <button className='btn2' onClick={togglePopup}>Add</button>
                        </div>
                        {isPopupOpen && (
                            <div className="popup">
                                <div className="popup-inner">
                                    <button className="close-btn" onClick={closePopup}>Close</button>
                                    <form onSubmit={handleSubmitAdd}>
                                        <label>Title</label>
                                        <input type="text" ref={TitleRef2} />
                                        <label>Body</label>
                                        <textarea ref={bodyRef2}></textarea>
                                        <input type="file" id="file-upload" onChange={(event) => setImageUpload(event.target.files[0])} />
                                        <div className="button-group">
                                            <button type="button" className="cancel-btn" onClick={closePopup}>Cancel</button>
                                            <button type="button" className="upload-btn" onClick={uploadImage}>Upload</button>
                                            <label className="label">Upload file before clicking on add</label>
                                        </div>
                                        <button type='submit' className='add'>Add</button>
                                    </form>
                                </div>
                            </div>
                        )}
                        <table>
                            <thead>
                                <tr>
                                    <th>Title</th>
                                    <th>Description</th>
                                    <th>Link</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {Anns.map((ann, index) => (
                                    <tr key={index}>
                                        <td>{ann.Title}</td>
                                        <td>{ann.body}</td>
                                        <td>{ann.filelink && <a style={{ color: "blue" }} href={ann.filelink}>{ann.Title}</a>}</td>
                                        <td>
                                            <FontAwesomeIcon icon={faTrash} className='icon1' onClick={() => handleDelete(ann.id)} />
                                            <FontAwesomeIcon icon={faPencilAlt} className='icon2' onClick={() => handleApply(ann)} />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {isEditPopupOpen && existingData && (
                            <div className="popup">
                                <div className="popup-inner">
                                    <button className="close-btn" onClick={closeEditPopup}>Close</button>
                                    <form onSubmit={handleUpdate}>
                                        <label>Title</label>
                                        <input type="text" ref={TitleRef} defaultValue={existingData.Title} />
                                        <label>Body</label>
                                        <textarea ref={bodyRef} defaultValue={existingData.body}></textarea>
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
}

export default AdAnnouncemnts;
