import React, { useState, useEffect, useCallback, useContext } from 'react'
import { useNavigate } from "react-router-dom";
import { UserContext } from '../../App';
const Home = () => {
  const [data, setData] = useState([])
  // const [data2, setData2] = useState({})
  const { state, dispatch } = useContext(UserContext)
  var [color, setColor] = useState("black");

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

  var getAllPosts = async () => {
    await fetch('http://localhost:5000/routes/post/allpost', {
      headers: {
        "Content-Type": "application/json",
        'authorization': `Bearer ${localStorage.getItem('token')}`,
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Credentials": true,
        'Access-Control-Allow-Headers': 'application/json',
      }
    }).then(res => res.json())
      .then(result => {
        setData(result.posts)
        console.log(result);

      })
      .catch(err => console.log(err))
  }
  var i = 0, num = 60;
  const hex = num.toString(16);

  const likePost = async (id) => {
    await fetch('http://localhost:5000/routes/post/like', {
      method: "put",
      headers: {
        "Content-Type": "application/json",
        'authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify({
        postId: id
      })
    }).then(res => res.json())
      .then(result => {
        // console.log(result.length)
        const newData = data.map(item => {
          if (item._id === result._id) { setColor("red"); return result }
          else { return item }
        })
        setData(newData);
      }).catch(err => { console.log(err) })
  }
  const unlikePost = async (id) => {
    await fetch('http://localhost:5000/routes/post/unlike', {
      method: "put",
      headers: {
        "Content-Type": "application/json",
        'authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify({
        postId: id
      })
    }).then(res => res.json())
      .then(result => {
        const newData = data.map(item => {
          if (item._id === result._id) { setColor("black"); return result }
          else {
            return item
          }
        })
        setData(newData);
      }).catch(err => { console.log(err) })

  }

  //function for comments
  const makeComment = async (text, postId) => {
    await fetch('http://localhost:5000/routes/post/comment', {
      method: "put",
      headers: {
        "Content-Type": "application/json",
        "authorization": `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify({
        postId: postId,
        text: text
      })
    }).then(res => { res.json() })
      .then(result => {
        console.log(result);
        const newData = data.map(item => {
          if (item._id === result._id) { return result }
          else {
            return item
          }
        })
        setData(newData);
      }).catch(err => { console.log(err) })
  }

  return (
    <div className='home'>
      {
        data.map((item) => {
          { (item.likes.includes(state._id)) ? color = "red" : color = "black" }
          i++;
          return (
            <div className="card home-card" key={hex + i + num}>

              {/* {data2.map((item2,name) => {
                  return (<h2 key={item._id}>{name }</h2>)
                  })}
                {<h2 key={i}>{data2.name}</h2>}
                {Object.keys(item.postedBy).map((item2) => {
                  // <h2 key={i}>{item.postedBy[item2].name}</h2>;
                  na=item.postedBy[item2].name;
                  console.log(na)
                })}
                <h2 key={i}>{na}</h2> */}

              <div className="card-image">
                <img src={item.photo} alt='...' />
              </div>
              <div className="card-content">

                <i className="material-icons like" style={{ "color": color, "cursor": "pointer" }} onClick={() =>
                  item.likes.includes(state._id) ? unlikePost(item._id) : likePost(item._id)
                }
                >favorite</i>
                <h6>{item.likes.length} likes</h6>
                <h6>{item.title}</h6>
                <p>{item.body}</p>
                {
                  item.comments ? (item.comments.map(record => {
                    return (
                      <h6 key={record.postedBy._id}><span style={{ fontWeight: "500" }}>{record.postedBy.name}&nbsp;</span>{record.text}</h6>
                    )
                  })) : "No comments"
                }
                <form onSubmit={(e) => { e.preventDefault(); makeComment(e.target[0].value, item._id) }}>
                  <input type="text" placeholder="Add a comment" />
                </form>

              </div>
            </div>
          )
        })
      }
    </div>
  )
}

export default Home