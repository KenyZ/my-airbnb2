// Modules
import React from 'react'
import {Typography} from '@material-ui/core'
import {
    withRouter
} from 'react-router-dom'
import { withTheme } from '@material-ui/styles';

// Components
import Pagination from '../../shared/pagination/pagination.index'
import HousingListItem from '../../shared/HousingListItem/HousingListItem'
import utils from '../../utils/app.utils';
import Actions from '../../utils/actions.index'

// Assets
import './page.housingList.scss'


const placeholderList = [{id: 0},{id: 1},{id: 2}]

const renderTotalListCount = n => {
    if(n < 10) return n
    else if(n < 100) return Math.floor(n / 10) * 10
    else if(n < 1000) return Math.floor(n / 100) * 100
    else if(n < 10000) return Math.floor(n / 1000) * 1000
    else return n
}

class PageHousingList  extends React.Component{

    constructor(props){
        super(props)
        this.state = {
            housings: null,
            pagination: null
        }
    }

    // @OPTIMIZATION - should display page [1;infini] instead of [0;infini]
    fetchHousingsList = (page = 0) => {
        return Actions.getHousingList(page)
        .then(res => {

            if(res.error){
                return;
            }
            
            this.setState({
                housings: res.data.list,
                pagination: res.data.pagination,
            })
        })
    }

    componentDidUpdate(prevProps){

        if(prevProps.location.search !== this.props.location.search){ // changing pagination
            const nextPage = this.getCurrentPagination()

            if(nextPage){ // retrieve next pagination
                this.fetchHousingsList(nextPage).then(() => {
                    window.scrollTo(0, 0)
                })
            }

        }
    }

    componentDidMount(){
        const nextPagination = this.getCurrentPagination()
        this.fetchHousingsList(nextPagination || 0)
    }

    // @OPTIMIZATION - should display page [1;infini] instead of [0;infini]
    getCurrentPagination = () => new URLSearchParams(this.props.location.search).get("page")

    handlePagination = page => {
    // @OPTIMIZATION - should display page [1;infini] instead of [0;infini]
        this.props.history.push({
            path: this.props.location.pathname,
            search: "?page=" + page 
        })
    }

    toggleFavoriteHousing = housingId => {
        utils.request.jsonFetcher("/housing/" + housingId + "/favorite", {method: "PATCH"})
            .then(res => {

                if(res.error){
                    //
                    return
                } else {
                    this.setState({housings: this.state.housings.map(housingsItem => ({
                        ...housingsItem,
                        // IF we match housing we set new is_favorite
                        is_favorite: housingsItem.id === res.data.housing_id ? res.data.is_favorite : housingsItem.is_favorite
                    }))})
                }
            })
    }
    
    render(){

        const housings = this.state.housings

        return (
            <div className="page page-housingList">
                {this.state.pagination && <div className="page-housingList-top">
                    <Typography variant="h5" component="p">+ {renderTotalListCount(this.state.pagination.item_count)} more stays</Typography>
                </div>}
                <div className="page-housingList-list">
                    {
                        (housings ? housings : placeholderList).map((housing, housingIndex) => {
                            return (
                                <HousingListItem
                                    key={"housing-" + housing.id}
                                    housing={housing}
                                    // if not loaded component can show placeholder
                                    isLoaded={!!housings}
                                    handleToggle={this.toggleFavoriteHousing}
                                />
                            )
                        })
                    }
                </div>
                {this.state.pagination && <Pagination onClick={this.handlePagination} {...this.state.pagination}/>}
            </div>
        )
    }
}

export default withTheme(withRouter(PageHousingList))