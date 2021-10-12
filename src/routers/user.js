import express from 'express';
import multer from 'multer';

const upload = multer({ dest: 'uploads/' });

const userRouter = express.Router();

const USER = {
  3: {
    nickname: 'test',
    profileImage: undefined,
  },
  4: {
    nickname: 'test2',
    profileImage: undefined,
  },
};

userRouter.get('/', (req, res) => {
  res.send('User List');
});

userRouter.get('/:id', (req, res) => {
  const userId = req.params.id;
  const userInfo = USER[userId];

  if (!userInfo) {
    const err = new Error('User not found.');
    err.statusCode = 404;
    throw err;
  }

  const resMimeType = req.accepts(['json', 'html']);

  if (resMimeType === 'json') {
    res.send(userInfo);
  } else if (resMimeType === 'html') {
    res.render('user-profile', {
      userInfo,
      userId,
    });
  }
});

userRouter.post('/', (req, res) => {
  res.send('User Register');
});

userRouter.post('/:id/nickname', (req, res) => {
  const { id } = req.params;
  const { nickname } = req.body;

  const userInfo = USER[id];
  userInfo.nickname = nickname;

  res.send(userInfo);
});

userRouter.post('/:id/profile', upload.single('profile'), (req, res) => {
  const userId = req.params.id;
  const userInfo = USER[userId];

  const filePath = '/' + req.file.path.replace(/\\/, '/');

  userInfo.profileImage = filePath;

  res.send('User profile image uploaded.');
});

export default userRouter;
