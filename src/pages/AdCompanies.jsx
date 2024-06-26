import React, { useEffect, useState, useRef } from 'react';
import Sidebar from '../components/sidebar';
import "../styles/sidebar.css";
import { firestore,storage } from '../components/firebase';
import { getDocs, collection, deleteDoc, query, where, doc, updateDoc, addDoc } from '@firebase/firestore';
import { ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';
import { v4 as uuidv4 } from 'uuid';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash ,faPencilAlt} from '@fortawesome/free-solid-svg-icons';

function Admin_Company() {
    const [isAddPopupOpen, setIsAddPopupOpen] = useState(false);
    const [isUpdatePopupOpen, setIsUpdatePopupOpen] = useState(false);
    const [Companies, setCompanies] = useState([]);
    const [existingData, setExistingData] = useState(null);
    const [file, setFile] = useState(null);
    const [title, setTitle] = useState('');
    const [body, setBody] = useState('');
    const [selectedFile, setSelectedFile] = useState(null);
    const [url, setUrl] = useState('');
    const [imageUpload, setImageUpload] = useState(null);
    const cnameRef = useRef();
    const cdescRef = useRef();
    const sectorRef = useRef();
    const linkRef=useRef();
    const toggleAddPopup = () => {
        setIsAddPopupOpen(!isAddPopupOpen);
    };

    const toggleUpdatePopup = () => {
        setIsUpdatePopupOpen(!isUpdatePopupOpen);
    };

    const uploadImage = () => {
        if (!imageUpload) {
            alert('Please select a file.');
            return;
        }
        const uniqueFilename = uuidv4() + '-' + imageUpload.name;
        const imageRef = storageRef(storage, `CompaniesData/${uniqueFilename}`);

        uploadBytes(imageRef, imageUpload)
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
                setImageUpload(null); // Reset the state after upload
            });
    };

    

    

    

    const handleSubmitAdd = async (e) => {
        e.preventDefault();
        const data = {
            cname: cnameRef.current.value,
            cdesc: cdescRef.current.value,
            sector: sectorRef.current.value,
            link:linkRef.current.value,
            img: url, // Set file link here
            id:cnameRef.current.value,
        };

        try {
            await addDoc(collection(firestore, "Companies"), data);
            alert("Company added successfully");
            fetchData(); // Refresh the list of blogs after adding
        } catch (error) {
            console.error("Error adding document: ", error);
            alert("Failed to add Company");
        }
    };

    const fetchData = async () => {
        try {
            const ref = collection(firestore, 'Companies');
            const querySnapshot = await getDocs(ref);
            const newData = querySnapshot.docs.map(doc => doc.data());
            setCompanies(newData);
        } catch (error) {
            console.error('Error fetching documents', error);
            alert("Failed to fetch companies");
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleApply = async (comp) => {
        setExistingData(comp);
        toggleUpdatePopup();
        // Scroll to the top of the page to display the form
        window.scrollTo(0, 0);
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            // Find the document reference based on the id field
            const q = query(collection(firestore, "Companies"), where("cname", "==", existingData.cname));
            const querySnapshot = await getDocs(q);

            querySnapshot.forEach(async (document) => {
                const docRef = doc(firestore, "Companies", document.id);
                const newData = {
                    cname: cnameRef.current.value,
                    cdesc: cdescRef.current.value,
                    sector: sectorRef.current.value,
                    img: existingData.img,
                    id:cnameRef.current.value,
                    link:linkRef.current.value
                };

                if (file) {
                    const storageReff = storageRef(storage, 'CompaniesData/' + file.name);
                    await uploadBytes(storageReff, file);
                    newData.img = await getDownloadURL(storageReff);
                }

                await updateDoc(docRef, newData);
                alert("Company updated successfully");
                setExistingData(null);
                setFile(null);
                fetchData(); // Refresh the list of blogs after updating
            });
        } catch (error) {
            console.error("Error updating Company: ", error);
            alert("Failed to update Company");
        }
    };

    const handleDelete = async (id) => {
        // Ask for confirmation before deleting
        if (window.confirm("Are you sure you want to delete this Entry?")) {
            try {
                // Query the documents based on the 'id' field
                const q = query(collection(firestore, "Companies"), where("id", "==", id));
                const querySnapshot = await getDocs(q);

                // Delete each document returned by the query
                querySnapshot.forEach(async (doc) => {
                    await deleteDoc(doc.ref);
                });

                alert("Company deleted successfully");
                fetchData();

            } catch (error) {
                console.error("Error deleting Company: ", error);
                alert("Failed to delete Company");
            }
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
                        <h1 className='head1'>Company</h1>
                        <div className='ra'>
                            <button className='btn2' onClick={toggleAddPopup}>Add</button>
                        </div>
                        {isAddPopupOpen && (
                            <div className="popup">
                                <div className="popup-inner">
                                    <button className="close-btn" onClick={toggleAddPopup}>Close</button>
                                    <form onSubmit={handleSubmitAdd}>
                                        <label>Name</label>
                                        <input type="text" ref={cnameRef} />
                                        <label>Sector</label>
                                        <input type="text" ref={sectorRef}></input>
                                        <label>About</label>
                                        <textarea ref={cdescRef} />
                                        <label>Contact</label>
                                        <input type="text" ref={linkRef} />
                                        <input type="file" id="file-upload" onChange={(event) => setImageUpload(event.target.files[0])} />
                                        <div className="button-group">
                                            <button type="button" className="cancel-btn" onClick={toggleAddPopup}>Cancel</button>
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
                                    <th>Sector</th>
                                    <th>Description</th>
                                    <th>Contact</th>
                                    <th>Logo</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {Companies.map((comp, index) => (
                                    <tr key={index}>
                                        <td>{comp.cname}</td>
                                        <td>{comp.sector}</td>
                                        <td>{comp.cdesc}</td>
                                        <td>{comp.link && <a style={{ color: "blue" }} href={comp.link}>{comp.link}</a>}</td>
                                        <td>{comp.img && <img style={{ color: "blue" }} src={comp.img} alt="comp.title"></img>}</td>
                                        <td>
                                            <FontAwesomeIcon icon={faTrash} className='icon1' onClick={() => handleDelete(comp.id)} />
                                            <FontAwesomeIcon icon={faPencilAlt} className='icon2' onClick={() => handleApply(comp)} />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                                        {isUpdatePopupOpen && existingData && (
                                            <div className="popup">
                                                <div className="popup-inner">
                                                    <button className="close-btn" onClick={toggleUpdatePopup}>Close</button>
                                                    <form onSubmit={handleUpdate}>
                                                        <label>Name</label>
                                                        <input type="text" ref={cnameRef} defaultValue={existingData.cname} />
                                                        <label>Sector</label>
                                                        <input type="text" ref={sectorRef} defaultValue={existingData.sector} />
                                                        <label>Contact</label>
                                                        <input type="text" ref={linkRef} defaultValue={existingData.link} />
                                                        <label>Description</label>
                                                        <textarea ref={cdescRef} defaultValue={existingData.cdesc}></textarea>
                                                        <input type="file" id="file-upload" onChange={(event) => setFile(event.target.files[0])} />
                                                        <div className="button-group">
                                                            <button type="button" className="cancel-btn" onClick={toggleUpdatePopup}>Cancel</button>
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

export default Admin_Company;

