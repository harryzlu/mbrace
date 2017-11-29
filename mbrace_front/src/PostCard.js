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
                              <p>POSTED BY: <Link to={'/profile/' + this.props.details.user_id}>
                                   {this.props.details.posted_by}</Link>
                              </p>
                              <p>POSTED AT: {this.props.details.time_posted}</p>
                              <p>{this.props.details.comment_count} COMMENTS</p>
                         </div>
                    ]}>
                    <p><Link to={'/posts/' + this.props.details.id}>{this.props.details.title}</Link></p>
               </Card>
          )
     }
}

export default PostCard;