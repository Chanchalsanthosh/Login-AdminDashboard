import React ,{useState,useEffect} from 'react'
import { firestore,storage } from './firebase';
import { ref,deleteObject } from 'firebase/storage';
import axios from 'axios'
function Admin_Gallery(){
    const api = axios.create({
        baseURL: 'http://localhost:5000', 
        headers: {
          'Content-Type': 'multipart/form-data', 
        },
      });
      const [imageUpload, setImageUpload] = useState(null);
    const [imageList,setImageList]=useState([]);
    const [showForm, setShowForm] = useState(false);
    const uploadImage = () => {
        if (!imageUpload) {
            alert('Please select a file.');
            return;
        }

        const formData=new FormData();
        formData.append('image',imageUpload);
        api.post('/uploadImageGallery',formData,{
            headers:{
                'Content-Type':'multipart/form-data'
            }
        })
        .then(response => {
            alert('Image uploaded successfully');
            
        })
        .catch(error => {
            console.error('Error uploading image:', error);
            alert('Error uploading image. Please try again.');
        })
        .finally(() => {
            setImageUpload(null); 
            api.get('/getImageList')
        .then(response => {
            console.log('Response data:', response); 
            setImageList(response.data.imageList || []); 
        })
        .catch(error => {
            console.error('Error fetching image list:', error);
        });
            
        });
    };

    const handleDelete = async (url) => {
        try {
            
            const indexToDelete = imageList.findIndex((imageUrl) => imageUrl === url);
    
            
            if (indexToDelete === -1) {
                console.error('Image not found for URL:', url);
                return;
            }
    
            
            const updatedImageList = [...imageList.slice(0, indexToDelete), ...imageList.slice(indexToDelete + 1)];
            setImageList(updatedImageList);
    
            
            const imageRef = ref(storage,url);
    
           
            deleteObject(imageRef)
  .then(() => {
    console.log('Image deleted successfully');
  })
        } catch (error) {
            console.error('Error deleting image:', error);
            
        }
    };
    
    
    
    useEffect(() => {
        api.get('/getImageList')
        .then(response => {
            console.log('Response data:', response); 
            setImageList(response.data.imageList || []); 
           
        })
        .catch(error => {
            console.error('Error fetching image list:', error);
        });
    }, []);

    return (
        <>
        <div id="gmain">
        <div className='addimage'>
                <button onClick={() => setShowForm(true)}>Add Image</button>
                {showForm && (
                    <form>
                        <label>Choose File: </label>
                        <input type="file" onChange={(event) => setImageUpload(event.target.files[0])} />
                        <div className='btng'>
                        <button type="button" onClick={uploadImage} className='upload-btn'>Upload</button>
                       
                        </div>
                    </form>
                )}
            </div>

        <div className='viewimage'>
            {imageList.map((url)=>(
                <div key={url} className='gimage'>
                    <img src={url} ></img>
                    <button onClick={()=>handleDelete(url)}>DELETE</button>
                </div>
            ))}
        </div>
        </div>
        
        </>
    )
}

export default Admin_Gallery;