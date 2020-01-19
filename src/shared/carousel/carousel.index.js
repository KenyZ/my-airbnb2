// Modules
import React from 'react'
import Slider from 'react-slick';
import PropTypes from 'prop-types'

// Assets
import './carousel.scss'

// Utils
import GlobalUtils from '../../utils/GlobalUtils'

class Carousel extends React.Component {

    constructor(props){
        super(props)

        this.state = {
            carouselCurrent: 0
        }
    }

    _afterChange = current => {

        this.setState({carouselCurrent: current})

        if(this.props.SlickProps.afterChange){
            this.props.SlickProps.afterChange(current)
        }
    }

    render(){
        return (

            this.props.images.length > 1 ? (
                <Slider
                    dots={true}
                    arrows={false}
                    infinite={false}
                    slidesToShow={1}         
                    slidesToScroll={1}
                    className="Carousel"
                    ref={this.props.carouselRef}
                    afterChange={this._afterChange}

                    {...this.props.SlickProps}

                >{
                    this.props.images.map((image, imageIndex) => (
                        <div 
                            key={"image-" + imageIndex} 
                            className={GlobalUtils.setClassnames("Carousel-item", {
                                "Carousel-item-current": imageIndex === this.state.carouselCurrent
                            })}
                        >
                            <div className="Carousel-item-inner">
                                <img src={image} alt=""/>
                            </div>
                        </div>
                    ))
                }</Slider>
                
            ) : (
                <div className="Carousel">
                    <div className="Carousel-item">
                        <img src={this.props.images[0]} alt=""/>
                    </div>
                </div>
            )
    
            
        )
    }
}

Carousel.defaultProps = {
    SlickProps: {}
}

Carousel.propTypes = {
    images: PropTypes.array.isRequired,
    carouselRef: PropTypes.any,
    SlickProps: PropTypes.object
}

export default Carousel
