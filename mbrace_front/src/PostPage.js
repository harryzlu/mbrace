import React, { Component } from 'react';
import {Redirect, Link} from 'react-router-dom';
import {Button, Modal, Card} from 'react-materialize';

const axios = require('axios');

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
          this.resetForm = this.resetForm.bind(this);
          this.editComment = this.editComment.bind(this);
          this.deleteComment = this.deleteComment.bind(this);
     }

     followPost(){
          axios.post('/app/follow/' + this.state.id, {
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
          axios.delete('/app/follow/' + this.state.id,
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
          axios.put('/app/posts/' + this.state.id, {
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
          axios.delete('/app/posts/' + this.state.id, {
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
          axios.post('/app/posts/' + this.state.id, {
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

     resetForm(e){
          e.preventDefault();
          this.setState({
               showCommentForm: false,
               formTitle: '',
               formText: '',
          })
     }

     editComment(e, id){
          e.preventDefault();
          const text = e.target["text"].value
          axios.put('/app/comments/' + id, {
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
          axios.delete('/app/comments/' + id, {
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
          axios.get('/app/posts/' + this.props.match.params.postId)
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
          const commentCards = this.state.comments.map(comment =>
               <CommentCard key={comment.id}
                    details={comment}
                    loggedInId={this.props.loggedInId}
                    deleteComment={this.deleteComment}
                    editComment={this.editComment}/>)

          const form = this.state.showCommentForm ?
               <form className="form-style" onSubmit={this.addComment}>
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
               <Button onClick={this.showForm}>New Comment</Button>

          const UDPost = this.props.loggedInId === this.state.user_id ? <span>
               <Modal
                    header='Edit Post'
                    trigger={<a>Edit</a>}
                    actions={
                         <div>
                              <form className="form-style" onSubmit={this.editPost}>
                                   <input required type="text" name="text" defaultValue={this.state.text}/>
                                   <Button modal="close" type="submit">Submit</Button>
                                   <Button type="reset" modal="close">Cancel</Button>
                              </form>
                         </div>
                    }>
               </Modal> / <Modal
                    header='Delete Post'
                    trigger={<a>Delete</a>}
                    actions={
                         <div>
                              <Button modal="close" onClick={this.deletePost}>OK</Button>
                              <Button modal="close">Cancel</Button>
                         </div>
                    }>
                    <p>Are you sure?</p>
               </Modal>
          </span> :
          <noscript/>
          return (
               <div>
                    <div style={{display: 'none'}}>
                         {this.state.deleted && <Redirect to={'/boards/' + this.state.board_id}/>}
                    </div>
                    <Link className="return-button" to={'/boards/' + this.state.board_id}><Button>Back</Button></Link>
                    <Card className="post--header" title={this.state.title} actions={[
                         <div className="post-details">
                              <p>Posted by: <Link to={'/profile/' + this.state.user_id}>
                                   {this.state.posted_by}</Link>
                              </p>
                              {UDPost}
                              <p>{this.state.time_posted}</p>
                         </div>
                    ]}>
                         <p>{this.state.text}</p>
                    </Card>

                    <p>{this.state.comments.length} Comments</p>

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
          const UDComment = this.props.loggedInId === this.props.details.user_id ? <span className="ud-comment">
               <Modal
                    header='Edit Comment'
                    trigger={<a>Edit</a>}
                    actions={
                         <div>
                              <form className="form-style" onSubmit={(e) => {this.props.editComment(e, this.props.details.id)}}>
                                   <input required type="text" name="text" defaultValue={this.props.details.text}/>
                                   <Button modal="close" type="submit">Submit</Button>
                                   <Button type="reset" modal="close">Cancel</Button>
                              </form>
                         </div>
                    }>
               </Modal> / <Modal
                    header='Delete Comment'
                    trigger={<a>Delete</a>}
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
          </span> : 
          <noscript/>
          return(
               <div>
                    <Card className="comment--card" actions={[
                         <div className="comment-details">
                              <p>Posted by: <Link to={'/profile/' + this.props.details.user_id}>
                                   {this.props.details.posted_by}</Link>
                              </p>
                              {UDComment}
                              <p>{this.props.details.time_posted}</p>
                         </div>]}>
                         <p>{this.props.details.text}</p>
                    </Card>
               </div>
          )
     }
}

export default PostPage;