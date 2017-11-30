import React, { Component } from 'react';
import {Route, Switch, Link, withRouter} from 'react-router-dom';
import {Navbar} from 'react-materialize';
import HomePage from './HomePage';
import BoardPage from './BoardPage';
import PostPage from './PostPage';
import SignupPage from './SignupPage';
import LoginPage from './LoginPage';
import ProfilePage from './ProfilePage';
import SearchPage from './SearchPage';

class App extends Component {
     constructor(){
          super();
          this.state = {
               loggedInId: 0,
               loggedInUser: '',
          }
          this.checkLogin = this.checkLogin.bind(this);
          this.logOut = this.logOut.bind(this);
          this.checkError = this.checkError.bind(this);
     }

     checkLogin(){
          this.setState({
               loggedInId: parseInt(localStorage.getItem('user_id'), 10),
               loggedInUser: localStorage.getItem('username'),
          });
     }

     getToken(){
          return localStorage.getItem('token');
     }

     logOut(){
          localStorage.clear();
          this.setState({
               loggedInId: 0,
               loggedInUser: '',
          }, this.props.history.push("/"));
     }

     checkError(status){
          if(status===403){
               alert("Session expired, please log in again.")
               return this.logOut();
          }
     }

     componentWillMount(){
          this.checkLogin();
     }

     render() {
          const navButtons = this.state.loggedInId ? 
               [<li key="profile"><Link to={'/profile/' + this.state.loggedInId}>Profile</Link></li>,
                    <li key="logout"><Link to='/' onClick={this.logOut}>Log Out</Link></li>
               ] :
               [<li key="login"><Link to='/login'>Log In</Link></li>,
                    <li key="signup"><Link to='/signup'>Sign Up</Link></li>
               ];
          return (
               <div>
                    <Navbar className="navbar--color" brand="MBrace" left>
                         <div className="nav-wrapper">
                              <ul>
                                   <li key="home"><Link to='/'>Home</Link></li>
                                   <li key="search"><Link to='/search'>Search</Link></li>
                                   {navButtons}
                              </ul>
                         </div>
                    </Navbar>
                    <Switch>
                         <Route exact path="/" render={()=><HomePage/>}/>
                         <Route path="/boards/:boardId" render={({match})=><BoardPage
                              match={match}
                              loggedInId={this.state.loggedInId}
                              loggedInUser={this.state.loggedInUser}
                              getToken={this.getToken}
                              checkError={this.checkError}
                         />}/>
                         <Route path="/posts/:postId" render={({match})=><PostPage
                              match={match}
                              loggedInId={this.state.loggedInId}
                              loggedInUser={this.state.loggedInUser}
                              getToken={this.getToken}
                              checkError={this.checkError}
                         />}/>
                         <Route path="/signup" render={()=><SignupPage
                              loggedInId={this.state.loggedInId}
                              checkLogin={this.checkLogin}
                         />}/>
                         <Route path="/login" render={()=><LoginPage
                              loggedInId={this.state.loggedInId}
                              checkLogin={this.checkLogin}
                         />}/>
                         <Route path="/profile/:userId" render={({match})=><ProfilePage
                              match={match}
                         />}/>
                         <Route path="/search" render={()=><SearchPage/>}/>
                    </Switch>
               </div>
          );
     }
}

export default withRouter(App);
