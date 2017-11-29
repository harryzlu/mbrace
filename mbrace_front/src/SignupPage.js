import React, { Component } from 'react';
import {Link, Redirect} from 'react-router-dom';
import {Button} from 'react-materialize';

const axios = require('axios');
const PORT = process.env.PORT || 8080;

class SignupPage extends Component{
     constructor(){
          super();
          this.state = {
               username: '',
               password: '',
          }
          this.handleChange = this.handleChange.bind(this);
          this.signUp = this.signUp.bind(this);
     }

     handleChange(e){
          this.setState({
               [e.target.name]: e.target.value,
          })
     }

     signUp(e){
          e.preventDefault();
          if(this.state.password.length < 8){
               alert('password should be 8 characters or longer');
               return;
          }
          const signupBody = {
               username: this.state.username,
               password: this.state.password,
          }
          axios.post('http://localhost:' + PORT + '/register', signupBody)
          .then(response => {
               localStorage.setItem('user_id', response.data.user_id);
               localStorage.setItem('username', response.data.username);
               localStorage.setItem('token', response.data.token);
               this.props.checkLogin();
          })
          .catch(err => {
               alert('Invalid signup credentials, please try again.');
               console.log(err);
          })
     }

     render(){
          return(
               <div>
                    <div style={{display: 'none'}}>
                         {this.props.loggedInId && <Redirect to='/'/>}
                    </div>
                    <h2>Sign Up</h2>
                    
                    <form onSubmit={this.signUp}>
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
                    <Link to='/login'><p>Log In</p></Link>
               </div>
          )
     }
}

export default SignupPage;