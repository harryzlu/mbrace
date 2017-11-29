import React, { Component } from 'react';
import {Link, Redirect} from 'react-router-dom';
import {Button} from 'react-materialize';

const axios = require('axios');
const PORT = process.env.PORT || 8080;

class LoginPage extends Component{
     constructor(){
          super();
          this.state = {
               username: '',
               password: '',
          }
          this.handleChange = this.handleChange.bind(this);
          this.logIn = this.logIn.bind(this);
     }

     handleChange(e){
          this.setState({
               [e.target.name]: e.target.value,
          })
     }

     logIn(e){
          e.preventDefault();
          const loginBody = {
               username: this.state.username,
               password: this.state.password,
          }
          axios.post('http://localhost:' + PORT + '/login', loginBody)
          .then(response => {
               localStorage.setItem('user_id', response.data.user_id);
               localStorage.setItem('username', response.data.username);
               localStorage.setItem('token', response.data.token);
               this.props.checkLogin();
          })
          .catch(err => {
               alert('Invalid login.');
               console.log(err);
          })
     }

     render(){
          return(
               <div>
                    <div style={{display: 'none'}}>
                         {this.props.loggedInId && <Redirect to='/'/>}
                    </div>
                    <h2>Log In</h2>
                    
                    <form onSubmit={this.logIn}>
                         <input required
                              type="text"
                              name="username"
                              placeholder="Username"
                              value={this.state.username}
                              onChange={this.handleChange}
                         />

                         <input required
                              type="password"
                              name="password"
                              placeholder="Password"
                              value={this.state.password}
                              onChange={this.handleChange}
                         />

                         <Button type="submit">Submit</Button>
                    </form>
                    <Link to='/signup'><p>Sign Up</p></Link>
               </div>
          )
     }
}

export default LoginPage;