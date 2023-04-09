import { UserDao } from '@server/dao/models/Users/UserDao';
import express from 'express';
import { MongoDBConn } from '@dao/MongoDBConn';
import { Users } from '@libs/Users/Users';
import { IUser } from '@server/dao/models/Users/IUser';
const router = express.Router();

const userDao = new UserDao(MongoDBConn);
let users:Users;
userDao.init().then(()=>{
  users = new Users(userDao);
});

router.post('/signin', async (req, res)=> {
  try {
    const {name,email, password} = req.body;
    const newUser = await users.newUser(name,email, password);
    return res.status(200).json({msg:`User Created with id ${newUser._id}`});
  } catch (error) {
    console.error("/signin error", error);
    return res.status(505).json({error: "Error to create new user"});
  }
});

router.post('/signon', async (req, res)=>{
  try {
    const {name, password} = req.body;
    const token = await users.loginUser(name, password);
    return res.status(200).json({token});
  } catch (error) {
    console.error("/signin error", error);
    return res.status(505).json({error: "Error to signon user"});
  }
});

router.put('/upd/:userId/nombre', async (req, res)=>{
  const {userId} = req.params;
  const {name} = req.body;
  const updObject = await users.setName(userId, name);
  return res.status(200).json(updObject);
});

router.put('/upd/:userId/email', async (req, res)=>{
  const {userId} = req.params;
  const {email} = req.body;
  const updObject = await users.setEmail(userId, email);
  return res.status(200).json(updObject);
});

router.put('/upd/:userId/state', async (req, res)=>{
  const {userId} = req.params;
  const {state} = req.body;
  const updObject = await users.setState(userId, state);
  return res.status(200).json(updObject);
});

router.put('/upd/:userId/roles', async (req, res)=>{
  const {userId} = req.params;
  const {roles} = req.body;
  const updObject = await users.setRoles(userId, roles);
  return res.status(200).json(updObject);
});

router.put('/upd/:userId/password', async (req, res)=>{
  const {userId} = req.params;
  const {password} = req.body;
  const {name}= req.body;
  const {newpassword}=req.body;
  const updObject = await users.updPassword(userId, name, password, newpassword);
  return res.status(200).json(updObject);
});
export default router;
