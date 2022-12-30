import React, { useState, useEffect,useCallback } from 'react'
import { useNavigate } from "react-router-dom";
const Home = () => {
  const [data, setData] = useState([])
  const logResult = useCallback(() => {
    return 2 + 2;
  }, []);
  let navigate = useNavigate();
  useEffect(() => {
    if (localStorage.getItem("token")) {
      getAllPosts();
    } else {
      navigate("/login");
    }
  }, [logResult]);

  var getAllPosts = async ()=>{
    await fetch('http://localhost:5000/routes/post/allpost', {
        headers: {
          "Content-Type": "application/json",
          'authorization': `Bearer ${localStorage.getItem('token')}`,
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Credentials" : true ,
          // "Cross-Origin Read Blocking":"*"
          'Access-Control-Allow-Headers':'application/json',
        }
      }).then(res => res.json())
        .then(result => {
          setData(result.posts)
        })
        .catch(err=>console.log(err))
  }


  return (
    <div className='home'>
      {
        data.map(item => {
          return (
            <div className='card home-card'  key={item._id}>
              <h2>{item.postedBy}</h2>
              <div className="card-image">
                <img src={item.photo} alt='...' />
              </div>
              <div className="card-content">
                <i className="material-icons" style={{ color: "red" }}>favorite</i>
                <h6>{item.title}</h6>
                <p>{item.body}</p>
                <input type="text" placeholder="Add a text" />
              </div>
            </div>
          )
        })
      }


    </div>
  )
}

export default Home