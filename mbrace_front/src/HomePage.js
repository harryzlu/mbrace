import React, { Component } from 'react';
import {Link} from 'react-router-dom';
import {Card} from 'react-materialize';

const axios = require('axios');
const PORT = process.env.PORT || 8080;

class HomePage extends Component{
     constructor(){
          super();
          this.state = {
               boards: [],
          }
     }

     componentWillMount(){
          console.log('run');
          axios.get('http://localhost:' + PORT + '/boards')
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
                    <h2 className="">MBrace</h2>
                    <p className="caption--margin">Welcome. How may we help today?</p>
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
                         <h5>{this.props.details.name}</h5>
                         <p>{this.props.details.post_count} Posts</p>
                    </Card>
               </Link>
          )
     }
}

export default HomePage;