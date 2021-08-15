import React from 'react';
import { Container, Grid, Paper, Button, makeStyles } from '@material-ui/core';

const Grids = () => {
    let useStyles = makeStyles({
        size: {
            height: "20vh",
            backgroundColor: "red",
        },
        color: {
            color: "white",
            backgroundColor : "blue",
        },
    })

    let classes = useStyles();

    return ( 
    <div>
        <Grid container spacing={5}>
            <Grid item xs={5} sm={2} md={5}>
                <Paper className={[classes.size, classes.color]}>Item1</Paper>
            </Grid>

            <Grid item xs={5} sm={2} md={5}>
                <Paper className={classes.size}>Item2</Paper>
            </Grid>

            <Grid item xs={5} sm={8} md={2}>
                <Paper>Item3</Paper>
            </Grid>

        </Grid>
    </div> );
}
 
export default Grids;