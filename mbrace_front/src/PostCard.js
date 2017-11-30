import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import {Card} from 'react-materialize';

class PostCard extends Component{
     render(){
          return(
               <Card className="post--card"
                    key={this.props.details.id}
                    actions={[
                         <div className="post-details">
                              <p>Posted by: <Link to={'/profile/' + this.props.details.user_id}>
                                   {this.props.details.posted_by}</Link>
                              </p>
                              <p>{this.props.details.time_posted}</p>
                              <p>{this.props.details.comment_count} Comments</p>
                         </div>
                    ]}>
                    <p className="post--title"><Link to={'/posts/' + this.props.details.id}>{this.props.details.title}</Link></p>
               </Card>
          )
     }
}

export default PostCard;