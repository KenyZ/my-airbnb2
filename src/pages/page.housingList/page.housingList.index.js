// Modules
import React from 'react'
import {
    StarRounded,
} from '@material-ui/icons'
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
    render(){

        return (
            <div className="page page-housingList">
                <div className="page-housingList-list">
                    {
                        data.map((housing, housingIndex) => {
                            return (
                                <div key={"housing-" + housingIndex} className="page-housingList-list-item">
                                    <Link to={this.props.location.pathname + "/4"} className="block-link"></Link>
                                    <div className="page-housingList-list-item-images">
                                        <Carousel images={housing.images}/>
                                    </div>
    
                                    <div className="page-housingList-list-item-body">
                                        <div className="page-housingList-list-item-body-header">
                                            <div className="page-housingList-list-item-body-header-rating">
                                                <StarRounded style={{color: "red", fontSize: "14px"}}/>
                                                <span>4.5</span>
                                                <span>(123)</span>
                                            </div>
                                        </div>
                                        <h6 className="page-housingList-list-item-body-title">{housing.title}</h6>
                                        <div className="page-housingList-list-item-body-info">
                                            <span>{housingTags.join(" · ")}</span>
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

export default withRouter(PageHousingList)