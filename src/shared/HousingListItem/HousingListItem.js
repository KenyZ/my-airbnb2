// Modules
import React from 'react'
import Proptypes from 'prop-types'
import {
    StarRounded,
} from '@material-ui/icons'
import {Typography} from '@material-ui/core'
import Skeleton from '@material-ui/lab/Skeleton'
import {
    Link,
    withRouter
} from 'react-router-dom'
import { withTheme } from '@material-ui/styles';

// Assets
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import './housingListItem.scss'

// Components
import Carousel from '../../shared/carousel/carousel.index';
import ButtonFavorite from '../../shared/ButtonFavorite';


// Others
import utils from '../../utils/app.utils';




class HousingListItem  extends React.Component{

    toggleFavoriteHousing = housingId => {
        // utils.request.jsonFetcher("/housing/" + housingId + "/favorite", {method: "PATCH"})
        //     .then(res => {

        //         if(res.error){
        //             //
        //             return
        //         } else {
        //             this.setState({housings: this.state.housings.map(housingsItem => ({
        //                 ...housingsItem,
        //                 // IF we match housing we set new is_favorite
        //                 is_favorite: housingsItem.id === res.data.housing_id ? res.data.is_favorite : housingsItem.is_favorite
        //             }))})
        //         }
        //     })
    }
    
    render(){

        return (
            <div className="HousingListItem">
                {this.props.isLoaded && <Link to={this.props.location.pathname + "/" + this.props.housing.id} className="block-link"></Link>}
                <div className="page-housingList-list-item-images">
                    {this.props.isLoaded && (
                        <ButtonFavorite 
                            handleToggle={() => this.props.handleToggle(this.props.housing.id)} 
                            isFavorite={this.props.housing.is_favorite}
                        />
                    )}
                    <Carousel images={this.props.isLoaded ? this.props.housing.images.map(img => img.url) : []}/>
                </div>

                <div className="page-housingList-list-item-body">
                    <div className="page-housingList-list-item-body-header">
                        {this.props.isLoaded ? <Typography component="span" variant="overline">Entire apartment</Typography> : ""}
                        {this.props.isLoaded ? (
                            <div className="page-housingList-list-item-body-header-rating">
                                <StarRounded style={{color: this.props.theme.palette.secondary.main, fontSize: "14px"}}/>
                                <Typography variant="subtitle2" component="span">{this.props.housing.rating.average} ({this.props.housing.rating.count})</Typography>
                            </div>
                        ) : ""}
                    </div>
                    <div className="page-housingList-list-item-body-title">
                        {this.props.isLoaded ? <Typography variant="h5">{this.props.housing.title}</Typography> : (
                            <React.Fragment>
                                <Skeleton variant="text"/>
                                <Skeleton variant="text"/>
                            </React.Fragment>
                        )}
                    </div>
                    <div className="page-housingList-list-item-body-info">
                        {this.props.isLoaded ? <Typography variant="body1">{utils.renderHousingTags(this.props.housing)}</Typography> : ""}
                    </div>
                </div>
            </div>
        )
    }
}

HousingListItem.propTypes = {
    housing: Proptypes.object.isRequired,
    isLoaded: Proptypes.bool,
    handleToggle: Proptypes.func.isRequired,
}

export default withTheme(withRouter(HousingListItem))