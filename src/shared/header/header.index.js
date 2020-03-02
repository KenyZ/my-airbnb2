import React from 'react'
import { 
    AppBar, 
    Toolbar, 
    Typography, 
    IconButton,
    Button,
} from '@material-ui/core'
import { Menu} from '@material-ui/icons'
import { makeStyles, fade } from '@material-ui/core/styles'
import {Link} from 'react-router-dom'

import utils from '../../utils/app.utils'

const useStyles = makeStyles(theme => ({
    root: {
      flexGrow: 1,
    },
    menuButton: {
      marginRight: theme.spacing(2),
    },
    title: {
    //   flexGrow: 1,
      flexShrink: 0,
      display: 'none',
      [theme.breakpoints.up('sm')]: {
        display: 'inline-block',
        marginRight: theme.spacing(2),
        },
    },
    search: {
      position: 'relative',
      borderRadius: theme.shape.borderRadius,
      backgroundColor: fade(theme.palette.common.white, 0.15),
      '&:hover': {
        backgroundColor: fade(theme.palette.common.white, 0.25),
      },
      marginLeft: 0,
      width: '100%',
      [theme.breakpoints.up('sm')]: {
        marginLeft: theme.spacing(1),
        // width: 'auto',
      },
    },
    searchIcon: {
      width: theme.spacing(7),
      height: '100%',
      position: 'absolute',
      pointerEvents: 'none',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    inputRoot: {
      color: 'inherit',
    },
    inputInput: {
      padding: theme.spacing(1, 1, 1, 7),
    //   transition: theme.transitions.create('width'),
      width: '100%',
    //   [theme.breakpoints.up('sm')]: {
    //     width: 120,
    //     '&:focus': {
    //       width: "100%",
    //     },
    //   },
    },

    ctaSignin: {
      marginLeft: "auto",
      color: "#fff",
      borderColor: "#fff",
    },

  }))

const Header = () => {

    const classes = useStyles()

    return (
        <div className={classes.root}>
            <AppBar color="primary" position="fixed">
                <Toolbar>
                    <IconButton
                        edge="start"
                        className={classes.menuButton}
                        color="inherit"
                        aria-label="open drawer"
                    >
                        <Menu />
                    </IconButton>
                    <Link to="/">
                      <Typography className={classes.title} variant="h6" noWrap>
                          my-airbnb
                      </Typography>
                    </Link>
                    {/* <div className={classes.search}>
                        <div className={classes.searchIcon}>
                            <SearchOutlined />
                        </div>
                        <InputBase
                            placeholder="Search for stays"
                            classes={{
                                root: classes.inputRoot,
                                input: classes.inputInput,
                            }}
                            inputProps={{ 'aria-label': 'search' }}
                        />
                    </div> */}
                    {!utils.isAuthenticated() && (
                        <Button className={classes.ctaSignin} variant="outlined">
                          <Link to="/signin">Sign in</Link>
                        </Button>
                    )}
                </Toolbar>
            </AppBar>
        </div>
    )
}

export default Header