import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import axios from 'axios';
import { useParams } from "react-router-dom";

function App() {
  return (
    <Router>
      <div className="container mx-auto p-4">
        <nav className="mb-4">
          <Link to="/" className="mr-4 text-blue-600">Home</Link>
          <Link to="/create" className="text-blue-600">Create Post</Link>
        </nav>
        <Routes>
          <Route path="/" element={<PostList />} />
          <Route path="/create" element={<CreatePost />} />
          <Route path="/edit/:id" element={<EditPost />} />
        </Routes>
      </div>
    </Router>
  );
}

function PostList() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    fetch('https://instagram-backend-2zyz.onrender.com/api/posts')
      .then((response) => response.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setPosts(data);
        } else {
          console.error('API response is not an array:', data);
          setPosts([]); 
        }
      })
      .catch((error) => console.error('Error fetching posts:', error));
  }, []);

  const handleDelete = (id) => {
    axios.delete(`https://instagram-backend-2zyz.onrender.com/api/posts/${id}`)
      .then(() => setPosts(posts.filter(post => post._id !== id)))
      .catch(err => console.error(err));
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4 ">Posts</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 ">
        {posts.map(post => (
          <div key={post._id} className="border rounded p-4">
            <img src={post.image} alt={post.title} className="w-full h-[500px] object-contain mb-2" />
            <h2 className="text-xl font-semibold">{post.title}</h2>
            <p className="text-gray-600">{post.description}</p>
            <div className="mt-2 flex justify-between">
              <Link to={`/edit/${post._id}`} className="text-blue-500">Edit</Link>
              <button onClick={() => handleDelete(post._id)} className="text-red-500 cursor-pointer">Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function CreatePost() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('image', image);

    axios.post('https://instagram-backend-2zyz.onrender.com/api/posts', formData)
      .then(() => {
        setTitle('');
        setDescription('');
        setImage(null);
        alert('Post created successfully!');
      })
      .catch(err => console.error(err));
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Create Post</h1>
      <form onSubmit={handleSubmit} className="space-y-4" >
        <div>
          <label className="block font-medium">Title</label>
          <input 
            type="text" 
            value={title} 
            onChange={(e) => setTitle(e.target.value)} 
            className="w-full border p-2 rounded" 
            required 
          />
        </div>
        <div>
          <label className="block font-medium">Description</label>
          <textarea 
            value={description} 
            onChange={(e) => setDescription(e.target.value)} 
            className="w-full border p-2 rounded" 
            required
          ></textarea>
        </div>
        <div>
          <label className="block font-medium">Image</label>
          <input 
            type="file" 
            onChange={(e) => setImage(e.target.files[0])} 
            className="w-full" 
            required 
          />
        </div>
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">Create</button>
      </form>
    </div>
  );
}

function EditPost() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const { id } = useParams();

  useEffect(() => {
    axios.get(`https://instagram-backend-2zyz.onrender.com/api/posts/${id}`)
      .then(res => {
        setTitle(res.data.title);
        setDescription(res.data.description);
      })
      .catch(err => console.error(err));
  }, [id]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);

    axios.put(`https://instagram-backend-2zyz.onrender.com/api/posts/${id}`, formData)
      .then(() => {
        setTitle('');
        setDescription('');
        alert('Post updated successfully!')})
      .catch(err => console.error(err));
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4 cursor-pointer">Edit Post</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-medium">Title</label>
          <input 
            type="text" 
            value={title} 
            onChange={(e) => setTitle(e.target.value)} 
            className="w-full border p-2 rounded" 
            required 
          />
        </div>
        <div>
          <label className="block font-medium">Description</label>
          <textarea 
            value={description} 
            onChange={(e) => setDescription(e.target.value)} 
            className="w-full border p-2 rounded" 
            required
          ></textarea>
        </div>
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded cursor-pointer ">Update</button>
      </form>
    </div>
  );
}

export default App;
