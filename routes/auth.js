const {
  login,
  LoginExternalUser,
  register,
  getAllUsers,
  setAvatar,
  logOut,
} = require("../controllers/userController");
const jwt = require("jsonwebtoken");

const router = require("express").Router();

//Validar JWT token
router.use((req, res, next) => {
  console.log(req.path)
  if(req.path === "/login" || req.path === "/externaluser" || req.path === "/register") return next();

  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (token == null) return res.sendStatus(401);

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      console.log(err);
      return res.sendStatus(403);
    }

    req.user = user;
    next();
  });
});

router.post("/login", login);
router.post("/externaluser", LoginExternalUser);
router.post("/register", register);
router.get("/allusers/:id", getAllUsers);
router.post("/setavatar/:id", setAvatar);
router.get("/logout/:id", logOut);

module.exports = router;
