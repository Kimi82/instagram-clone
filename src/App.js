import React, {useState, useEffect} from 'react';
import './App.css';
import Post from './Post/Post.js';
import { db, auth } from './firebase' 
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import { Button, Input } from '@material-ui/core'
import ImageUpload from './ImageUpload.js'
//import InstagramEmbed from 'react-instagram-embed'

function getModalStyle() {
  const top = 50;
  const left = 50;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

const  useStyles = makeStyles((theme) => ({
  paper: {
    position: 'absolute',
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));
  
function App() {
  const classes = useStyles();
  const [modalStyle] = useState(getModalStyle);
  const [posts, setPotsts] = useState([]);
  const [open, setOpen] = useState(false);
  const [openSignIn, setOpenSignIn] = useState('')
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [user, setUser] = useState(null)

  useEffect(() =>{
    const unsubscribe = auth.onAuthStateChanged((authUser)=>{
      if (authUser){
        setUser(authUser);
    }
    })
    return () =>{
      unsubscribe();
    }
  }, [user, username])
  
  
  
  useEffect(() =>{ 
    db.collection('posts').orderBy('timestamp', 'desc').onSnapshot(snapshot => {
    setPotsts(snapshot.docs.map(doc => ({
      id: doc.id,
      post: doc.data()
      })));
    
    })
  }, [])
  
  const signUp = (e) =>{
    e.preventDefault();
    auth
    .createUserWithEmailAndPassword(email, password)
    .then((authUser) => {
      return authUser.user.updateProfile({
        displayName: username
      })
    })
    .catch((error) => alert(error.message));
    setOpen(false)
  }

  const signIn = (e) => {
    e.preventDefault();
    auth
    .signInWithEmailAndPassword(email, password)
    .catch((error) => alert(error.message))
    setOpenSignIn(false)
  }
  
  return (
  <div className="app">
  
    
  {user ? (
    <ImageUpload username={user.displayName}/>
  ): (
    <h3>If you want to add the post, you need to login.</h3>
   )}
  

    <Modal
      open={open}
      onClose={() => setOpen(false)}>
      <form className="app__signup">
      <div style={modalStyle} className={classes.paper}>
      <Input 
        placeholder="username"
        type="username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        />
      <Input 
        placeholder="email"
        type="text"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <Input 
        placeholder="password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)} 
      />
      <Button type='submit' onClick={signUp}>Sign Up</Button>
      </div>
    </form>
    </Modal> 

    <Modal
      open={openSignIn}
      onClose={() => setOpenSignIn(false)}>
      <form className="app__signup">
      <div style={modalStyle} className={classes.paper}>

      <Input 
        placeholder="email"
        type="text"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <Input 
        placeholder="password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)} 
      />
      <Button type='submit' onClick={signIn}>Sign In</Button>
      </div>
    </form>
    </Modal> 

    <div className="app__header">
      <img
        className="app__headerImage"
        src="https://www.instagram.com/static/images/web/mobile_nav_type_logo-2x.png/1b47f9d0e595.png"
        alt="logo">
      </img>

      {user?.displayName ? <Button onClick={() =>{
         auth.signOut();
         window.location.reload(false)}}>Logout</Button> 
        : 
        <div className="app__loginContainer">
        <Button onClick={() => setOpenSignIn(true)}>Sign In</Button>
        <Button onClick={() => setOpen(true)}>Sign UP</Button>
        </div>
        }
    </div>

    <div className="app_posts">
      {
          posts.map(({id ,post}) =>(
         <Post key={id} user={user} postId={id} username={post.username} caption={post.caption} imageUrl={post.imageUrl}/>
       ))
      }
     </div>

      

    
      <header className="app-header">

        
       
      
      </header>
    </div>
  );
}

export default App;
