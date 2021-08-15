import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthProvider';
import { Button } from "@material-ui/core";
import PhotoCamera from "@material-ui/icons/PhotoCamera";
import { firebaseDB, firebaseStorage } from "../config/firebase";
import CircularProgress from '@material-ui/core/CircularProgress';
import { v4 as uuidv4 } from 'uuid';
import VideoPosts from './VideoPosts';
import './Feeds.css';
import UploadFile from './uploadFile';

const Feeds = (props) => {
    const { currUser } = useContext(AuthContext);
    const [videoFile, setVideoFile] = useState(null);
    const [posts, setPosts] = useState([]);
    const { signOut } = useContext(AuthContext);

    const handleLogOut = async () => {
        try {
            await signOut();
            props.history.push("/login");
        }
        catch (err) {
            console.log(err);
        }
    }

    const handleInputFile = (e) => {
        let file = e.target.files[0];
        setVideoFile(file);
    }

    const handleUploadFile = async () => {
        try {
            let uid = currUser.uid;
            let uploadVideoObject = firebaseStorage.ref(`/profile/${uid}/${Date.now()}.mp4`).put(videoFile);

            uploadVideoObject.on("state_changed", fun1, fun2, fun3);
            function fun1(snapshot) {
                let progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                console.log(progress);
            }

            function fun2(error) {
                console.log(error);
            }

            async function fun3() {
                let videoFileUrl = await uploadVideoObject.snapshot.ref.getDownloadURL();
                console.log(videoFileUrl);
                let pid = uuidv4();
                console.log(pid);
                await firebaseDB.collection("posts").doc(pid).set({
                    pid: pid,
                    uid: uid,
                    comments: [],
                    likes: [],
                    videoLink: videoFileUrl,
                });

                let doc = await firebaseDB.collection("users").doc(uid).get();
                let document = doc.data();

                document.postsCreated.push(pid);
                await firebaseDB.collection("users").doc(uid).set(document);
            }
        }
        catch (err) {
            console.log(err);
        }
    }

    let pid = uuidv4();
    console.log(pid);

    let conditionObject = {
        root: null, //observe from whole page
        threshold: "0.8", //80%
    };

    function cb(entries) {
        console.log(entries);
        entries.forEach((entry) => {
            let child = entry.target.children[0];
            // play(); => async
            // pause(); => sync

            child.play().then(function () {
                if (entry.isIntersecting == false) {
                    child.pause();
                }
            });
        });
    }

    useEffect(() => {
        // code which will run when the component loads
        let observerObject = new IntersectionObserver(cb, conditionObject);
        let elements = document.querySelectorAll(".video-container");

        elements.forEach((el) => {
            observerObject.observe(el); //Intersection Observer starts observing each video element
        });
    }, [posts]);

    useEffect(() => {
        //GET ALL THE POSTS
        //onSnapshot => listens for changes on the collection
        firebaseDB
            .collection("posts")
            .orderBy("createdAt", "desc")
            .onSnapshot((snapshot) => {
                let allPosts = snapshot.docs.map((doc) => {
                    return doc.data();
                });
                setPosts(allPosts);
            });
    }, []);

    return (
        <>
            {/* This check is important because without this the condition that we are using in our likes
        component will always give us a false value as that component will be rendered withput any user data
        so there will not be any id to compare to */}
            {posts == null ? <CircularProgress /> :
                <>

                    <div className='portion' style={{ height: '9.5vh' }}></div>

                    <div className='feed-container'>
                        <div className='center'>
                            <UploadFile></UploadFile>
                            {
                                posts.map((currPostObj) => {
                                    return <VideoPosts key={currPostObj.pid} postObj={currPostObj}></VideoPosts>
                                })
                            }
                        </div>


                    </div>
                </>}
        </>
    );
}

export default Feeds;