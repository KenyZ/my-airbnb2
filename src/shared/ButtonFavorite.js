import React, {useState} from 'react'
import Proptypes from 'prop-types'
import {IconButton, createStyles, withStyles} from '@material-ui/core'
import {Favorite, FavoriteBorder} from '@material-ui/icons'
import { withTheme } from '@material-ui/styles'

const styles = createStyles(theme => ({

    root: {
        backgroundColor: "#fff",
        position: "absolute",
        top: 7,
        left: 7,
        zIndex: 1,
        padding: 8,

        "&:hover": {
            backgroundColor: theme.palette.grey[100]
        }
    }

}))


class ButtonFavorite extends React.Component{
    render(){
        return (
            <IconButton onClick={this.props.handleToggle} classes={{root: this.props.classes.root}}>
                {this.props.isFavorite ? (
                    <Favorite style={{color: this.props.theme.palette.secondary.main, fontSize: 20}}/>
                ) : (
                    <FavoriteBorder style={{fontSize: 20}}/>
                )}
            </IconButton>
        )
    }
}


ButtonFavorite.propTypes = {
    isFavorite: Proptypes.bool,
    handleToggle: Proptypes.func
}

export default withTheme(withStyles(styles)(ButtonFavorite))