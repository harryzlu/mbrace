
exports.seed = function(knex, Promise) {
     return knex('comments').del()
     .then(response => {
          return knex('follows').del();
     })
     .then(response => {
          return knex('posts').del();
     })
     .then(response => {
          return knex('users').del();
     })
     .then(response => {
          return knex('boards').del();
     })
     .then(function () {
          return knex('boards').insert([
               {id: 1, name: 'General Discussion'},
               {id: 2, name: 'Depression'},
               {id: 3, name: 'Bipolar Disorders'},
               {id: 4, name: 'Anxiety Disorders'},
               {id: 5, name: 'Schizophrenia & Psychosis'},
               {id: 6, name: 'Eating Disorders'},
          ]);
     })
     .then(function () {
          return knex('users').insert([
               {id: 1, username: 'harry', password: 'hahahahaha'},
               {id: 2, username: 'antoine', password: 'hahahahaha'},
               {id: 3, username: 'chris', password: 'hahahahaha'},
               {id: 4, username: 'brent', password: 'hahahahaha'},
          ]);
     })
     .then(function () {
          return knex('posts').insert([
               {id: 1, time_posted: 'Nov 26, 2017 // 10:40PM', title: 'Test post.', text: 'Hello?', rating: 0, board_id: 2, user_id: 3},
               {id: 2, time_posted: 'Nov 26, 2017 // 10:45PM', title: 'Another Test.', text: 'Hello world', rating: 0, board_id: 1, user_id: 1},
               {id: 3, time_posted: 'Nov 27, 2017 // 10:01AM', title: 'Testing.', text: 'Yo yo yo', rating: 0, board_id: 1, user_id: 2},
               {id: 4, time_posted: 'Nov 27, 2017 // 12:42PM', title: 'Test Test.', text: 'Is anybody home?', rating: 0, board_id: 1, user_id: 1}
          ]);
     })
     .then(function () {
          return knex('comments').insert([
               {id: 1, time_posted: 'Nov 27, 2017 // 10:45PM', text: 'test comment', rating: 0, post_id: 1, user_id: 1},
               {id: 2, time_posted: 'Nov 27, 2017 // 10:46PM', text: 'test comment', rating: 0, post_id: 2, user_id: 2},
               {id: 3, time_posted: 'Nov 27, 2017 // 10:47PM', text: 'test comment', rating: 0, post_id: 3, user_id: 4},
               {id: 4, time_posted: 'Nov 27, 2017 // 10:48PM', text: 'test reply', rating: 0, post_id: 1, user_id: 3}
          ]);
     })
     .then(function () {
          return knex('follows').insert([
               {id: 1, user_id: 3, post_id: 1},
               {id: 2, user_id: 1, post_id: 2},
               {id: 3, user_id: 2, post_id: 3},
               {id: 4, user_id: 1, post_id: 4},
               {id: 5, user_id: 1, post_id: 1},
               {id: 6, user_id: 2, post_id: 2},
               {id: 7, user_id: 4, post_id: 3},
          ]);
     })
     .catch(err => {
          console.log(err);
     });
};
