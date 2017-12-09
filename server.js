const express = require('express'),
     app = express(),
     PORT = process.env.PORT || 8080;

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const secretKey = 'bswdftfall2017';

const cors = require('cors');
app.use(cors());

app.use(express.json());
app.use(express.urlencoded({extended: true}));

const path = require('path');

app.use(express.static(__dirname + '/mbrace_front/build'));

const knex = require('knex')({
     client: 'postgres',
     connection: {
       host     : '127.0.0.1',
       user     : 'postgres',
       password : 'postgres',
       database : 'mbrace',
       charset  : 'utf8'
     }
});

const bookshelf = require('bookshelf')(knex);
const moment = require('moment');

// database models
const Board = bookshelf.Model.extend({
     tableName: 'boards',
     posts: function(){
          return this.hasMany(Post);
     }
});

const Post = bookshelf.Model.extend({
     tableName: 'posts',
     board: function(){
          return this.belongsTo(Board);
     },
     user: function(){
          return this.belongsTo(User);
     },
     comments: function(){
          return this.hasMany(PostComment);
     },
     follows: function(){
          return this.hasMany(Follow);
     }
});

const PostComment = bookshelf.Model.extend({
     tableName: 'comments',
     post: function(){
          return this.belongsTo(Post);
     },
     user: function(){
          return this.belongsTo(User);
     }
});

const User = bookshelf.Model.extend({
     tableName: 'users',
     posts: function(){
          return this.hasMany(Post);
     },
     comments: function(){
          return this.hasMany(PostComment);
     },
     follows: function(){
          return this.hasMany(Follow);
     }
});

const Follow = bookshelf.Model.extend({
     tableName: 'follows',
     post: function(){
          return this.belongsTo(Post);
     },
     user: function(){
          return this.belongsTo(User);
     }
});

// functions

function authorize(req, res, next){
     const token = req.headers['authorization'];
     jwt.verify(token, secretKey, (err, decoded) => {
          if(err || !decoded){
               return res.sendStatus(403);
          }
          else{
               next();
          }
     });
}

function formatPostObj(posts){
     const postObjects = posts.map(post => {
          return {
               id: post.attributes.id,
               time_posted: post.attributes.time_posted,
               title: post.attributes.title,
               posted_by: post.relations.user.attributes.username,
               comment_count: post.relations.comments.length,
               user_id: post.attributes.user_id
          };
     })
     .sort((a, b) => {
          return b.time_posted > a.time_posted;
     });
     return postObjects;
}

// endpoints

// get all boards and the number of posts in each
app.get('/app/boards', (req, res)=>{
     Board.fetchAll({withRelated: 'posts'})
     .then(boards => {
          boards = boards.map(board => {
               return {
                    id: board.attributes.id,
                    name: board.attributes.name,
                    post_count: board.relations.posts.length
               }
          });
          res.json(boards);
     })
     .catch(err => {
          res.sendStatus(500);
     });
});

// make a new board
app.post('/app/boards', (req, res)=>{
     new Board({
          name: req.body.name,
     })
     .save()
     .then(savedBoard=>{
          res.json(savedBoard);
     })
     .catch(err=>{
          res.sendStatus(500);
     })
})

// search for posts matching a query string with the author and the number of comments in each, sorted by latest first
app.get('/app/search', (req, res)=>{
     const queries = req.query.text.split(' ');
     Post.query(qb => {
          queries.forEach(qTerm => {
               qb.where(function(){
                    this.where('text', 'ILIKE' , '%' + qTerm + '%')
                    .orWhere('title', 'ILIKE', '%' + qTerm + '%')
               });
          });
     })
     .fetchAll({withRelated: ['user', 'comments']})
     .then(posts => {
          const output = {
               posts: formatPostObj(posts),
          }
          res.json(output);
     })
     .catch(err => {
          res.sendStatus(500);
     })
});

// get all posts in a board, the author, and the number of comments in each, sorted by latest first
app.get('/app/boards/:id', (req, res)=>{
     Board.where({id: req.params.id})
     .fetch({withRelated: ['posts', 'posts.user', 'posts.comments']})
     .then(board => {
          const output = {
               id: board.attributes.id,
               name: board.attributes.name,
               posts: formatPostObj(board.relations.posts)
          }
          res.json(output);
     })
     .catch(err => {
          res.sendStatus(500);
     });
});

// add a new post to a board and follow the post
app.post('/app/boards/:id', authorize, (req, res)=>{
     let createdPost = {};
     new Post({
          title: req.body.title,
          text: req.body.text,
          board_id: req.params.id,
          user_id: req.body.user_id,
          time_posted: moment().format("MMM DD, YYYY // hh:mmA"),
     })
     .save()
     .then(savedPost => {
          createdPost = savedPost.attributes;
          return new Follow({
               user_id: req.body.user_id,
               post_id: createdPost.id,
          })
          .save()
     })
     .then(savedFollow => {
          const output = {
               comment_count: 0,
               id: createdPost.id,
               time_posted: createdPost.time_posted,
               title: createdPost.title,
               posted_by: req.body.username,
               user_id: req.body.user_id,
          }
          res.json(output);
     })
     .catch(err => {
          res.sendStatus(500);
     });
});

// edit a post
app.put('/app/posts/:id', authorize, (req, res)=>{
     const post_id = req.params.id;
     Post.where({
          id: post_id,
          user_id: req.body.user_id,
     })
     .fetch()
     .then(retrievedPost => {
          if(retrievedPost){
               return new Post({id: post_id})
               .save({text: req.body.text})
          }
     })
     .then(updatedPost => {
          res.json(updatedPost);
     })
     .catch(err => {
          res.sendStatus(500);
     });
});

// delete a post
app.delete('/app/posts/:id', authorize, (req, res)=>{
     Post.where({
          id: req.params.id,
          user_id: req.body.user_id,
     })
     .destroy()
     .then(result => {
          res.send('deleted');
     })
     .catch(err => {
          res.sendStatus(500);
     });
});

// get all comments in a post and the author of each, sorted by latest first
app.get('/app/posts/:id', (req, res)=>{
     Post.where({id: req.params.id})
     .fetch({withRelated: ['comments', 'comments.user', 'user', 'follows', 'board']})
     .then(post => {
          const output = {
               id: post.attributes.id,
               title: post.attributes.title,
               time_posted: post.attributes.time_posted,
               text: post.attributes.text,
               posted_by: post.relations.user.attributes.username,
               user_id: post.relations.user.attributes.id,
               board_id: post.relations.board.attributes.id,
               following: post.relations.follows.map(follow => {
                    return follow.attributes.user_id;
               }),
               comments: post.relations.comments.map(comment => {
                    return {
                         id: comment.attributes.id,
                         time_posted: comment.attributes.time_posted,
                         text: comment.attributes.text,
                         posted_by: comment.relations.user.attributes.username,
                         user_id: comment.relations.user.attributes.id
                    };
               })
               .sort((a, b) => {
                    return a.time_posted > b.time_posted;
               })
          }
          res.json(output);
     })
     .catch(err => {
          res.sendStatus(500);
     });
});

// add a new comment to a post and follow the post
app.post('/app/posts/:id', authorize, (req, res)=>{
     let createdComment;
     new PostComment({
          text: req.body.text,
          post_id: req.params.id,
          user_id: req.body.user_id,
          time_posted: moment().format("MMM DD, YYYY // hh:mmA"),
     })
     .save()
     .then(savedComment => {
          createdComment = savedComment.attributes;
          return Follow.where({
               user_id: req.body.user_id,
               post_id: req.params.id,
          })
          .fetch()
     })
     .then(returnedFollow => {
          if(!returnedFollow){
               return new Follow({
                    user_id: req.body.user_id,
                    post_id: req.params.id,
               })
               .save()
          }
     })
     .then(savedFollow => {
          const output = {
               id: createdComment.id,
               time_posted: createdComment.time_posted,
               text: createdComment.text,
               posted_by: req.body.username,
               user_id: req.body.user_id,
          }
          res.json(output);
     })
     .catch(err => {
          res.sendStatus(500);
     });
});

// edit a comment
app.put('/app/comments/:id', authorize, (req, res)=>{
     const comment_id = req.params.id;
     PostComment.where({
          id: comment_id,
          user_id: req.body.user_id,
     })
     .fetch()
     .then(retrievedComment => {
          if(retrievedComment){
               return new PostComment({id: comment_id})
               .save({text: req.body.text})
          }
     })
     .then(updatedComment => {
          res.json(updatedComment);
     })
     .catch(err => {
          res.sendStatus(500);
     });
});

// delete a comment
app.delete('/app/comments/:id', authorize, (req, res)=>{
     PostComment.where({
          id: req.params.id,
          user_id: req.body.user_id,
     })
     .destroy()
     .then(result => {
          res.send('deleted');
     })
     .catch(err => {
          res.sendStatus(500);
     });
});

// register a user
app.post('/app/register', (req, res)=>{
     const username = req.body.username;
     const password = req.body.password;
     bcrypt.genSalt(12, (err, salt)=>{
          if(err){
               return res.sendStatus(500);
          }
          bcrypt.hash(password, salt, (err, hashedPwd)=>{
               if(err){
                    return res.sendStatus(500);
               }
               new User({
                    username: username,
                    password: hashedPwd
               })
               .save()
               .then(savedUser => {
                    const payload = {
                         iss: 'mbrace',
                         sub: username,
                         exp: Math.floor((Date.now() / 1000) + (60 * 60)),
                    }
                    const token = jwt.sign(payload, secretKey);
                    res.status(200).json({
                         user_id: savedUser.attributes.id,
                         username: savedUser.attributes.username,
                         token: token,
                    });
               })
               .catch(err =>{
                    res.sendStatus(400);
               })
          })
     })
});

// log in to account
app.post('/app/login', (req, res)=>{
     const username = req.body.username;
     const password = req.body.password;
     User.where({username: username})
     .fetch()
     .then(retrievedUser => {
          const account = retrievedUser;
          bcrypt.compare(password, account.attributes.password, (err, match) => {
               if(err){
                    res.sendStatus(500);
               }
               else if(match){
                    const payload = {
                         iss: 'mbrace',
                         sub: username,
                         exp: Math.floor((Date.now() / 1000) + (60 * 60 * 24)),
                    }
                    const token = jwt.sign(payload, secretKey);
                    res.status(200).json({
                         user_id: account.attributes.id,
                         username: account.attributes.username,
                         token: token,
                    });
               }
               else{
                    res.sendStatus(401);
               }
          })
     })
     .catch(err => {
          res.status(400).send('user does not exist');
     })
});

// get all followed posts, the author, and the number of comments in each, sorted by time posted
app.get('/app/follow/:id', (req, res)=>{
     User.where({id: req.params.id})
     .fetch({withRelated: ['follows', 'follows.post', 'follows.post.user', 'follows.post.comments']})
     .then(user => {
          const output = {
               id: req.params.id,
               username: user.attributes.username,
               posts: formatPostObj(user.relations.follows.map(follow => {
                    return follow.relations.post;
               }))
          };
          res.json(output);
     })
     .catch(err => {
          res.status(400).send('user does not exist');
     })
});

// follow a post
app.post('/app/follow/:id', authorize, (req, res)=>{
     new Follow({
          user_id: req.body.user_id,
          post_id: req.params.id,
     })
     .save()
     .then(savedFollow => {
          res.json(savedFollow);
     })
     .catch(err => {
          res.sendStatus(500);
     });
});

// unfollow a post
app.delete('/app/follow/:id', authorize, (req, res)=>{
     Follow.where({
          user_id: req.body.user_id,
          post_id: req.params.id,
     })
     .destroy()
     .then(result => {
          res.send('deleted');
     })
     .catch(err => {
          res.sendStatus(500);
     });
});

app.get('*', (req, res) => {
     res.sendFile(__dirname + '/mbrace_front/build/index.html');
});

console.log("about to listen on", PORT);
app.listen(PORT, () => {
     console.log('server listening on port', PORT);
});
