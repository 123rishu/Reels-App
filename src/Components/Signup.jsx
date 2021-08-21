import React, { useState, useEffect, useContext } from 'react';
import { firebaseDB, firebaseStorage } from '../config/firebase';
import { AuthContext } from '../context/AuthProvider';
import { TextField, Grid, Button, Paper, Card, CardContent, CardActions, Container, CardMedia, Typography, makeStyles } from '@material-ui/core';
import logo from "../logo.png";
import { Link } from 'react-router-dom';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import CloudDoneIcon from '@material-ui/icons/CloudDone';
import Alert from '@material-ui/lab/Alert';

const Signup = (props) => {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");
    const [profileImage, setProfileImage] = useState(null);
    const { signUp } = useContext(AuthContext);
    const [error, setError] = useState("")
    const [flag, setFlag] = useState(true);

    let useStyles = makeStyles({
        centerDivs: {
            height: "100vh",
            display: "flex",
            justifyContent: "center",
            width: "100vw",
        },
        carousal: { height: "10rem", backgroundColor: "lightgray" },
        fullWidth: {
            width: "100%",
        },
        centerElements: {
            display: "flex",
            flexDirection: "column",
        },
        mb: {
            marginBottom: "1rem",
        },
        padding: {
            paddingTop: "0.5rem",
            paddingBottom: "0.5rem",
        },
        alignCenter: {
            justifyContent: "center",
        },
        centerContent: {
            marginLeft: "350px"
        }
    });

    let classes = useStyles();
    // margin-left: calc(100vw - 649px);

    const handleUploadClick = () => {
        setFlag(!flag);
    };


    const handleFileSubmit = (e) => {
        let fileObject = e.target.files[0];
        console.log("fired");
        setProfileImage(fileObject);
    }

    const handleSignUp = async () => {
        if (profileImage == null) {
            setError("Please upload your profile Image");
            setTimeout(() => {
                setError('')
            }, 2000)
            return;
        }
        try {
            let response = await signUp(email, password);
            console.log(response);
            let uid = response.user.uid;
            //you are signed up

            //storing profile image inside firestore
            const uploadPhotoObject = firebaseStorage.ref(`/profile/${uid}/image.jpg`).put(profileImage);
            //console.log(uploadPhotoObject);

            //special event on uploadPhotoObj to track the progress of the upload and to perform operations accordingly
            uploadPhotoObject.on("state_changed", fun1, fun2, fun3);
            //to track progress of the upload
            function fun1(snapshot) {
                //bytes transferred
                //total bytes
                let progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                console.log(progress);
            }
            //indicates ans error if any
            function fun2(error) {
                console.log(error);
            }
            //it indicates success of the upload
            async function fun3() {
                let profileImageUrl = await uploadPhotoObject.snapshot.ref.getDownloadURL();
                //db me collection => document => {username, email, userId, profileImageUrl}

                //creating a collection in firebase Db
                firebaseDB.collection("users").doc(uid).set({
                    email: email,
                    userId: uid,
                    username: username,
                    profileImageUrl: profileImageUrl,
                    postsCreated: [],
                });

                //after signing up, go to feeds page
                props.history.push("/");
            }
        }
        catch (err) {
            setMessage(err.message);
        }
    }

    return (
        <div style={{ marginTop: '150px' }}>

            <Container>
                <Grid container justify="center" spacing={2}>
                    {/* carousel */}
                    <Grid item sm={4} md={4} lg={4}>
                        <Card variant="outlined" className={classes.mb}>
                            <CardMedia
                                image={logo}
                                style={{ height: "5rem", backgroundSize: "contain" }}
                            ></CardMedia>
                            {error && <Alert severity="error">{error}</Alert>}
                            <Typography style={{ textAlign: "center", color: "gray" }}>
                                Signup to see photos and videos from your friends.
                            </Typography>
                            <CardContent className={classes.centerElements}>
                                <TextField
                                    label="Email"
                                    type="email"
                                    variant="outlined"
                                    value={email}
                                    size="small"
                                    className={classes.mb}
                                    onChange={(e) => setEmail(e.target.value)}
                                ></TextField>
                                <TextField
                                    label="Password"
                                    type="password"
                                    variant="outlined"
                                    value={password}
                                    size="small"
                                    className={classes.mb}
                                    onChange={(e) => setPassword(e.target.value)}
                                ></TextField>
                                <TextField
                                    label="Full Name"
                                    type="text"
                                    variant="outlined"
                                    value={username}
                                    size="small"
                                    onChange={(e) => setUsername(e.target.value)}
                                ></TextField>
                            </CardContent>
                            <CardActions>
                                <input
                                    accept="image/*"
                                    // className={classes.input}
                                    style={{ display: 'none' }}
                                    id="raised-button-file"
                                    className={classes.fullWidth}
                                    onChange={(e) => {
                                        handleFileSubmit(e);
                                    }}
                                    onClick={handleUploadClick}
                                    type="file"
                                />
                                <label htmlFor="raised-button-file" className={classes.fullWidth}>
                                    <Button
                                        variant="outlined"
                                        color={flag ? "secondary" : "primary"}
                                        startIcon={flag ? <CloudUploadIcon></CloudUploadIcon> : <CloudDoneIcon></CloudDoneIcon>}
                                        component="span"
                                        className={classes.fullWidth}
                                    >
                                        Upload Profile Image
                                    </Button>
                                </label>
                            </CardActions>
                            <CardActions>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    // onClick={handleLogin}
                                    onClick={handleSignUp}
                                    className={classes.fullWidth}
                                >
                                    SignUp
                                </Button>
                            </CardActions>
                            <Typography style={{ textAlign: "center" }}>
                                By signing up, you agree to our Terms, Data Policy and Cookies Policy
                            </Typography>
                        </Card>
                        <Card variant="outlined" className={classes.padding}>
                            <Typography style={{ textAlign: "center" }}>
                                Have an account ?
                                <Button variant="text" color="primary">
                                    <Link style={{ color: "blue", textDecoration: "none" }} to="/login">
                                        Log In
                                    </Link>
                                </Button>
                            </Typography>
                        </Card>
                    </Grid>
                </Grid>
            </Container>
        </div>
    );
}

export default Signup;