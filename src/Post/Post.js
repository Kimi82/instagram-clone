import React, {useState, useEffect} from 'react';
import './Post.css'
import Avatar from '@material-ui/core/Avatar'
import { db } from '../firebase'
import firebase from "firebase"

function Post ({username, caption, imageUrl, postId, user}) {
    const [comments, setComments] = useState([])
    const [comment, setComment] = useState('')
    
    useEffect(() => {
        let unsubscibe;
        if (postId){
            unsubscibe = db 
                .collection("posts")
                .doc(postId)
                .collection("comments")
                .orderBy("timestamp", "desc")
                .onSnapshot((snapshot) =>{
                    setComments(snapshot.docs.map((doc) => doc.data()));
                });
        }
        return () =>{
            unsubscibe();
        };
    }, [postId])

    const postComment = (e) =>{
        e.preventDefault();
        db.collection("posts").doc(postId).collection("comments").add({
            text: comment,
            username: user.displayName,
            timestamp: firebase.firestore.FieldValue.serverTimestamp()
        });
        setComment('');
    }

    return (
        <div className="post">
            <div className="post__header">
            <Avatar
                className="post__avatar"
                alt={username}
                src="nieDzialaSource"
            />
            <h3>{username}</h3>
            </div>
            <img className="post__image" src={imageUrl} alt="Element not found"></img> 
            <h4 className="post__comment"><strong>{username}:</strong> {caption}</h4>
            
            <div className="post__comments">
                {comments.map((comment) => (
                    <p>
                        <strong>{comment.username}:</strong> {comment.text} 
                    </p>
                )
                
                )}
            </div>
            
            {user && (
            <form className="post__commentWrapper">
                <input
                className="post__input"
                type="text"
                placeholder="Add a comment..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                />
            <button
                disabled={!comment}
                className="post__button"
                type="submit"
                onClick={postComment}
                >
                Post
                </button>
            </form>
            )}
        </div>
    )
}

export default Post
