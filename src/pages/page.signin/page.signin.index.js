// Modules
import React from 'react'
import { 
    Typography, 
    TextField,
    Button,
    Snackbar,
    SnackbarContent
} from '@material-ui/core'
import { withStyles, createStyles } from '@material-ui/styles';

// Assets
import './page.signin.scss'
import Actions from '../../utils/actions.index';
import params from '../../utils/app.params'
import { withRouter } from 'react-router-dom';


const styles = createStyles(theme => ({
    page: {
        backgroundColor: theme.palette.primary.main
    },
    formTitle: {
        color: theme.palette.primary.main,
        fontWeight: 700
    },
    submitBtn: {
        marginTop: "24px"
    },
    snackbarFormError: {
        backgroundColor: theme.palette.error.main,
    }
}))

class PageSignin extends React.Component{

    constructor(props){
        super(props)
        this.state = {
            formData: {
                email: null,
                password: null
            },

            formError: null,
            openSnackbarFormError: false,

        }
    }

    handleInputChange = event => {
        this.setState({
            formData: {
                ...this.state.formData,
                [event.target.id]: event.target.value
            }
        })
    }

    submitLogin = event => {
        event.preventDefault()
        
        Actions.submitLoginAction(this.state.formData).then(res => {
            if(res && res.error){
                this.setState({formError: true, openSnackbarFormError: true})
                return
            }   

            localStorage.setItem(params.ACCESS_TOKEN_LS, res.data.token_access)

            // if we must go back to previous page
            if(this.props.location.state && this.props.location.state.remember){

                // previous page
                const remember = this.props.location.state.remember
                const referer = remember.referer

                // go back to previous page with memorized state
                this.props.history.push(referer, {remember})
            } else {
                this.props.history.push("/")
            }

        })
        .catch(res => {
            
        })

    }

    render(){
        return (
            <div className="page page-signin">
                <Snackbar
                    open={this.state.formError}
                    onClose={() => this.setState({openSnackbarFormError: false})}
                    autoHideDuration={2000}
                >
                    <SnackbarContent
                        classes={{root: this.props.classes.snackbarFormError}}
                        message={<span id="snackbar-message">Mail or password in incorrect.</span>}
                    />
                </Snackbar>
                <form className="page-signin-form" noValidate>
                    <div className="page-signin-form-title">
                        <Typography classes={{root: this.props.classes.formTitle}} variant="h4">my-airbnb</Typography>
                    </div>
                    <div>
                        <TextField
                            id="email"
                            placeholder="Email"
                            variant="outlined"
                            fullWidth
                            type="email"
                            margin="normal"
                            size="small"
                            helperText=""
                            error={this.state.formError || undefined}
                            onChange={this.handleInputChange}
                            required
                        />

                        <TextField
                            id="password"
                            placeholder="Password"
                            variant="outlined"
                            fullWidth
                            type="password"
                            margin="normal"
                            size="small"
                            error={this.state.formError || undefined}
                            onChange={this.handleInputChange}
                            required
                        />
                        <Button
                            type="submit"
                            color="primary"
                            variant="contained"
                            fullWidth
                            marging="normal"
                            classes={{root: this.props.classes.submitBtn}}
                            onClick={this.submitLogin}
                        >Login</Button>
                    </div>
                </form>
            </div>
        )
    }
}

export default withRouter(withStyles(styles)(PageSignin))