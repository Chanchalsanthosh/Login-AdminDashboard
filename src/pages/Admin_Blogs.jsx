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

function Admin_Blogs() {
    const [isAddPopupOpen, setIsAddPopupOpen] = useState(false);
    const [isUpdatePopupOpen, setIsUpdatePopupOpen] = useState(false);
    const [Blogs, setBlogs] = useState([]);
    const [existingData, setExistingData] = useState(null);
    const [file, setFile] = useState(null);
    const [title, setTitle] = useState('');
    const [body, setBody] = useState('');
    const [selectedFile, setSelectedFile] = useState(null);
    const [url, setUrl] = useState('');
    const [imageUpload, setImageUpload] = useState(null);
    const titleRef = useRef();
    const contentRef = useRef();
    const authorRef = useRef();

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
        const imageRef = storageRef(storage, `BlogData/${uniqueFilename}`);

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

    const [numDocuments, setNumDocuments] = useState(0);

    const fetchNumDocuments = async () => {
        try {
            const querySnapshot = await getDocs(collection(firestore, "Blogs"));
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
        const data = {
            title: titleRef.current.value,
            content: contentRef.current.value,
            id: numDocuments + 1,
            author: authorRef.current.value,
            img: url, // Set file link here
        };

        try {
            await addDoc(collection(firestore, "Blogs"), data);
            alert("Blog added successfully");
            fetchData(); // Refresh the list of blogs after adding
            toggleAddPopup(); // Close the add popup after adding
        } catch (error) {
            console.error("Error adding document: ", error);
            alert("Failed to add Blog");
        }
    };

    const fetchData = async () => {
        try {
            const ref = collection(firestore, 'Blogs');
            const querySnapshot = await getDocs(ref);
            const newData = querySnapshot.docs.map(doc => doc.data());
            const sortedData = newData.sort((a, b) => b.id - a.id);
            setBlogs(sortedData);
        } catch (error) {
            console.error('Error fetching documents', error);
            alert("Failed to fetch Blogs");
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleApply = async (blg) => {
        setExistingData(blg);
        toggleUpdatePopup();
        // Scroll to the top of the page to display the form
        window.scrollTo(0, 0);
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            // Find the document reference based on the id field
            const q = query(collection(firestore, "Blogs"), where("id", "==", existingData.id));
            const querySnapshot = await getDocs(q);

            querySnapshot.forEach(async (document) => {
                const docRef = doc(firestore, "Blogs", document.id);
                const newData = {
                    title: titleRef.current.value,
                    content: contentRef.current.value,
                    author: authorRef.current.value,
                    img: existingData.img,
                };

                if (file) {
                    const storageReff = storageRef(storage, 'BlogData/' + file.name);
                    await uploadBytes(storageReff, file);
                    newData.img = await getDownloadURL(storageReff);
                }

                await updateDoc(docRef, newData);
                alert("Blog updated successfully");
                setExistingData(null);
                setFile(null);
                fetchData(); // Refresh the list of blogs after updating
                toggleUpdatePopup(); // Close the update popup after updating
            });
        } catch (error) {
            console.error("Error updating Blog: ", error);
            alert("Failed to update Blog");
        }
    };

    const handleDelete = async (id) => {
        // Ask for confirmation before deleting
        if (window.confirm("Are you sure you want to delete this blog?")) {
            try {
                // Query the documents based on the 'id' field
                const q = query(collection(firestore, "Blogs"), where("id", "==", id));
                const querySnapshot = await getDocs(q);

                // Delete each document returned by the query
                querySnapshot.forEach(async (doc) => {
                    await deleteDoc(doc.ref);
                });

                alert("Blog deleted successfully");
                const blgRef = collection(firestore, "Blogs");
                const querySnapshot2 = await getDocs(query(blgRef, where("id", ">", id)));
                querySnapshot2.docs.map(doc => {
                    const docRef = collection(firestore, "Blogs", doc.id);
                    const updatedId = doc.data().id - 1; // Decrease the ID by 1
                    return updateDoc(docRef, { id: updatedId });
                });
                fetchData();

            } catch (error) {
                console.error("Error deleting Blog: ", error);
                alert("Failed to delete Blog");
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
                        <h1 className='head1'>Blogs</h1>
                        <div className='ra'>
                            <button className='btn2' onClick={toggleAddPopup}>Add</button>
                        </div>
                        {isAddPopupOpen && (
                            <div className="popup">
                                <div className="popup-inner">
                                    <button className="close-btn" onClick={toggleAddPopup}>Close</button>
                                    <form onSubmit={handleSubmitAdd}>
                                        <label>Title</label>
                                        <input type="text" ref={titleRef} />
                                        <label>Author</label>
                                        <input type="text" ref={authorRef}></input>
                                        <label>Content</label>
                                        <textarea ref={contentRef} style={{ height: '100px', overflowY: 'scroll' }}></textarea>
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
                                    <th>Title</th>
                                    <th>Author</th>
                                    <th>Content</th>
                                    <th>Image</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {Blogs.map((blog, index) => (
                                    <tr key={index}>
                                        <td>{blog.title}</td>
                                        <td>{blog.author}</td>
                                        <td className="table-content-cell">{blog.content}</td>
                                        <td>
                                            {blog.img && <img src={blog.img} alt={blog.title} style={{ width: '100px' }} />}
                                        </td>
                                        <td>
                                            <FontAwesomeIcon icon={faTrash} className='icon1' onClick={() => handleDelete(blog.id)} />
                                            <FontAwesomeIcon icon={faPencilAlt} className='icon2' onClick={() => handleApply(blog)} />
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
                                        <label>Title</label>
                                        <input type="text" ref={titleRef} defaultValue={existingData.title} />
                                        <label>Author</label>
                                        <input type="text" ref={authorRef} defaultValue={existingData.author} />
                                        <label>Content</label>
                                        <textarea ref={contentRef} defaultValue={existingData.content} style={{ height: '100px', overflowY: 'scroll' }}></textarea>
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

export default Admin_Blogs;
