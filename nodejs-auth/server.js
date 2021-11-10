const express = require('express') //node express
const app = express()
const bcrypt = require('bcrypt')  //for password hash 

app.use(express.json());

const users = [];

//get users method
app.get('/users', (req, res) => {
  res.json(users)
})

//create new user method with hash password
app.post('/users', async (req, res) => {
  try {
    // const salt = await bcrypt.genSalt();
    // const hashedPassword = await bcrypt.hash(req.body.password,salt)
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    // console.log("hashedPassword",hashedPassword);
    const user = { username: req.body.username, password: hashedPassword }
    users.push(user)
    res.status(201).send();
  } catch (err) {
    // console.log("error",err)
    res.status(500).send();
  }
})

//user login method
app.post('/users/login', async (req, res) => {
  //find user
  const user = users.find((user) => user.username == req.body.username);

  //if user not exists send 400 and message
  if (!user) {
    res.status(400).send('User not find');
  }
  //if user exists compare password and success or error
  try {
    if (await bcrypt.compare(req.body.password, user.password)) {
      res.send('Success');
    } else {
      res.send('Not Allowed');
    }
  } catch (error) {
    res.status(500).send();
  }
})

app.listen(3000)
