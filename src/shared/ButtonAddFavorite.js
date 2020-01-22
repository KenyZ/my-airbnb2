import React, {useState} from 'react'
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

const ButtonAddFavorite = ({favorite = false, classes, theme}) => {

    const [isFavorite, setFavorite] = useState(false)

    return (
        <IconButton onClick={() => setFavorite(!isFavorite)} classes={{root: classes.root}}>
            {isFavorite ? (
                <Favorite style={{color: theme.palette.secondary.main, fontSize: 20}}/>
            ) : (
                <FavoriteBorder style={{fontSize: 20}}/>
            )}
        </IconButton>
    )
}

export default withTheme(withStyles(styles)(ButtonAddFavorite))