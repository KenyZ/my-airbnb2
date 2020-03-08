import React from 'react'
import { Route, Redirect } from 'react-router-dom'
import utils from '../utils/app.utils'

export default class SecretRoute extends React.Component{

    constructor(props){
        super(props)
        this.state = {
            loading: true,
            authorized: false
        }
    }

    componentDidMount(){
        this.setState({
            loading: false,
            authorized: utils.isAuthenticated()
        })
    }

    render(){

        if(this.state.loading){
            return <div>loading...</div>
        }
        else if(!this.state.loading && this.state.authorized){
            return <Route {...this.props}/>
        } else {
            return <Redirect to="/signin"/>
        }
    }
}