import React, { Component } from 'react';
import {Button} from 'react-materialize';
import PostCard from './PostCard';

const axios = require('axios');
const PORT = process.env.PORT || 8080;

class BoardPage extends Component{
     constructor(){
          super();
          this.state = {
               id: 0,
               name: '',
               posts: [],
               showForm: false,
               formTitle: '',
               formText: '',
          }
          this.showForm = this.showForm.bind(this);
          this.handleChange = this.handleChange.bind(this);
          this.addPost = this.addPost.bind(this);
     }

     showForm(){
          this.setState({
               showForm: true,
          })
     }

     handleChange(e){
          this.setState({
               [e.target.name]: e.target.value,
          })
     }

     addPost(e){
          e.preventDefault();
          axios.post('http://localhost:' + PORT + '/boards/' + this.state.id, {
               title: this.state.formTitle,
               text: this.state.formText,
               user_id: this.props.loggedInId,
               username: this.props.loggedInUser,
          },
          {
               headers: {
                    'authorization': this.props.getToken(),
               }
          })
          .then(response => {
               this.setState({
                    posts: [response.data].concat(this.state.posts),
                    showForm: false,
                    formTitle: '',
                    formText: '',
               })
          })
          .catch(err => {
               console.log(err);
               this.props.checkError(err.response.status);
          })
     }

     componentWillMount(){
          axios.get('http://localhost:' + PORT + '/boards/' + this.props.match.params.boardId)
          .then(board => {
               this.setState({
                    id: board.data.id,
                    name: board.data.name,
                    posts: board.data.posts,
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
          const form = this.state.showForm ?
               <form onSubmit={this.addPost}>
                    <input type="text"
                         name="formTitle"
                         placeholder="Title"
                         value={this.state.formTitle}
                         onChange={this.handleChange}
                    />

                    <input type="text"
                         name="formText"
                         placeholder="Text"
                         value={this.state.formText}
                         onChange={this.handleChange}
                    />

                    <Button type="submit">Submit</Button>
               </form> :
               <Button onClick={this.showForm}
                    style={{display: this.props.loggedInId ? 'inline' : 'none'}}>New Post</Button>
          return (
               <div>
                    <h2>{this.state.name}</h2>
                    <p className="caption--margin">Welcome. Please feel free to learn and discuss.</p>
                    {form}
                    <div className="post--container">{postCards}</div>
               </div>
          )
     }
}

export default BoardPage;