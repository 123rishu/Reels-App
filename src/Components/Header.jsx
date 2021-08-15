import React, { useState, useEffect, useContext } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import HomeIcon from '@material-ui/icons/Home';
import AccountCircle from '@material-ui/icons/AccountCircle';
import MoreIcon from '@material-ui/icons/MoreVert';
import ExploreOutlinedIcon from '@material-ui/icons/ExploreOutlined';
import InstaLogo from '../Assets/Instagram.JPG';
import { useHistory } from "react-router-dom";
import { AuthContext } from '../context/AuthProvider';
import './Header.css'
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import Avatar from '@material-ui/core/Avatar';
import { firebaseDB } from "../config/firebase";
const useStyles = makeStyles((theme) => ({
    grow: {
        flexGrow: 1,
    },
    menuButton: {
        marginRight: theme.spacing(2),
    },
    inputRoot: {
        color: 'inherit',
    },
    inputInput: {
        padding: theme.spacing(1, 1, 1, 0),
        // vertical padding + font size from searchIcon
        paddingLeft: `calc(1em + ${theme.spacing(2)}px)`,
        transition: theme.transitions.create('width'),
        width: '100%',
        [theme.breakpoints.up('md')]: {
            width: '20ch',
        },
        border: '1px solid #636e72',
        color: '#636e72',
        height: '10px',
        borderRadius: '5%'
    },
    sectionDesktop: {
        display: 'none',
        [theme.breakpoints.up('md')]: {
            display: 'flex',
        },
        color: '#636e72',
        marginRight: '15%'
    },
    sectionMobile: {
        display: 'flex',
        [theme.breakpoints.up('md')]: {
            display: 'none',
        },
    },
    appb: {
        backgroundColor: 'white'
    },
    navicon: {
        color: 'black',
        marginRight: '1%',
        cursor: 'pointer'
    },
    navicon2: {
        color: 'black',
        cursor: 'pointer'
    },
    small: {
        width: theme.spacing(3),
        height: theme.spacing(3),
    },

}));

const Header = (props) => {
    const menuId = 'primary-search-account-menu';
    let profilePicUrlOfLiveUser;
    const mobileMenuId = 'primary-search-account-menu-mobile';
    const classes = useStyles();
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [userPicUrl, setUserPicUrl] = useState("");
    const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = React.useState(null);
    const history = useHistory();
    const isMenuOpen = Boolean(anchorEl);
    const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);
    const { logout, currUser } = useContext(AuthContext);
    console.log(currUser);
    

    const handleNavigation = () => {
        var win = window.open('https://www.pepcoding.com/', '_blank');
        win.focus();
    }

    const handleBannerClick = () => {
        history.push("/");
    }

    const handleProfile = () => {
        //  console.log(currUser)
        history.push(`/profile/${currUser.uid}`)
    }
    const handleLogout = async () => {
        await logout();
        history.push("/login")
    }

    const handleProfileMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMobileMenuOpen = (event) => {
        setMobileMoreAnchorEl(event.currentTarget);
    };

    const handleMobileMenuClose = () => {
        setMobileMoreAnchorEl(null);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
        handleMobileMenuClose();
    };

    useEffect(async () => {
        if (currUser != null) {
            let uidOfCurrLiveUser = currUser.uid;
            console.log(uidOfCurrLiveUser);
            let doc = await firebaseDB.collection("users").doc(uidOfCurrLiveUser).get();
            let dataObjOfCurrLiveUser = doc.data();
            profilePicUrlOfLiveUser = dataObjOfCurrLiveUser.profileImageUrl;
            console.log(profilePicUrlOfLiveUser);
            setUserPicUrl(profilePicUrlOfLiveUser);
        }
    }, [currUser])

    const renderMenu = (
        <Menu
            anchorEl={anchorEl}
            anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
            id={menuId}
            keepMounted
            transformOrigin={{ vertical: 'top', horizontal: 'right' }}
            open={isMenuOpen}
            onClose={handleMenuClose}
        >
            <MenuItem className={classes.item} onClick={handleProfile}><AccountCircle /><p>&nbsp;</p>Profile</MenuItem>
            <MenuItem className={classes.item} onClick={handleLogout}><ExitToAppIcon /><p>&nbsp;</p>Logout</MenuItem>
        </Menu>
    );

    const renderMobileMenu = (
        <Menu
            anchorEl={mobileMoreAnchorEl}
            anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
            id={mobileMenuId}
            keepMounted
            transformOrigin={{ vertical: 'top', horizontal: 'right' }}
            open={isMobileMenuOpen}
            onClose={handleMobileMenuClose}
        >
            <MenuItem className={classes.item} onClick={handleProfile}>
                <AccountCircle /><p>&nbsp;</p> <p>Profile</p>
            </MenuItem>
            <MenuItem className={classes.item} onClick={handleLogout}><ExitToAppIcon /><p>&nbsp;</p> Logout</MenuItem>
        </Menu>
    );
    return (
        <div className={classes.grow}>
            <AppBar className={classes.appb} position="fixed">
                <Toolbar>
                    <div className="insta-head2">
                        <img src={InstaLogo} onClick={handleBannerClick} style={{ cursor: 'pointer' }}></img>
                    </div>

                    <div className={classes.grow} />
                    <HomeIcon className={classes.navicon} onClick={handleBannerClick} ></HomeIcon>
                    <ExploreOutlinedIcon onClick={handleNavigation} className={classes.navicon2} />

                    <div className={classes.sectionDesktop}>
                        <IconButton
                            edge="end"
                            aria-label="account of current user"
                            aria-controls={menuId}
                            aria-haspopup="true"
                            onClick={handleProfileMenuOpen}
                        >
                            <Avatar alt="Remy Sharp" src={userPicUrl} className={classes.small} />
                        </IconButton>
                    </div>

                    <div className={classes.sectionMobile}>
                        <IconButton
                            aria-label="show more"
                            aria-controls={mobileMenuId}
                            aria-haspopup="true"
                            onClick={handleMobileMenuOpen}
                        >
                            <MoreIcon />
                        </IconButton>
                    </div>

                </Toolbar>
            </AppBar>
            {renderMobileMenu}
            {renderMenu}
        </div>
    );
}

export default Header;