// Modules
import React from 'react'
import {
    StarRounded,
} from '@material-ui/icons'
import {Typography} from '@material-ui/core'
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

const housingTags = ["2 guest", "1 bath", "1 kitchen", "Wifi"]

const data = [
    {
        id: 0, 
        title: "Champs élysées Golden", 
        rating: {
            count: 124,
            value: 4.3
        },
        images: Array(4).fill(true).map((_, i) => "http://lorempixel.com/600/600/city/" + i)
    },

    {
        id: 1, 
        title: "Londre big ben", 
        rating: {
            count: 12,
            value: 3.2
        },
        images: Array(4).fill(true).map((_, i) => "http://lorempixel.com/600/600/city/" + (i + 5))

    },

    {
        id: 2, 
        title: "Tokyo hakihabara", 
        rating: {
            count: 66,
            value: 1.3
        }, 
        images: Array(4).fill(true).map((_, i) => "http://lorempixel.com/600/600/city/" + (i + 10))
    },
]

class PageHousingList  extends React.Component{

    constructor(props){
        super(props)
        this.state = {
            housings: {
                list: [],
                loading: false,
            }
        }
    }

    componentDidMount(){

        this.setState({housings: {...this.state.housings, loading: true}})

        fetch(AppConstants.API_DOMAIN + "/housing")
        .then(res => res.json())
        .then(res => {
            this.setState({
                housings: {
                    list: res,
                    loading: false
                }
            })
        })

        

    }
    
    render(){

        return (
            <div className="page page-housingList">
                <div className="page-housingList-list">
                    {
                        this.state.housings.list && this.state.housings.list.map((housing, housingIndex) => {

                            console.log({housing})

                            return (
                                <div key={"housing-" + housing.id} className="page-housingList-list-item">
                                    <Link to={this.props.location.pathname + "/" + housing.id} className="block-link"></Link>
                                    <div className="page-housingList-list-item-images">
                                        <ButtonAddFavorite/>
                                        <Carousel images={housing.images && housing.images.map(img => "https://picsum.photos/id/"+img.id+"/400/400")}/>
                                    </div>
    
                                    <div className="page-housingList-list-item-body">
                                        <div className="page-housingList-list-item-body-header">
                                            <Typography component="span" variant="overline">Entire apartment</Typography>
                                            <div className="page-housingList-list-item-body-header-rating">
                                                <StarRounded style={{color: this.props.theme.palette.secondary.main, fontSize: "14px"}}/>
                                                <Typography variant="subtitle2" component="span">{housing.rating.average} ({housing.rating.count})</Typography>
                                            </div>
                                        </div>
                                        <div className="page-housingList-list-item-body-title">
                                            <Typography variant="h5">{housing.title}</Typography>
                                        </div>
                                        <div className="page-housingList-list-item-body-info">
                                            {/* <Typography variant="body1">{housingTags.join(" · ")}</Typography> */}
                                        </div>
                                    </div>
                                </div>
                            )
                        })
                    }
                </div>
            </div>
        )
    }
}

export default withTheme(withRouter(PageHousingList))