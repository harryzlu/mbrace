import React, {Component} from 'react';
import {Button} from 'react-materialize';
import PostCard from './PostCard';

const axios = require('axios');

class SearchPage extends Component{
     constructor(){
          super();
          this.state = {
               posts: [],
          }
          this.searchPosts = this.searchPosts.bind(this);
     }

     searchPosts(e){
          e.preventDefault();
          const queryStr = this.queryStr.value.split(' ').join('+');
          axios.get('/app/search?text=' + queryStr)
          .then(response => {
               this.setState({
                    posts: response.data.posts,
               });
          })
          .catch(err => {
               console.log(err);
          });
     }

     render(){
          const postCards = this.state.posts.map(post =>
               <PostCard key={post.id}
                    details={post}/>)
          return(
               <div>
                    <h1 className="heading">Search</h1>
                    <form className="form-style"
                         onSubmit={this.searchPosts}
                         autoComplete="nope">
                         <input required
                              type="text"
                              ref={ref=>this.queryStr = ref}
                              placeholder="Search posts..."
                         />
                         <Button type="submit">Search</Button>
                    </form>
                    <div className="post--container">{postCards}</div>
               </div>
          )
     }
}

export default SearchPage;