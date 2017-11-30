import React, { Component } from 'react';
import {Button} from 'react-materialize';
import PostCard from './PostCard';

const axios = require('axios');

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
          this.resetForm = this.resetForm.bind(this);
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
          axios.post('/boards/' + this.state.id, {
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

     resetForm(e){
          e.preventDefault();
          this.setState({
               showForm: false,
               formTitle: '',
               formText: '',
          })
     }

     componentWillMount(){
          axios.get('/boards/' + this.props.match.params.boardId)
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
               <form className="form-style" onSubmit={this.addPost}>
                    <input required
                         type="text"
                         name="formTitle"
                         placeholder="Title"
                         value={this.state.formTitle}
                         onChange={this.handleChange}
                    />

                    <input required
                         type="text"
                         name="formText"
                         placeholder="Text"
                         value={this.state.formText}
                         onChange={this.handleChange}
                    />

                    <Button type="button" onClick={this.resetForm}>Cancel</Button>

                    <Button type="submit">Submit</Button>
               </form> :
               <Button onClick={this.showForm}
                    style={{display: this.props.loggedInId ? 'inline' : 'none'}}>New Post</Button>
          return (
               <div>
                    <h1 className="heading">{this.state.name}</h1>
                    <p className="caption">Welcome. Please feel free to learn and discuss.</p>
                    {form}
                    <div className="post--container">{postCards}</div>
               </div>
          )
     }
}

export default BoardPage;