import React, { Component } from 'react';
import {Redirect, Link} from 'react-router-dom';
import {Button, Modal, Card} from 'react-materialize';

const axios = require('axios');
const PORT = process.env.PORT || 8080;

class PostPage extends Component{
     constructor(){
          super();
          this.state = {
               id: 0,
               title: '',
               text: '',
               time_posted: '',
               posted_by: '',
               user_id: 0,
               board_id: 0,
               following: false,
               deleted: false,
               comments: [],
               showCommentForm: false,
               formText: '',
          }
          this.followPost = this.followPost.bind(this);
          this.unfollowPost = this.unfollowPost.bind(this);
          this.editPost = this.editPost.bind(this);
          this.deletePost = this.deletePost.bind(this);
          this.showForm = this.showForm.bind(this);
          this.handleChange = this.handleChange.bind(this);
          this.addComment = this.addComment.bind(this);
          this.editComment = this.editComment.bind(this);
          this.deleteComment = this.deleteComment.bind(this);
     }

     followPost(){
          axios.post('http://localhost:' + PORT + '/follow/' + this.state.id, {
               user_id: this.props.loggedInId,
          },
          {
               headers: {
                    'authorization': this.props.getToken(),
               },
          })
          .then(response => {
               this.setState({
                    following: true,
               });
          })
          .catch(err => {
               console.log(err);
               this.props.checkError(err.response.status);
          })
     }

     unfollowPost(){
          axios.delete('http://localhost:' + PORT + '/follow/' + this.state.id,
          {
               headers: {
                    'authorization': this.props.getToken(),
               },
               data: {
                    user_id: this.props.loggedInId,
               },
          })
          .then(response => {
               this.setState({
                    following: false,
               });
          })
          .catch(err => {
               console.log(err);
               this.props.checkError(err.response.status);
          })
     }

     editPost(e){
          e.preventDefault();
          const text = e.target["text"].value
          axios.put('http://localhost:' + PORT + '/posts/' + this.state.id, {
               text: text,
               user_id: this.props.loggedInId,
          },
          {
               headers: {
                    'authorization': this.props.getToken(),
               }
          })
          .then(response => {
               this.setState({
                    text: text,
               })
          })
          .catch(err => {
               console.log(err);
               this.props.checkError(err.response.status);
          })
     }

     deletePost(){
          axios.delete('http://localhost:' + PORT + '/posts/' + this.state.id, {
               headers: {
                    'authorization': this.props.getToken(),
               },
               data: {
                    user_id: this.props.loggedInId,
               },
          })
          .then(response => {
               this.setState({
                    deleted: true,
               })
          })
          .catch(err => {
               console.log(err);
               this.props.checkError(err.response.status);
          })
     }

     showForm(){
          this.setState({
               showCommentForm: true,
          })
     }

     handleChange(e){
          this.setState({
               [e.target.name]: e.target.value,
          })
     }

     addComment(e){
          e.preventDefault();
          axios.post('http://localhost:' + PORT + '/posts/' + this.state.id, {
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
               let comments = Array.from(this.state.comments);
               comments.push(response.data);
               this.setState({
                    comments: comments,
                    following: true,
                    showCommentForm: false,
                    formTitle: '',
                    formText: '',
               })
          })
          .catch(err => {
               console.log(err);
               this.props.checkError(err.response.status);
          })
     }

     editComment(e, id){
          e.preventDefault();
          const text = e.target["text"].value
          axios.put('http://localhost:' + PORT + '/comments/' + id, {
               text: text,
               user_id: this.props.loggedInId,
          },
          {
               headers: {
                    'authorization': this.props.getToken(),
               }
          })
          .then(response => {
               let comments = this.state.comments;
               comments[comments.findIndex(el => el.id === id)].text = text;
               this.setState({
                    comments: comments,
               })
          })
          .catch(err => {
               console.log(err);
               this.props.checkError(err.response.status);
          })
     }

     deleteComment(id){
          axios.delete('http://localhost:' + PORT + '/comments/' + id, {
               headers: {
                    'authorization': this.props.getToken(),
               },
               data: {
                    user_id: this.props.loggedInId,
               },
          })
          .then(response => {
               this.setState({
                    comments: this.state.comments.filter(el => {return el.id !== id}),
               })
          })
          .catch(err => {
               console.log(err);
               this.props.checkError(err.response.status);
          })
     }

     componentWillMount(){
          axios.get('http://localhost:' + PORT + '/posts/' + this.props.match.params.postId)
          .then(post => {
               this.setState({
                    id: post.data.id,
                    title: post.data.title,
                    text: post.data.text,
                    time_posted: post.data.time_posted,
                    posted_by: post.data.posted_by,
                    user_id: post.data.user_id,
                    board_id: post.data.board_id,
                    following: !!post.data.following.find(el => this.props.loggedInId===el),
                    comments: post.data.comments,
               })
          })
          .catch(err => {
               console.log(err);
          })
     }

     render(){
          let commentCards = this.state.comments.map(comment =>
               <CommentCard key={comment.id}
                    details={comment}
                    loggedInId={this.props.loggedInId}
                    deleteComment={this.deleteComment}
                    editComment={this.editComment}/>)
          let form = this.state.showCommentForm ?
               <form onSubmit={this.addComment}>
                    <input type="text"
                         name="formText"
                         placeholder="Text"
                         value={this.state.formText}
                         onChange={this.handleChange}
                    />

                    <Button type="submit">Submit</Button>
               </form> :
               <Button onClick={this.showForm}>New Comment</Button>
          return (
               <div>
                    <div style={{display: 'none'}}>
                         {this.state.deleted && <Redirect to={'/boards/' + this.state.board_id}/>}
                    </div>
                    <Card className="post--header" title={this.state.title} actions={[
                         <div className="post-details">
                              <p>POSTED BY: <Link to={'/profile/' + this.state.user_id}>
                                   {this.state.posted_by}</Link>
                              </p>
                              <p>POSTED AT: {this.state.time_posted}</p>
                         </div>
                    ]}>
                         <p>{this.state.text}</p>

                    </Card>
                    <div style={{display: this.props.loggedInId === this.state.user_id ? 'inline' : 'none'}}>
                         <Modal
                              header='Edit Post'
                              trigger={<Button>Edit</Button>}
                              actions={
                                   <div>
                                        <form onSubmit={this.editPost}>
                                             <input type="text" name="text" defaultValue={this.state.text}/>
                                             <Button modal="close" type="submit">Submit</Button>
                                             <Button type="reset" modal="close">Cancel</Button>
                                        </form>
                                   </div>
                              }>
                         </Modal>
                         <Modal
                              header='Delete Post'
                              trigger={<Button>Delete</Button>}
                              actions={
                                   <div>
                                        <Button modal="close" onClick={this.deletePost}>OK</Button>
                                        <Button modal="close">Cancel</Button>
                                   </div>
                              }>
                              <p>Are you sure?</p>
                         </Modal>
                    </div>
                    <div style={{display: this.props.loggedInId ? 'inline' : 'none'}}>
                         <Button onClick={this.state.following ? this.unfollowPost : this.followPost}>
                              {this.state.following ? "Unfollow" : "Follow"}
                         </Button>
                         {form}
                    </div>
                    <div className="comment--container">{commentCards}</div>
               </div>
          )
     }
}

class CommentCard extends Component{
     render(){
          return(
               <div>
                    <Card className="comment--card">
                         <div className="comment-details">
                              <Link to={'/profile/' + this.props.details.user_id}>
                                   <p>{this.props.details.posted_by}</p>
                              </Link>
                              <p>{this.props.details.time_posted}</p>
                         </div>
                         <p>{this.props.details.text}</p>
                    </Card>
                    <div style={{display: this.props.loggedInId === this.props.details.user_id ? 'inline' : 'none'}}>
                         <Modal
                              header='Edit Comment'
                              trigger={<Button>Edit</Button>}
                              actions={
                                   <div>
                                        <form onSubmit={(e) => {this.props.editComment(e, this.props.details.id)}}>
                                             <input type="text" name="text" defaultValue={this.props.details.text}/>
                                             <Button modal="close" type="submit">Submit</Button>
                                             <Button type="reset" modal="close">Cancel</Button>
                                        </form>
                                   </div>
                              }>
                         </Modal>
                         <Modal
                              header='Delete Comment'
                              trigger={<Button>Delete</Button>}
                              actions={
                                   <div>
                                        <Button modal="close"
                                             onClick={()=>{
                                                  this.props.deleteComment(this.props.details.id)
                                             }}>OK</Button>
                                        <Button modal="close">Cancel</Button>
                                   </div>
                              }>
                              <p>Are you sure?</p>
                         </Modal>
                    </div>
               </div>
          )
     }
}

export default PostPage;