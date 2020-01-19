// Modules
import React from 'react'
import {
} from '@material-ui/icons'
import {
    withRouter
} from 'react-router-dom'
import { Button } from '@material-ui/core';
import { withStyles, createStyles } from '@material-ui/styles';

// Components
import widthWindowWidth from '../../shared/widthWindowWidth';


// Assets
import './page.housingSingle.scss'
import Carousel from '../../shared/carousel/carousel.index';
import GlobalUtils from '../../utils/GlobalUtils';
import AppConstants from '../../utils/AppConstants';
import GalleryModal from '../../shared/galleryModal/galleryModal.index';


// const housingTags = ["2 guest", "1 bath", "1 kitchen", "Wifi"]

const data = {
    id: 0, 
    title: "Champs élysées Golden", 
    rating: {
        count: 124,
        value: 4.3
    },
    images: Array(7).fill(true).map((_, i) => "https://picsum.photos/id/" + (i) +"/600/300")
}

const styles = theme => createStyles({
    viewPhotosBtn__root: {
        position: "absolute",
        right: 15,
        bottom: 15,
        zIndex: 1
    },

    galleryItemBtn: {
        borderRadius: 0
    }
})

class PageHousingSingle extends React.Component{

    constructor(props){
        super(props)

        this.state = {
            galleryModalIsOpen: false,
            galleryModalStartAt: 0
        }
    }

    onCloseModal = () => {
        this.setState({galleryModalIsOpen: false})
    }

    render(){

        const {classes} = this.props

        return (
            <div className="page page-housingSingle">
                {
                    // show carousel on mobile && grid on tablet and more
                    (this.props.windowWidth > AppConstants.BREAKPOINTS.tablet && data.images.length !== 2) ? (
                        <div className={GlobalUtils.setClassnames("page-housingSingle-gallery", {
                            "page-housingSingle-gallery-1": data.images.length === 1,
                            "page-housingSingle-gallery-2": data.images.length === 2,
                            "page-housingSingle-gallery-3": data.images.length === 3,
                            "page-housingSingle-gallery-4": data.images.length === 4,
                            "page-housingSingle-gallery-5andmore": data.images.length >= 5,
                        })}>
                            {
                                data.images.length > 1 && (
                                    <>
                                        <Button 
                                            onClick={() => this.setState({galleryModalIsOpen: true})} 
                                            color="primary" 
                                            variant="contained" 
                                            classes={{root: classes.viewPhotosBtn__root}}
                                        >View photos</Button>

                                        <GalleryModal
                                            images={data.images}
                                            onClose={this.onCloseModal}
                                            open={this.state.galleryModalIsOpen}
                                            startAt={this.state.galleryModalStartAt}
                                        />
                                    </>
                                )
                            }
                            <div className="page-housingSingle-gallery-grid">
                            {
                               data.images.slice(0, 5).map((image, imageIndex) => {
                                    return (
                                        <Button
                                            classes={{root: classes.galleryItemBtn}}
                                            key={"images-" + imageIndex} 
                                            className={"page-housingSingle-gallery-grid-item cell-" + (1 + imageIndex)}
                                            onClick={() => this.setState({galleryModalIsOpen: true, galleryModalStartAt: imageIndex})}
                                        >
                                            <div>
                                                <img src={image} alt=""/>
                                            </div>
                                        </Button>
                                        
                                    )
                                })
                            }
                            </div>
                        </div>
                    ) : (
                        <Carousel
                            images={data.images}
                        />
                    )
                }
                
                
            </div>
        )
    }
}

export default withRouter(widthWindowWidth(withStyles(styles)(PageHousingSingle)))