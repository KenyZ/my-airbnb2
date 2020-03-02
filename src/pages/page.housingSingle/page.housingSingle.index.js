// Modules
import React from 'react'
import { StarRounded } from '@material-ui/icons'
import {
    withRouter
} from 'react-router-dom'
import { Button, Dialog, DialogContent, IconButton, Typography, CircularProgress } from '@material-ui/core';
import {CloseRounded} from '@material-ui/icons'
import { withStyles, createStyles, withTheme } from '@material-ui/styles';
import Skeleton from '@material-ui/lab/Skeleton';
import moment from 'moment';

// Components
import widthWindowWidth from '../../shared/widthWindowWidth';
import GalleryModal from '../../shared/galleryModal/galleryModal.index';
import Carousel from '../../shared/carousel/carousel.index';
import Pagination from '../../shared/pagination/pagination.index'


// Assets
import './page.housingSingle.scss'

// Utils
import utils from '../../utils/app.utils';
import params from '../../utils/app.params';
import BookingPicker from '../../shared/BookingPicker/BookingPicker';

const capitalize = (s) => {
    if (typeof s !== 'string') return ''
    return s.charAt(0).toUpperCase() + s.slice(1)
}


const styles = theme => createStyles({

    dayWrapper: {
        position: "relative",
      },
      day: {
        width: 36,
        height: 36,
        fontSize: theme.typography.caption.fontSize,
        margin: "0 2px",
        color: "inherit",
      },
      customDayHighlight: {
        position: "absolute",
        top: 0,
        bottom: 0,
        left: "2px",
        right: "2px",
        border: `1px solid ${theme.palette.secondary.main}`,
        borderRadius: "50%",
      },
      nonCurrentMonthDay: {
        color: theme.palette.text.disabled,
      },
      highlightNonCurrentMonthDay: {
        color: "#676767",
      },
      highlight: {
        background: theme.palette.primary.main,
        color: theme.palette.common.white,
      },
      firstHighlight: {
        extend: "highlight",
        borderTopLeftRadius: "50%",
        borderBottomLeftRadius: "50%",
      },
      endHighlight: {
        extend: "highlight",
        borderTopRightRadius: "50%",
        borderBottomRightRadius: "50%",
      },


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
        marginLeft: "auto",
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

        this.defaultStateFormData = {
            from: null,
            to: null,
        }

        this.state = {
            galleryModalIsOpen: false,
            galleryModalStartAt: 0,

            openBookingDialog: false,

            formData: {...this.defaultStateFormData},

            housing: null,

            reviews: null,
            reviewsPagination: null,

            bookings: [],
        }

        this.reviewsSectionRef = React.createRef()
    }

    fetchHousingReviews = (page = 0) => {

        const housingId = this.props.match.params.id

        return utils.request.jsonFetcher("/housing/" + housingId + "/review?offset=" + page)
        .then(res => {

            if(res.error){
                return
            }

            this.setState({
                reviews: res.data.list,
                reviewsPagination: res.data.pagination
            })
        })
    }

    fetchHousingBookings = date => {

        const housingId = this.props.match.params.id

        return utils.request.jsonFetcher("/housing/" + housingId + "/booking?month=" + date.format("MMM") + "&year=" + date.format("YYYY"))
        .then(res => {

            if(res.error){
                return
            }

            this.setState({
                bookings: res.data.list.map(listItem => ({
                    from: new Date(listItem.from),
                    to: new Date(listItem.to),
                }))
            })

            return res
        })
    }

    componentDidMount(){

        const housingId = this.props.match.params.id

        if(housingId){

            // Fetch housing data
            utils.request.jsonFetcher("/housing/" + housingId)
            .then(res => {

                if(res.error){
                    return
                }

                this.setState({
                    housing: res.data
                })
            })

            // Fetch reviews
            this.fetchHousingReviews(0)
            // Fetching bookings
            this.fetchHousingBookings(moment())
        } else {
            console.error("No id matched")
            // go to 404
        }
        
    }

    onCloseModal = () => {
        this.setState({galleryModalIsOpen: false})
    }


    handlePagination = page => {
        this.fetchHousingReviews(page).then(() => {
            const reviewsAnchor = this.reviewsSectionRef
            window.scrollTo(0, reviewsAnchor.current.offsetTop)
        })
    }

    handleDateChange = name => nextDate => {
        this.setState({
            formData: {
                ...this.state.formData,
                [name]: nextDate
            }
        })
    }

    onDayBookingChange = (newDate) => {
        this.setState({
            formData: {
                ...this.state.formData,
                ...newDate
            }
        })
    }

    onBookingMonthChange = month => {
        this.fetchHousingBookings(moment(month))
    }

    onSubmitBooking = () => {
        
        const housingId = this.props.match.params.id

        utils.request.bodyFetcher("/housing/" + housingId + "/book", this.state.formData, "PUT")
        .then(res => {

            if(res.error){
                console.log(res.error)
                return
            } 

            this.setState({
                formData: this.defaultStateFormData,
                openBookingDialog: false
            })

        })
    }
    
    render(){

        const {classes} = this.props

        const housing = this.state.housing
        const reviews = this.state.reviews

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
                            <BookingCtaContainer 
                                bookings={this.state.bookings} 
                                from={this.state.formData.from} 
                                to={this.state.formData.to} 
                                onDayChange={this.onDayBookingChange}
                                housing={housing} 
                                classes={classes} 
                                isMobile={true}
                                onMonthChange={this.onBookingMonthChange}
                                onSubmit={this.onSubmitBooking}
                            />
                        </DialogContent>
                    </Dialog>
                </div>
                {
                    // show carousel on mobile && grid on tablet and more
                    (this.props.windowWidth > params.BREAKPOINTS.tablet && (housing && housing.images.length !== 2)) ? (
                        <div className={utils.setClassnames("page-housingSingle-gallery", {
                            "page-housingSingle-gallery-1": housing.images.length === 1,
                            "page-housingSingle-gallery-2": housing.images.length === 2,
                            "page-housingSingle-gallery-3": housing.images.length === 3,
                            "page-housingSingle-gallery-4": housing.images.length === 4,
                            "page-housingSingle-gallery-5andmore": housing.images.length >= 5,
                        })}>
                            {
                                housing.images.length > 1 && (
                                    <>
                                        <Button 
                                            onClick={() => this.setState({galleryModalIsOpen: true})} 
                                            color="primary" 
                                            variant="contained" 
                                            classes={{root: classes.viewPhotosBtn__root}}
                                        >View photos</Button>

                                        <GalleryModal
                                            images={housing.images}
                                            onClose={this.onCloseModal}
                                            open={this.state.galleryModalIsOpen}
                                            startAt={this.state.galleryModalStartAt}
                                        />
                                    </>
                                )
                            }
                            <div className="page-housingSingle-gallery-grid">
                            {
                               housing.images.slice(0, 5).map((image, imageIndex) => {
                                    return (
                                        <Button
                                            classes={{root: classes.galleryItemBtn}}
                                            key={"images-" + imageIndex} 
                                            className={"page-housingSingle-gallery-grid-item cell-" + (1 + imageIndex)}
                                            onClick={() => this.setState({galleryModalIsOpen: true, galleryModalStartAt: imageIndex})}
                                        >
                                            <div>
                                                <img src={image.url} alt=""/>
                                            </div>
                                        </Button>
                                        
                                    )
                                })
                            }
                            </div>
                        </div>
                    ) : (
                        housing ? (<Carousel images={housing.images.map(img => img.url)}/>) : (<Skeleton variant="rect" animation="wave" style={{paddingTop: (100 / (560/260)) + "%"}}/>)
                    )
                }

                <div className="page-housingSingle-bodyContainer">
                    <div className="page-housingSingle-body">
                        <div className="page-housingSingle-body-row">
                            <div className="page-housingSingle-body-title">
                                
                                {!housing && (
                                    <React.Fragment>
                                        <Skeleton variant="text" width={"100%"}/>
                                        <Skeleton variant="text" width={"100%"}/>
                                        <Skeleton variant="text" width={"50%"}/>
                                    </React.Fragment>
                                )}
                                {housing && <Typography variant="h3">{housing.title}</Typography>}
                            </div>
                        </div>

                        <div className="page-housingSingle-body-row">
                            <span className="page-housingSingle-body-location">
                                {housing ? housing.location_country : (
                                    <Skeleton variant="text"/>
                                )}
                            </span>
                            <div className="page-housingSingle-body-host">
                                <div className="page-housingSingle-body-host-avatar">
                                    {housing ?( <img src={housing.host.avatar} alt=""/>) : (
                                        <Skeleton variant="circle" width={35} height={35}/>
                                    )}
                                </div>
                                <div className="page-housingSingle-body-host-name">
                                    {housing ? (
                                        <Typography variant="subtitle2" component="span">
                                            {utils.renderUserDisplayName(housing.host)}
                                        </Typography>) : 
                                        (
                                            <Skeleton variant="text" width={45}/>
                                        )
                                    }
                                </div>
                            </div>  
                        </div>
                        <BodySection
                            title="Information about the housing"
                            name="information"
                            body={
                                housing ? (
                                    <Typography variant="subtitle2" className="page-housingSingle-body-info-data">
                                        {utils.renderHousingTags(housing)}
                                    </Typography>
                                ) : (
                                    <Skeleton variant="text"/>
                                )
                            }
                        />
                        <div className="hr"/>
                        <BodySection
                            title="Description"
                            name="description"
                            body={
                                <div className="page-housingSingle-body-section-body">
                                    {housing ? (<Typography variant="body2" component="p">{housing.description}</Typography>) : (
                                        <React.Fragment>
                                            <Skeleton variant="text"/>
                                            <Skeleton variant="text"/>
                                            <Skeleton variant="text"/>
                                            <Skeleton variant="text"/>
                                            <Skeleton variant="text" width={"80%"}/>
                                        </React.Fragment>
                                    )}
                                </div>
                            }
                        />
                        <div className="hr small"></div>
                        <BodySection
                            title="Reviews"
                            name="reviews"
                            sectionRef={this.reviewsSectionRef}
                            body={
                                housing ? (<React.Fragment>
                                    <div className="page-housingSingle-body-section__reviews-top">
                                        <StarRounded color="secondary" className="page-housingSingle-body-section__reviews-top__icon"/>
                                        {housing && <Typography className="page-housingSingle-body-section__reviews-top__score" component="span" variant="h6">{housing.reviews.score_total}</Typography>}
                                        <div className="separator vertical"/>
                                        <span className="page-housingSingle-body-section__reviews-top__count">
                                            {housing && <Typography component="span" className="page-housingSingle-body-section__reviews-top__count-value">{housing.reviews.count}</Typography>}
                                            <span> reviews</span>
                                        </span>
                                    </div>
                                    <div className="page-housingSingle-body-section__reviews-details">
                                        {
                                            housing && Object.entries(housing.reviews.score_details).map(([scoreName, score], scoreIndex) => (
                                                <div key={"rating-score-" + scoreIndex} className="page-housingSingle-body-section__reviews-details-item">
                                                    <div className="page-housingSingle-body-section__reviews-details-item-name">
                                                        <Typography variant="body1">{capitalize(scoreName)}</Typography>
                                                    </div>
                                                    <div className="page-housingSingle-body-section__reviews-details-item-value">
                                                        <div className="progress">
                                                            <div style={{backgroundColor: this.props.theme.palette.secondary.main, width: (score * 100 / 5) + "%"}} className="progress-value"></div>
                                                        </div>
                                                        <div className="page-housingSingle-body-section__reviews-details-item-value-value">{score}</div>
                                                    </div>
                                                </div>
                                            ))
                                        }
                                    </div>
                                    <div className="page-housingSingle-body-section__reviews-comments">
                                        {
                                            reviews ? reviews.map((comment) => {

                                                return (
                                                    <div key={"comment-" + comment.id} className="page-housingSingle-body-section__reviews-comments-item">
                                                        <div className="page-housingSingle-body-section__reviews-comments-item-top">
                                                            <div className="page-housingSingle-body-section__reviews-comments-item-top-guest">
                                                                <div className="page-housingSingle-body-section__reviews-comments-item-top-guest__avatar">
                                                                    <img src={comment.author.avatar} alt={utils.renderUserDisplayName(comment.author)}/>
                                                                </div>
                                                                <div className="page-housingSingle-body-section__reviews-comments-item-top-guest__right">
                                                                    <div className="page-housingSingle-body-section__reviews-comments-item-top-guest__right__name">
                                                                        <Typography component="span" variant="subtitle1">{comment.author.display_name}</Typography>
                                                                    </div>
                                                                    <div className="page-housingSingle-body-section__reviews-comments-item-top-guest__right__date">
                                                                        <Typography variant="subtitle1" component="span">
                                                                            {moment(new Date(comment.posted_at)).format("DD MMMM YYYY")}
                                                                        </Typography>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div className="page-housingSingle-body-section__reviews-comments-item-top-score">
                                                                <StarRounded color="secondary" className="page-housingSingle-body-section__reviews-comments-item-top-score__icon"/>
                                                                <Typography className="page-housingSingle-body-section__reviews-comments-item-top-score__value" component="span" variant="h6">{comment.score_total}</Typography>
                                                            </div>
                                                        </div>
                                                        {comment.comment && <div className="page-housingSingle-body-section__reviews-comments-item-body">
                                                            <Typography variant="body1">{comment.comment}</Typography>
                                                        </div>}
                                                    </div>
                                                )
                                            }) : (
                                                <div style={{display: "flex", justifyContent: "center"}}>
                                                    <CircularProgress color="primary"/>
                                                </div>
                                            )
                                        }
                                    </div>
                                    {this.state.reviewsPagination && <Pagination onClick={this.handlePagination} {...this.state.reviewsPagination}/>}
                                </React.Fragment>) : (
                                    <Skeleton variant="rect" height={200}/>
                                )
                            }
                        />
                    </div>
                    

                    {/* <div className="page-housingSingle-aside">
                        <BookingCtaContainer bookings={this.state.bookings} formData={this.state.formData} handleDateChange={this.handleDateChange} onMonthChange={this.onMonthOrYearChange} classes={classes} housing={housing}/>
                    </div> */}
                </div>
                
            </div>
        )
    }
}

const BookingCtaContainer = ({housing, onMonthChange, bookings, classes, onDayChange, from, to, onSubmit, isMobile = false}) => (
    <div className={`page-housingSingle-bookingCta ${isMobile ? "page-housingSingle-bookingCta__mobile" : ""}`}>
            <div className="page-housingSingle-bookingCta-heading">
                {housing && <Typography variant="h6">Add dates for prices</Typography>}
                {!housing && <Skeleton variant="text"/>}
            </div>
            <div className="hr"/>
            <div className="page-housingSingle-bookingCta-datepickers">
                {housing ? (
                    <BookingPicker
                        onDayChange={onDayChange}
                        from={from}
                        to={to}
                        bookings={bookings}
                        onMonthChange={onMonthChange}
                    />
                ) : (
                    <React.Fragment>
                        <Skeleton variant="rect" style={{marginBottom: 15}}/>
                        <Skeleton variant="rect" style={{marginBottom: 15}}/>
                    </React.Fragment>
                )}
            </div>
            {housing ? (<Button
                variant="contained"
                color="primary"
                size="large"
                fullWidth
                classes={{root: classes.bookingCta__btn}}
                onClick={onSubmit}
                // IF some data in formData is undefined THEN disable submit
                disabled={!from || !to}
            >Book</Button>) : (
                <Skeleton variant="rect" height={40}/>
            )}
        </div>
)


const BodySection = withStyles(createStyles(theme => ({
    section__title: {
        marginBottom: 15
    }
})))(({title, name, body, classes, sectionRef = null}) => (
    <div ref={sectionRef} id={name} className={"page-housingSingle-body-section page-housingSingle-body-section__" + name}>
        <Typography variant="h5" className={classes.section__title}>{title}</Typography>
        <div className="page-housingSingle-body-section-body">
            {body}
        </div>
    </div>
))



export default withRouter(widthWindowWidth(withStyles(styles)(withTheme(PageHousingSingle))))