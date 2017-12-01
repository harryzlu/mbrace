import React, { Component } from 'react';
import {Link} from 'react-router-dom';
import {Card} from 'react-materialize';

const axios = require('axios');

class HomePage extends Component{
     constructor(){
          super();
          this.state = {
               boards: [],
          }
     }

     componentWillMount(){
          axios.get('/app/boards')
          .then(boards => {
               this.setState({
                    boards: boards.data,
               })
          })
          .catch(err => {
               console.log(err);
          })
     }

     render(){
          let boardCards = this.state.boards.map(board =>
               <BoardCard key={board.id}
                    details={board}/>)
          return (
               <div>
                    <h1 className="heading">MBrace</h1>
                    <p className="caption">Welcome to MBrace, a community to help you help your loved ones.</p>
                    <div className="board--container">{boardCards}</div>
               </div>
          )
     }
}

class BoardCard extends Component{
     render(){
          return(
               <Link to={'/boards/' + this.props.details.id}>
                    <Card className="board--card">
                         <p className="board__title">{this.props.details.name}</p>
                         <p>{this.props.details.post_count} Posts</p>
                    </Card>
               </Link>
          )
     }
}

export default HomePage;