import { IDataAccessObject } from "@dao/IDataAccessObject";
import { UserDao } from "@dao/models/Users/UserDao";
import { EUserState, IUser } from "@server/dao/models/Users/IUser";
import { JWT } from "@server/utils/Jwt";
import { Security } from "@utils/Security";

export class Users {
  private userDao: UserDao;
  constructor(user: IDataAccessObject) {
    this.userDao = user as UserDao;
  }
  public async newUser(name:string, email: string, password: string) {
    try {
      const newUser = {
        name,
        email,
        password: Security.encodePassword(password),
        pswdExpires: new Date(new Date().getTime()+(3 * 30 * 24 * 60 * 60 * 1000))
      };
      const result = await this.userDao.create(newUser);
      const rt = await this.userDao.findOneByFilter({ _id: result?.insertedId });
      delete rt.password;
      return rt;
    } catch (ex) {
      console.error('newFoda error:', ex);
      return null;
    }
  }
  public async loginUser(name:string, password:string) {
    try{
      const dbUser = await this.userDao.findOneByFilter(
        {name},
        {projection:{_id:1,name:1, email:1, password:1, state:1, roles:1, pswdExpires:1, avatar:1}}
      );
      if (Security.verifyPassword(password, dbUser.password)){
        delete dbUser.password;
        delete dbUser.pswdExpires;
        delete dbUser.state;
        // JWT
        const token = JWT.singJWT(dbUser);
        return token;
      }
      console.error("User.loginUser can´t validate password");
      throw new Error("Can´t Validate Credentials");
    }catch(err){
      console.error(err);
      throw new Error("Can´t Validate Credentials");
    }
  }

  //actualizacion de usuario, email, mane, contraseña
  private async setUpdates(userId, updateCmd: Partial<IUser>) {
    await this.userDao.update(userId, { ...updateCmd, updatedAt: new Date() });
    const updatedFoda = await this.userDao.findByID(userId);
    return updatedFoda;
  }
  public setName(userId: string, name: string) {
    return this.setUpdates(userId, { name: name });
  }
  public setPassword(userId: string, password: string) {
    const pswdExpires= new Date(new Date().getTime()+(3 * 30 * 24 * 60 * 60 * 1000));
    return this.setUpdates(userId, { password: password,pswdExpires: pswdExpires });
  }

  public setState(userId: string, state: EUserState) {
    return this.setUpdates(userId, { state: state });
  }

  public setRoles(userId: string, roles: string[]) {
    return this.setUpdates(userId, { roles: roles });
  }

  public setEmail(userId: string, email: string) {
    return this.setUpdates(userId, { email: email });
  }

  public updPassword(userId: string, name: string, password: string, newpassword:string){
    if(this.loginUser(name,password)){
      newpassword= Security.encodePassword(newpassword),
      this.setPassword(userId,newpassword)
    }
  }


}
