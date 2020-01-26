// Modules
import React from 'react'
import {
    StarRounded,
} from '@material-ui/icons'
import {Typography} from '@material-ui/core'
import Skeleton from '@material-ui/lab/Skeleton'
import {
    Link,
    withRouter
} from 'react-router-dom'

// Components


// Assets
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import './page.housingList.scss'
import Carousel from '../../shared/carousel/carousel.index';
import ButtonAddFavorite from '../../shared/ButtonAddFavorite';
import { withTheme } from '@material-ui/styles';
import AppConstants from '../../utils/AppConstants';
import GlobalUtils from '../../utils/GlobalUtils';
import Pagination from '../../shared/pagination/pagination.index'


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
        return fetch(AppConstants.API_DOMAIN + "/housing?offset=" + page)
        .then(res => res.json())
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
        this.fetchHousingsList(nextPagination)
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
                                <div key={"housing-" + housing.id} className="page-housingList-list-item">
                                    {housings && <Link to={this.props.location.pathname + "/" + housing.id} className="block-link"></Link>}
                                    <div className="page-housingList-list-item-images">
                                        {housings && <ButtonAddFavorite/>}
                                        <Carousel images={housings && housing.images.map(img => img.url)}/>
                                    </div>
    
                                    <div className="page-housingList-list-item-body">
                                        <div className="page-housingList-list-item-body-header">
                                            {housings ? <Typography component="span" variant="overline">Entire apartment</Typography> : ""}
                                            {housings ? (
                                                <div className="page-housingList-list-item-body-header-rating">
                                                    <StarRounded style={{color: this.props.theme.palette.secondary.main, fontSize: "14px"}}/>
                                                    <Typography variant="subtitle2" component="span">{housing.rating.average} ({housing.rating.count})</Typography>
                                                </div>
                                            ) : ""}
                                        </div>
                                        <div className="page-housingList-list-item-body-title">
                                            {housings ? <Typography variant="h5">{housing.title}</Typography> : (
                                                <React.Fragment>
                                                    <Skeleton variant="text"/>
                                                    <Skeleton variant="text"/>
                                                </React.Fragment>
                                            )}
                                        </div>
                                        <div className="page-housingList-list-item-body-info">
                                            {housings ? <Typography variant="body1">{GlobalUtils.renderHousingTags(housing)}</Typography> : ""}
                                        </div>
                                    </div>
                                </div>
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