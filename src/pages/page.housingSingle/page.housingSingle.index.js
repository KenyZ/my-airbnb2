// Modules
import React from 'react'
import { StarRounded } from '@material-ui/icons'
import {
    withRouter
} from 'react-router-dom'
import { Button, Dialog, DialogContent, IconButton, Typography } from '@material-ui/core';
import {CloseRounded} from '@material-ui/icons'
import { withStyles, createStyles, withTheme } from '@material-ui/styles';
import { DatePicker } from '@material-ui/pickers';
import moment from 'moment';

// Components
import widthWindowWidth from '../../shared/widthWindowWidth';
import GalleryModal from '../../shared/galleryModal/galleryModal.index';
import Carousel from '../../shared/carousel/carousel.index';

// Assets
import './page.housingSingle.scss'

// Utils
import GlobalUtils from '../../utils/GlobalUtils';
import AppConstants from '../../utils/AppConstants';



const RATING_TAGS = ["Check-in", "Communication", "Accuracy", "Cleanliness", "Location", "Value"]

const dataRatingComments = Array(6).fill(0).map((item, itemIndex) => ({
    id: itemIndex,
    rating: Math.round(Math.random() * 5),
    posted_at: moment().subtract((Math.random() * 45), "days"),
    guest: {
        display_name: "John Doe",
        avatar: "https://s3.amazonaws.com/uifaces/faces/twitter/tereshenkov/128.jpg",
    },
    comment: "Lorem ipsum, dolor sit amet consectetur adipisicing elit. Vel dolorum molestiae omnis accusantium tempore ea quisquam vitae nemo placeat velit ipsam veritatis, repellendus perspiciatis odit eum voluptas, iste rerum modi necessitatibus cumque explicabo sed nisi ad."
})).sort((a, b) => -a.posted_at.diff(b.posted_at, "day"))

const dataRatingsTags = [3.5, 4.5, 3.4, 4.7, 2.7, 4.1]

const data = {
    id: 0, 
    title: "Jolie petite Chambre près du Canal St Martin", 
    rating: {
        count: 124,
        value: 4.3
    },
    images: Array(7).fill(true).map((_, i) => "https://picsum.photos/id/" + (i) +"/600/300"),
    location: {
        city: "Paris",
        country: "France"
    },
    tags: ["2 guest", "1 bath", "1 kitchen", "Wifi"],
    host: {
        display_name: "John Doe",
        avatar: "https://s3.amazonaws.com/uifaces/faces/twitter/tereshenkov/128.jpg"
    }
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
    },


    mobileBookingCta__btn: {
        marginLeft: "auto"
    },

    bookingCta__btn: {
        marginTop: theme.spacing(3)
    },

    closeModalBtn: {
        position: "absolute",
        right: 0,
        top: 0,
        borderRadius: 0
    },

})

class PageHousingSingle extends React.Component{

    constructor(props){
        super(props)

        this.state = {
            galleryModalIsOpen: false,
            galleryModalStartAt: 0,

            openBookingDialog: false,

            formData: {
                checkin: null,
                chekout: null,
            }
        }
    }

    onCloseModal = () => {
        this.setState({galleryModalIsOpen: false})
    }

    handleDateChange = name => nextDate => {
        this.setState({
            formData: {
                ...this.state.formData,
                [name]: nextDate
            }
        })
    }

    render(){

        const {classes} = this.props

        const BookingCtaContainer = ({isMobile = false}) => (
            <div className={`page-housingSingle-bookingCta ${isMobile ? "page-housingSingle-bookingCta__mobile" : ""}`}>
                    <div className="page-housingSingle-bookingCta-heading">
                        <Typography variant="h6">Add dates for prices</Typography>
                    </div>
                    <div className="hr"/>
                    <div className="page-housingSingle-bookingCta-datepickers">
                        <DatePicker
                            disableToolbar
                            variant="inline"
                            format="MM/DD/YYYY"
                            margin="normal"
                            label="Checkin"
                            value={this.state.formData.checkin}
                            onChange={this.handleDateChange("checkin")}
                            fullWidth
                            inputVariant="outlined"

                        />
                        <DatePicker
                            disableToolbar
                            variant="inline"
                            format="MM/DD/YYYY"
                            margin="normal"
                            label="Checkout"
                            value={this.state.formData.checkout}
                            onChange={this.handleDateChange("checkout")}
                            fullWidth   
                            inputVariant="outlined"
                        />
                    </div>
                    <Button
                        variant="contained"
                        color="primary"
                        size="large"
                        fullWidth
                        classes={{root: classes.bookingCta__btn}}
                    >Book</Button>
                </div>
        )
        return (
            <div className="page page-housingSingle">
                <div className="page-housingSingle-mobileBookingCta">
                    <Button
                        variant="contained"
                        color="primary"
                        size="large"
                        classes={{root: classes.mobileBookingCta__btn}}
                        onClick={() => this.setState({openBookingDialog: true})}
                    >Add dates</Button>
                    <Dialog
                        open={this.state.openBookingDialog}
                        fullScreen
                    >
                        <DialogContent>
                            <IconButton onClick={() => this.setState({openBookingDialog: false})} classes={{root: classes.closeModalBtn}}>
                                <CloseRounded/>
                            </IconButton>
                            <BookingCtaContainer isMobile={true}/>
                        </DialogContent>
                    </Dialog>
                </div>
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

                <div className="page-housingSingle-bodyContainer">
                    <div className="page-housingSingle-body">
                        <div className="page-housingSingle-body-row">
                            <div className="page-housingSingle-body-title">
                                <Typography variant="h3">{data.title}</Typography>
                            </div>
                        </div>

                        <div className="page-housingSingle-body-row">
                            <span className="page-housingSingle-body-location">{data.location.city}</span>
                            <div className="page-housingSingle-body-host">
                                <div className="page-housingSingle-body-host-avatar">
                                    <img src={data.host.avatar} alt=""/>
                                </div>
                                <span className="page-housingSingle-body-host-name">
                                    <Typography variant="subtitle2" component="span">{data.host.display_name}</Typography>
                                </span>
                            </div>  
                        </div>
                        <BodySection
                            title="Information about the housing"
                            name="information"
                            body={
                                <Typography variant="subtitle2" className="page-housingSingle-body-info-data">{data.tags.join(" · ")}</Typography>
                            }
                        />
                        <div className="hr"/>
                        <BodySection
                            title="Description"
                            name="description"
                            body={
                                <div className="page-housingSingle-body-section-body">
                                    <Typography variant="body2" component="p">Lorem ipsum, dolor sit amet consectetur adipisicing elit. Vel dolorum molestiae omnis accusantium tempore ea quisquam vitae nemo placeat velit ipsam veritatis, repellendus perspiciatis odit eum voluptas, iste rerum modi necessitatibus cumque explicabo sed nisi ad. Consectetur impedit nihil voluptate atque quis non quidem deleniti minima voluptates qui! Voluptatem velit porro illum tempora omnis.</Typography>
                                </div>
                            }
                        />
                        <div className="hr small"></div>
                        <BodySection
                            title="Reviews"
                            name="reviews"
                            body={
                                <React.Fragment>
                                    <div className="page-housingSingle-body-section__reviews-top">
                                        <StarRounded color="secondary" className="page-housingSingle-body-section__reviews-top__icon"/>
                                        <Typography className="page-housingSingle-body-section__reviews-top__score" component="span" variant="h6">4.42</Typography>
                                        <div className="separator vertical"/>
                                        <span className="page-housingSingle-body-section__reviews-top__count">
                                            <Typography component="span" className="page-housingSingle-body-section__reviews-top__count-value">462</Typography>
                                            <span> reviews</span>
                                        </span>
                                    </div>
                                    <div className="page-housingSingle-body-section__reviews-details">
                                        {
                                            RATING_TAGS.map((tag, tagIndex) => (
                                                <div key={"rating-tag-" + tagIndex} className="page-housingSingle-body-section__reviews-details-item">
                                                    <div className="page-housingSingle-body-section__reviews-details-item-name">{tag}</div>
                                                    <div className="page-housingSingle-body-section__reviews-details-item-value">
                                                        <div className="progress">
                                                            <div style={{backgroundColor: this.props.theme.palette.secondary.main, width: (dataRatingsTags[tagIndex] * 100 / 5) + "%"}} className="progress-value"></div>
                                                        </div>
                                                        <div className="page-housingSingle-body-section__reviews-details-item-value-value">{dataRatingsTags[tagIndex]}</div>
                                                    </div>
                                                </div>
                                            ))
                                        }
                                    </div>
                                    <div className="page-housingSingle-body-section__reviews-comments">
                                        {
                                            dataRatingComments.map((comment) => {

                                                return (
                                                    <div key={"comment-" + comment.id} className="page-housingSingle-body-section__reviews-comments-item">
                                                        <div className="page-housingSingle-body-section__reviews-comments-item-top">
                                                            <div className="page-housingSingle-body-section__reviews-comments-item-top-guest">
                                                                <div className="page-housingSingle-body-section__reviews-comments-item-top-guest__avatar">
                                                                    <img src={comment.guest.avatar} alt={comment.guest.display_name}/>
                                                                </div>
                                                                <div className="page-housingSingle-body-section__reviews-comments-item-top-guest__right">
                                                                    <div className="page-housingSingle-body-section__reviews-comments-item-top-guest__right__name">
                                                                        <Typography component="span" variant="subtitle1">{comment.guest.display_name}</Typography>
                                                                    </div>
                                                                    <div className="page-housingSingle-body-section__reviews-comments-item-top-guest__right__date">
                                                                        <Typography variant="subtitle1" component="span">{comment.posted_at.format("DD/MM/YYYY")}</Typography>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div className="page-housingSingle-body-section__reviews-comments-item-top-score">
                                                                <StarRounded color="secondary" className="page-housingSingle-body-section__reviews-comments-item-top-score__icon"/>
                                                                <Typography className="page-housingSingle-body-section__reviews-comments-item-top-score__value" component="span" variant="h6">{comment.rating}</Typography>
                                                            </div>
                                                        </div>
                                                        <div className="page-housingSingle-body-section__reviews-comments-item-body">
                                                            <Typography variant="body1">{comment.comment}</Typography>
                                                        </div>
                                                    </div>
                                                )
                                            })
                                        }
                                    </div>
                                </React.Fragment>
                            }
                        />
                    </div>
                    

                    <div className="page-housingSingle-aside">
                        <BookingCtaContainer/>
                    </div>
                </div>
                
            </div>
        )
    }
}


const BodySection = withStyles(createStyles(theme => ({
    section__title: {
        marginBottom: 15
    }
})))(({title, name, body, classes}) => (
    <div id={name} className={"page-housingSingle-body-section page-housingSingle-body-section__" + name}>
        <Typography variant="h5" className={classes.section__title}>{title}</Typography>
        <div className="page-housingSingle-body-section-body">
            {body}
        </div>
    </div>
))



export default withRouter(widthWindowWidth(withStyles(styles)(withTheme(PageHousingSingle))))