import React, { useContext, useEffect, useState } from "react";
import { firebaseDB, timeStamp } from "../config/firebase";
import ReactDOM from "react-dom";
import ChatBubbleIcon from '@material-ui/icons/ChatBubble';
import { useHistory } from "react-router-dom";
import Dialog from '@material-ui/core/Dialog';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import IconButton from '@material-ui/core/IconButton';
import MuiDialogContent from '@material-ui/core/DialogContent';
import { AuthContext } from "../context/AuthProvider";
import {
    Card,
    CardHeader,
    CardActions,
    CardContent,
    CardMedia,
    Button,
    makeStyles,
    Typography,
    TextField,
    Avatar,
    Container,
} from "@material-ui/core";
import { Favorite, FavoriteBorder } from "@material-ui/icons";
import "./VideoPosts.css";

const VideoPost = (props) => {
    let [user, setUser] = useState(null);
    const [openId, setOpenId] = useState(null);
    const [posts, setPosts] = useState(null);
    let [comment, setComment] = useState("");
    let [commentList, setCommentList] = useState([]);
    let [likesCount, setLikesCount] = useState(null);
    let [isLiked, setIsLiked] = useState(false);
    let { currUser } = useContext(AuthContext);
    const history = useHistory();
    // { comment , profilePhotoUrl }

    const useStyles = makeStyles({
        videoContainerSize: {
            height: "50%",
        },
        root: {
            width: '100%',
            padding: '0px'
        },
        loader: {
            position: 'absolute',
            left: '50%',
            top: '50%'
        },
        typo: {
            marginLeft: '2%'
        },
        vac: {
            marginLeft: '3.5%',
            color: '#8e8e8e',
            cursor: 'pointer'
        },
        dp: {
            marginLeft: '2%'
        },
        cc: {
            height: '50vh',
            overflowY: 'auto'
        },
        seeComments: {
            height: '54vh',
            overflowY: 'auto'
        },
        ci: {

            color: 'grey',
            left: '9%',
            cursor: 'pointer'
        },
        mn: {
            color: 'white',


        },
        tmn: {
            color: 'white'
        }
    });
    let classes = useStyles();

    const addCommentToCommentList = async (e) => {
        let profilePic;
        // when commenting user and post author user is same
        if (currUser.uid == user.userId) {
            profilePic = user.profileImageUrl;
        } else {
            let doc = await firebaseDB.collection("users").doc(currUser.uid).get();
            let user = doc.data();
            profilePic = user.profileImageUrl;
        }
        let newCommentList = [
            ...commentList,
            {
                profilePic: profilePic,
                comment: comment,
            },
        ];

        // add comments in firebase
        let postObject = props.postObj;
        postObject.comments.push({ uid: currUser.uid, comment: comment });
        // it will set a new post object with updated comments in firebase DB
        await firebaseDB.collection("posts").doc(postObject.pid).set(postObject);
        setCommentList(newCommentList);
        setComment("");
    };

    const toggleLikeIcon = async () => {
        if (isLiked) {
            // post liked hai to unlike the post
            // make isLiked = false;
            // in postDoc remove your uid in likes array !
            // setLikesCount(1 ? null : -1);
            let postDoc = props.postObj;
            let filteredLikes = postDoc.likes.filter(uid => {
                if (uid == currUser.uid) {
                    return false;
                }
                else {
                    return true;
                }
            });
            postDoc.likes = filteredLikes;
            await firebaseDB.collection("posts").doc(postDoc.pid).set(postDoc);
            setIsLiked(false);
            likesCount == 1 ? setLikesCount(null) : setLikesCount(likesCount - 1);
        }
        else {
            // post liked nhi hai to like the post
            // make isLiked = true;
            // in postDOc add your uid in likes array !
            // setLikesCount( null ? 1 : +1);
            let postDoc = props.postObj;
            postDoc.likes.push(currUser.uid);
            await firebaseDB.collection("posts").doc(postDoc.pid).set(postDoc);
            setIsLiked(true);
            likesCount == null ? setLikesCount(1) : setLikesCount(likesCount + 1);
        }
    }

    const handleProfileClick = (id) => {
        history.push(`/profile/${id}`)
    }
    const handleClickOpen = (id) => {
        setOpenId(id);
    };
    const handleClose = () => {
        setOpenId(null);
    };

    useEffect(async () => {
        console.log(props);
        let uid = props.postObj.uid;
        let doc = await firebaseDB.collection("users").doc(uid).get();
        let user = doc.data();
        let commentList = props.postObj.comments;
        let likes = props.postObj.likes;
        // {uid , comment} , {uid , comment} , {uid , comment};
        let updatedCommentList = [];

        for (let i = 0; i < commentList.length; i++) {
            let commentObj = commentList[i];
            let doc = await firebaseDB.collection("users").doc(commentObj.uid).get();
            let commentUserPic = doc.data().profileImageUrl;
            updatedCommentList.push({
                profilePic: commentUserPic,
                comment: commentObj.comment,
            });
        }

        if (likes.includes(currUser.uid)) {
            setIsLiked(true);
            setLikesCount(likes.length);
        } else {
            if (likes.length) {
                setLikesCount(likes.length);
            }
        }

        console.log(updatedCommentList);
        setUser(user);
        setCommentList(updatedCommentList);
    }, []); //comp did Mount

    return (
        <Container>
            <Card
                style={{
                    // height: "80vh",
                    width: "500px",
                    margin: "auto",
                    padding: "10px",
                    marginBottom: "20px",
                }}
            >
                <div className='place'></div>
                <span className="ab">
                    <Avatar className="a" variant="span" style={
                        {
                            display: 'inline-block',
                            marginRight: '20px',
                        }}
                        src={user ? user.profileImageUrl : ""}></Avatar>
                    <h4 className="a">{user ? user.username : ""} </h4>
                </span>
                <hr></hr>

                <div className="video-container">
                    <Video
                        className={classes.videoContainerSize}
                        src={props.postObj.videoLink}
                    ></Video>
                </div>
                <div>
                    {isLiked ? (
                        <Favorite
                            onClick={() => toggleLikeIcon()}
                            style={{ color: "red" }}
                        ></Favorite>
                    ) : (
                        <FavoriteBorder onClick={() => toggleLikeIcon()}></FavoriteBorder>
                    )}
                    <ChatBubbleIcon onClick={() => handleClickOpen(props.postObj.pid)} className={`${classes.ci} icon-styling`}
                        style={{
                            marginLeft: '5px',
                            color: 'lightgrey'
                        }} />
                </div>

                {likesCount && (
                    <div>
                        <Typography variant="p">Liked by {likesCount} others </Typography>
                    </div>
                )}

                <TextField
                    variant="outlined"
                    label="Add a comment"
                    size="small"
                    style={{
                        width: '50%',
                        marginRight: '5px',
                        marginTop: '5px',
                    }}
                    value={comment}
                    onChange={(e) => {
                        setComment(e.target.value);
                    }}
                ></TextField>
                <Button
                    variant="contained"
                    color="secondary"
                    style={{
                        width: '20%',
                        marginTop: '5px',
                    }}
                    onClick={addCommentToCommentList}
                >
                    Post
                </Button>

                <Dialog maxWidth="md" onClose={handleClose} aria-labelledby="customized-dialog-title" open={openId === props.postObj.pid}>
                    <MuiDialogContent>
                        <div className='dcontainer'>
                            <div className='video-part'>
                                <video autoPlay={true} className='video-styles2' controls id={props.postObj.pid} muted="muted" type="video/mp4" >
                                    <source src={props.postObj.videoLink} type="video/webm" />
                                </video>
                            </div>
                            <div className='info-part'>

                                <Card>
                                    <CardHeader
                                        avatar={
                                            <Avatar src={user?.profileImageUrl} aria-label="recipe" className={classes.avatar}>
                                            </Avatar>
                                        }
                                        action={
                                            <IconButton aria-label="settings">
                                                <MoreVertIcon />
                                            </IconButton>
                                        }
                                        title={user?.username}
                                    />

                                    <hr style={{ border: "none", height: "1px", color: "#dfe6e9", backgroundColor: "#dfe6e9" }} />
                                    <CardContent className={classes.seeComments}>


                                        {
                                            commentList.map((commentObj) => {
                                                return (
                                                    <>
                                                        <Avatar src={commentObj.profilePic}></Avatar>
                                                        <Typography variant="p">{commentObj.comment}</Typography>
                                                    </>
                                                );
                                            })
                                        }
                                    </CardContent>

                                </Card>
                                <div className='extra'>
                                    <div className='likes'>
                                        <div>
                                            {isLiked ? (
                                                <Favorite
                                                    onClick={() => toggleLikeIcon()}
                                                    style={{ color: "red" }}
                                                ></Favorite>
                                            ) : (
                                                <FavoriteBorder onClick={() => toggleLikeIcon()}></FavoriteBorder>
                                            )}
                                        </div>
                                        {likesCount && (
                                            <div>
                                                <Typography variant="p">Liked by {likesCount} others </Typography>
                                            </div>
                                        )}

                                    </div>
                                    <TextField
                                        variant="outlined"
                                        label="Add a comment"
                                        size="small"
                                        value={comment}
                                        onChange={(e) => {
                                            setComment(e.target.value);
                                        }}
                                    ></TextField>
                                    <Button
                                        variant="contained"
                                        color="secondary"
                                        onClick={addCommentToCommentList}
                                    >
                                        Post
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </MuiDialogContent>
                </Dialog>


            </Card>
        </Container>
    );
};

function Video(props) {
    const handleAutoScroll = (e) => {
        console.log(e);
        let next = ReactDOM.findDOMNode(e.target).parentNode.parentNode.parentNode
            .nextSibling;
        console.log(next);
        if (next) {
            next.scrollIntoView({ behaviour: "smooth" });
            e.target.muted = "true";
        }
    };
    return (
        <video
            autoPlay={true} className='video-styles2' controls muted="muted" type="video/mp4"
            style={{
                height: " 100%",
                width: "100%",
            }}
            onEnded={handleAutoScroll}
            onClick={(e) => {
                console.log(timeStamp());
            }}
        >
            <source src={props.src} type="video/mp4"></source>
        </video>
    );
}

export default VideoPost;

// <Typography variant="p">Comments</Typography>

