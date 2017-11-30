import React, { Component } from 'react';
import PostCard from './PostCard';

const axios = require('axios');

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
          axios.get('/app/follow/' + this.props.match.params.userId)
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
               <PostCard key={post.id}
                    details={post}/>)
          return(
               <div>
                    <h1 className="heading">{this.state.username}</h1>
                    <p className="caption--margin">Followed Posts</p>
                    <div className="post--container">{postCards}</div>
               </div>
          )
     }
}

export default ProfilePage;