import React, { Component } from 'react';
import PostCard from './PostCard';

const axios = require('axios');
const PORT = process.env.PORT || 8080;

class ProfilePage extends Component{
     constructor(){
          super();
          this.state = {
               id: 0,
               username: '',
               posts: [],
          }
     }

     componentWillMount(){
          axios.get('http://localhost:' + PORT + '/follow/' + this.props.match.params.userId)
          .then(user => {
               this.setState({
                    id: user.data.id,
                    username: user.data.username,
                    posts: user.data.posts,
               })
          })
          .catch(err => {
               console.log(err);
          })
     }

     render(){
          const postCards = this.state.posts.map(post =>
               <PostCard details={post}/>)
          return(
               <div>
                    <h2>{this.state.username}</h2>
                    <p className="caption--margin">Followed Posts</p>
                    <div className="post--container">{postCards}</div>
               </div>
          )
     }
}

export default ProfilePage;