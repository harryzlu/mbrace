import React, {Component} from 'react';
import {Button} from 'react-materialize';
import PostCard from './PostCard';

const axios = require('axios');
const PORT = process.env.PORT || 8080;

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
          axios.get('/search?text=' + queryStr)
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
               <PostCard details={post}/>)
          return(
               <div>
                    <h2>Search</h2>
                    <form onSubmit={this.searchPosts}>
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