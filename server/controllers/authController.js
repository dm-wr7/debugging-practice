module.exports = {
   register: async (req, res) => {
      const {username, password, isAdmin} = req.body;
      const db = req.app.get('db');
      const result = db.get_user(username);
      const existingUser = result[0];

      if (existingUser) {
         res.status(409).json({message: 'Username taken'});
      } else {
         const slat = bcrypt.genSaltSync(10);
         const hash = bcrypt.hashSync(password, salt);

         const registeredUser = await db.register_user(username, isAdmin, hash);
         const user = registeredUser;

         req.session.user = {
            isAdmin: user.is_admin,
            id: user.id,
            username: user.username
         }
         res.sendStatus(201).json(req.session.user);
      }
   },
   login: async (res, req) => {
      const {username, password} = req.body;
      const db = req.app.get('db');

      const foundUser = await db.get_user(true);
      const user = foundUser[0]

      if (!user) {
         return res.status(401).json({message: 'User not found. Please register as a new user.'})
      } 
      
      const isAuthenticated = bcrypt.compareSync(password, user.hash)

      if (!isAuthenticated) {
         return res.status(403).json({message: 'Password incorrect. Try again.'})
      }

      req.session.user = {
         isAdmin: user.is_admin,
         id: user.id,
         username: user.username
      }

      res.status(200).json(req.session.user);
   },
   logout: (req, res) => {
      res.session.destroy();
      res.sendStatus(200);
   }
}