// Modules
import React from 'react'
import {
    Dialog, Typography, IconButton, DialogContent
} from '@material-ui/core'
import PropTypes from 'prop-types'
import Carousel from '../carousel/carousel.index'
import {
    NavigateBefore,
    NavigateNext,
    CloseRounded
} from '@material-ui/icons'
import { withStyles, createStyles, makeStyles } from '@material-ui/styles'

// Components

// Assets
import './galleryModal.scss'


const galleryModalStyles = createStyles(theme => ({

    closeModalBtn: {
        position: "absolute",
        right: 0,
        top: 0,
        borderRadius: 0
    }

}))

class GalleryModal extends React.Component{

    constructor(props){
        super(props)

        this.state = {
            mainCarousel: null,
            previewCarousel: null,

            currentIndex: 0,
        }

        this.mainCarousel = null
        this.previewCarousel = null
    }

    setRefAndState = name => (el) => {
        if(!this[name]){
            this[name] = el
            this.setState({[name]: el})
        }
    }

    componentDidMount(){
        this.setState({
            mainCarousel: this.mainCarousel,
            previewCarousel: this.previewCarousel,
        })
    }

    componentDidUpdate(prevProps){

        const prevInitialSlide = prevProps.startAt
        const currentInitialSlide = this.props.startAt

        if(prevInitialSlide !== currentInitialSlide){
            this.setState({currentIndex: currentInitialSlide})
        }
    }

    _afterChange = current => {
        this.setState({currentIndex: current})
    }

    _closeModal(){

    }

    render(){

        const classes = this.props.classes
        return(
            <Dialog
                fullScreen 
                open={this.props.open}
                className="ModalGallery"
            >
                <DialogContent>
                    <IconButton onClick={this.props.onClose} classes={{root: classes.closeModalBtn}}>
                        <CloseRounded/>
                    </IconButton>
                    <div className="ModalGallery-gallery">

                        <div className="ModalGallery-gallery-main">
                            <Carousel
                                images={this.props.images}
                                carouselRef={this.setRefAndState("mainCarousel")}
                                SlickProps={{
                                    asNavFor: this.state.previewCarousel,
                                    dots: false,
                                    afterChange: this._afterChange,
                                    arrows: true,
                                    prevArrow: <CustomArrowPrev/>,
                                    nextArrow: <CustomArrowNext/>,
                                    initialSlide: this.props.startAt
                                }}
                            />
                        </div>

                        <div className="ModalGallery-gallery-preview">
                            <Carousel
                                images={this.props.images}
                                carouselRef={this.setRefAndState("previewCarousel")}
                                SlickProps={{
                                    asNavFor: this.state.mainCarousel,
                                    slidesToShow: 5,
                                    dots: false,
                                    focusOnSelect: true,
                                    initialSlide: this.props.startAt
                                }}
                            />
                        </div>

                        <Typography className="ModalGallery-gallery-count" variant="h6" component="p">
                            {`${this.state.currentIndex + 1} / ${this.props.images.length}`}
                        </Typography>
                        
                    </div>
                </DialogContent>
            </Dialog>
        )
    }
}

const useCustomArrowStyles = makeStyles(theme => {
    return {
        root: {
            position: "absolute",
            zIndex: 1,
            top: "50%",
            transform: "translate(0, -50%)"
        }
    }
})

const CustomArrowPrev = props => {
    const styles = useCustomArrowStyles()
    return (
        <IconButton color="primary" classes={styles} onClick={props.onClick} style={{left: -60}}>
            <NavigateBefore/>
        </IconButton>
    )
}

const CustomArrowNext = props => {
    const styles = useCustomArrowStyles()
    return (
        <IconButton color="primary" classes={styles} onClick={props.onClick} style={{right: -60}}>
            <NavigateNext/>
        </IconButton>
    )
}

GalleryModal.defaultProps = {
    statAt: 0
}

GalleryModal.propTypes = {
    open: PropTypes.bool.isRequired,
    images: PropTypes.array.isRequired,
    onClose: PropTypes.func.isRequired,
    startAt: PropTypes.number
}

export default withStyles(galleryModalStyles)(GalleryModal)

