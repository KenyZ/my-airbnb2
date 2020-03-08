// Modules
import React from 'react'
import {
    withRouter
} from 'react-router-dom'

// Components
import Pagination from '../../shared/pagination/pagination.index'
import HousingListItem from '../../shared/HousingListItem/HousingListItem'
import utils from '../../utils/app.utils';
import Actions from '../../utils/actions.index'

// Assets
import './page.favorites.scss'

const placeholderList = [{id: 0},{id: 1},{id: 2}]

class PageFavorites extends React.Component{

    constructor(props){
        super(props)
        this.state = {
            housings: null,
            pagination: null
        }
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

    getCurrentPagination = () => new URLSearchParams(this.props.location.search).get("page")

    componentDidMount(){
        const nextPagination = this.getCurrentPagination()
        this.fetchHousingsList(nextPagination || 0)
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

    handlePagination = page => {
        // @OPTIMIZATION - should display page [1;infini] instead of [0;infini]
            this.props.history.push({
                path: this.props.location.pathname,
                search: "?page=" + page 
            })
        }

    fetchHousingsList = (page = 0) => {
        return Actions.getHousingList(page, "true")
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

    render(){

        const housings = this.state.housings

        return (
            <div className="page page-favorites">
                <div className="page-favorites-list">
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

export default withRouter(PageFavorites)