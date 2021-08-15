import React, { useContext, useState } from 'react';
import { uuid } from "uuidv4";
import Button from '@material-ui/core/Button';
import { AuthContext } from "../context/AuthProvider";
import { makeStyles } from '@material-ui/core/styles';
import MovieIcon from '@material-ui/icons/Movie';
import LinearProgress from '@material-ui/core/LinearProgress';
import { firebaseDB, firebaseStorage, timeStamp } from "../config/firebase";
import Alert from '@material-ui/lab/Alert';

const UploadFile = () => {
    const useStyles = makeStyles({});
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const classes = useStyles();
    const { currUser } = useContext(AuthContext);
    const types = ['video/mp4', 'video/webm', 'video/ogg'];


    const onChange = (e) => {
        const file = e.target.files[0];

        if (file == null) {
            setError("Please select a file");
            setTimeout(() => {
                setError(null);
            }, 2000);
            return;
        }
        //
        console.log(file);
        //file.type apne array ke andar present types me se ek hai, toh kuch karo, aur agar nahi hai toh kuch karo
        //nahi hai vala case
        if (types.indexOf(file.type) == -1) {
            //koi aur type ki file select kari hai user ne
            setError("Please select a video file.");
            //setTimeout will execute only once after a apecified time interval
            setTimeout(() => {
                setError(null);
            }, 2000);
            return;
        }
        //agar file type sahi select kia hai, then file size check karenge
        if (file.size / (1024 * 1024) > 100) {
            setError("The selected file is very big");
            setTimeout(() => {
                setError(null);
            }, 2000);
            return;
        }

        //ab ye file(video) ko firebase storage me save karna hai, then main database me is video post ki entry ka ek object bana ke dalenge
        try {
            //upload video in firebase storage

            let uid = currUser.uid;

            const uploadVideoObject = firebaseStorage.ref(`/profilePhotos/${uid}/${Date.now()}.mp4`).put(file);
            uploadVideoObject.on("state_changed", fun1, fun2, fun3);

            //progress of the file upload
            function fun1(snapshot) {
                //bytes transferred
                //total bytes
                let progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                console.log(progress);
            }

            //it indicates an error if so
            function fun2(error) {
                console.log(error);
            }

            //it indicates success of the upload
            async function fun3() {
                let videoUrl = await uploadVideoObject.snapshot.ref.getDownloadURL();
                console.log(videoUrl);

                //ek unique id ki help se ek video post object create karenge, and usko db me dal denge
                let pid = uuid();

                await firebaseDB.collection("posts").doc(pid).set({
                    pid: pid,
                    uid: uid,
                    comments: [],
                    likes: [],
                    videoLink: videoUrl,
                    createdAt: timeStamp(),
                });

                //ab users(From DB) me se is currentUser ka object nikalenge, then us obj ke postCreated ke andar is post ki entry dalenge
                let doc = await firebaseDB.collection("users").doc(uid).get();
                //pehle doc ayega, then object
                let documentObject = doc.data();

                //ab is obj me postscreated me nahi entry push karenge
                documentObject.postsCreated.push(pid);

                //ab ye naya object purane obj ko replace kar dega db me jake
                await firebaseDB.collection("users").doc(uid).set(documentObject);
                setError(null);
            }
        }
        catch (err) {
            setError(err.message);
            setTimeout(() => {
                setError(null);
            }, 2000);
            return;
        }
    }

    return (
        <div>
            {
                error != null ? <Alert severity="error">{error}</Alert> :
                    <>
                        <input
                            color="primary"
                            type="file"
                            id="icon-button-file"
                            onChange={onChange}
                            style={{ display: "none", }}
                        />
                        <label htmlFor="icon-button-file">
                            <Button
                                disabled={loading}
                                variant="outlined"
                                component="span"
                                size="medium"
                                color="secondary"
                            >
                                <MovieIcon />&nbsp; Upload Video
                            </Button>
                        </label>
                        {loading == true ? <LinearProgress color="secondary" style={{ marginTop: "2%" }} /> : <></>}
                    </>
            }
        </div>
    );
}

export default UploadFile;