var express = require('express');
const { createHash } = require('crypto');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

//Page rendering
router.get('/signup', function(req, res, next) {
  res.sendFile('/public/signup.html', { root: __dirname+"/.."});
});

router.get('/main', function(req, res, next) {
  //This is just to show that we now know who is logged in so build calendar details from the req.session.user.user_id
  if(req.session["user"])
  {
    res.send("User with ID " + req.session.user.user_id + " logged in!");
  }
  else
  {
    res.send("No user logged in!");
  }
});

router.get('/login', function(req, res, next) {
  res.sendFile('/public/login.html', { root: __dirname+"/.."});
});


//login signup stuff
router.post('/loginuser', function(req, res) {
  let email = req.body.email;
  let passHash = hash(req.body.password);
  req.pool.getConnection(function(error, connection) {
    if(error){
      res.sendStatus(500);
      return;
    }

    let query = "SELECT user_id, password_hash FROM user WHERE email='" + email + "';";
    connection.query(query, function(error,rows, fields) {
      connection.release();
      if(error) {
        res.sendStatus(500);
        return;
      }
      else if(rows[0].password_hash == passHash)
      {
        //On success user ID is linked with session
        var loggedInUser = { user_id : rows[0].user_id, password_hash : passHash }
        req.session.user = loggedInUser;
        res.sendStatus(200);
        return;
      }
      else
      {
        res.sendStatus(401);
        return;
      }
      });

    });

  });

router.post('/signupuser', function(req, res) {
  let email = req.body.email;
  req.pool.getConnection(function(error, connection) {
    if(error){
      res.sendStatus(500);
      return;
    }

    let query = "SELECT * FROM user WHERE email='" + email + "';";
    connection.query(query, function(error,rows, fields) {
      if(error) {
        res.sendStatus(500);
        return;
      }
      if(rows.length>0)
      {
        connection.release();
        res.sendStatus(400);
        return;
      }
      else{
        let firstName = req.body.first_name;
        let lastName = req.body.last_name;
        let passHash = hash(req.body.password);

        let query = "INSERT INTO user (first_name, last_name, email, password_hash) VALUES ('" + firstName + "', '" + lastName + "', '" + email + "', '" + passHash + "');";
        connection.query(query, function(error,rows, fields) {
          connection.release();
          if(error) {
            res.sendStatus(500);
            return;
          }
          else{
            res.sendStatus(200);
            return;
          }
        });


      }

    });

  });
});

module.exports = router;

//Hash function
function hash(string) {
  return createHash('sha256').update(string).digest('hex');
}