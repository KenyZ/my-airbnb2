// Modules
import React from 'react'
import {
    NavigateBefore,
    NavigateNext
} from '@material-ui/icons'
import { IconButton } from '@material-ui/core'
import { withStyles, createStyles } from '@material-ui/styles';
import PropTypes from 'prop-types'

// Assets
import './pagination.scss'
import GlobalUtils from '../../utils/GlobalUtils';


const styles = createStyles(theme => ({


}))

// @OPTIMIZATION - should display page [1;infini] instead of [0;infini]
class Pagination extends React.Component{
    render(){

        // const classes = this.props.classes

        return(
            <div className="Pagination">
                {this.props.page_current !== 0 && <div className="Pagination-arrow Pagination-arrow-prev">
                    <IconButton onClick={() => this.props.onClick(this.props.page_current - 1)}>
                        <NavigateBefore/>
                    </IconButton>
                </div>}

                <div className="Pagination-list">
                    {
                        // @OPTIMIZATION - completly deprecated
                        Array(this.props.page_count).fill(true).map((page, pageIndex) => {

                            const isPrev = pageIndex === this.props.page_current - 1
                            const isNext = pageIndex === this.props.page_current + 1

                            const isFirst = pageIndex === 0
                            const isLast = pageIndex === this.props.page_count - 1
                            
                            const isCurrent = pageIndex === this.props.page_current

                            
                            if(
                                (isCurrent)
                                || (isFirst || isLast) 
                                || (isPrev || isNext)
                            ){ 

                                return (
                                    <React.Fragment
                                        key={"pagination-btn-" + pageIndex}
                                    >
                                        {
                                            (isPrev && !isFirst) && <div className="dots">…</div>
                                        }
                                        <button
                                            onClick={() => this.props.onClick(pageIndex)}
                                            className={GlobalUtils.setClassnames("Pagination-list-btn", {
                                                "current": pageIndex === this.props.page_current
                                            })}
                                        >
                                            <span>{pageIndex + 1}</span>
                                        </button>
                                        {
                                            (isNext && !isLast) && <div className="dots">…</div>
                                        }
                                    </React.Fragment>
                                )
                            } else {
                                return ""
                            }
                            
                        })
                    }
                </div>

                {this.props.page_current !== this.props.page_count - 1 && <div className="Pagination-arrow Pagination-arrow-next">
                    <IconButton onClick={() => this.props.onClick(this.props.page_current + 1)}>
                        <NavigateNext/>
                    </IconButton>
                </div>}
            </div>
        )
    }
}

Pagination.propTypes = {
    item_count: PropTypes.number.isRequired,
    page_current: PropTypes.number.isRequired,
    page_count: PropTypes.number.isRequired,
    onClick: PropTypes.func.isRequired,
}

export default withStyles(styles)(Pagination)