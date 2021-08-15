import React, { useState, useEffect, useContext } from 'react'
import Header from '../Components/Header';
import { firebaseDB } from "../config/firebase";
import { AuthContext } from '../context/AuthProvider';
import CircularProgress from '@material-ui/core/CircularProgress';
import { useParams } from "react-router-dom";
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import Typography from '@material-ui/core/Typography';
import Dialog from '@material-ui/core/Dialog';
import MuiDialogContent from '@material-ui/core/DialogContent';
import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import './Profile.css'
const useStyles = makeStyles({
    bavatar:
    {
        height: '23vh',
        width: '40%',
        margin: '0'
    },
    tfw: {
        fontWeight: '300'
    },
    tfw2: {
        fontWeight: '500',
        marginLeft: '2%'
    },
    seeComments: {
        height: '54vh',
        overflowY: 'auto'
    }
})
export default function Profile() {
    const [openId, setOpenId] = React.useState(null);
    const [comments, setComments] = useState({})
    // const [open, setOpen] = useState(false);
    const handleClickOpen = (id) => {
        setOpenId(id);
    };
    const handleClose = () => {
        setOpenId(null);
    };
    const classes = useStyles();
    const [userData, setUserData] = useState(null);
    const [numberOfPosts, setPosts] = useState(null);
    const { currUser } = useContext(AuthContext);
    let { id } = useParams();
    useEffect(() => {
        firebaseDB.collection("posts")
        const unsub = firebaseDB.collection("users").doc(currUser.uid).onSnapshot((doc) => {
            // doc.data() is never undefined for query doc snapshots
            let document = doc.data();
            setUserData(document);
            setPosts(document.postsCreated.length);
        })
        return () => { unsub() };
    }, [id]);


    return (
        <>
            {
                userData == null ? <CircularProgress /> : <>
                    <Header userData={userData} />
                    <div className='spacer'></div>
                    <div className='pg-container'>
                        <div className='upper-part'>
                            <div className='bimg'>
                                <img src={userData?.profileImageUrl} />
                            </div>
                            <div className='info'>

                                <Typography align='center' variant='h6' className={classes.tfw}>
                                    {userData?.username}
                                </Typography>
                                <div className='post-cal'>
                                    <Typography display='inline' align='center' variant='subtitle1' className={classes.tfw}>
                                        No of Posts
                                    </Typography>
                                    <Typography display='inline' align='center' variant='subtitle1' className={classes.tfw2} >
                                        {numberOfPosts} Posts
                                    </Typography>
                                </div>
                                <div className='post-cal'>
                                    <Typography display='inline' align='center' variant='subtitle1' className={classes.tfw}>
                                        Email -
                                    </Typography>
                                    <Typography display='inline' align='center' variant='subtitle1' className={classes.tfw2} >
                                        {userData?.email}
                                    </Typography>
                                </div>
                            </div>
                        </div>
                    </div>

                </>
            }
        </>
    )
}
