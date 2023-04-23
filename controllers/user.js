const User = require('../models/User');

exports.getUser = (req,res,next)=> {
    User.findAllUser()
        .then((result) => {
            res.json(result);
        }).catch((err) => {
            console.log(err);
        });
}

exports.postUser = async (req,res,next)=> {
      const mobile = req.body.mobile;
      const name = req.body.name;
      const email = req.body.email;
      const user = new User(name,email,mobile);
      user.save().then((result) => {
        console.log('user created', result);
        res.status(201).json({newUserDetail: result });
      }).catch((err) => {
        console.log(err);
        res.status(500).json({error:err})
      });
}

exports.getDelete = async (req,res,next)=> {
    try{
    const userId = req.params.userId;
    const userField = await User.deleteById(userId)
    res.status(201).json({delete: userField})
    } catch(err) {
      console.error(err);
    }
}
