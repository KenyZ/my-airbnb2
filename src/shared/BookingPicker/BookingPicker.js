import React from 'react'
import PropTypes from 'prop-types'
import { withStyles, createStyles} from '@material-ui/styles'
import DayPicker, {DateUtils} from 'react-day-picker'
import 'react-day-picker/lib/style.css'

// Assets
import "./BookingPicker.scss"
const styles = createStyles(theme => ({

}))


class BookingPicker extends React.Component{

    constructor(props){
        super(props)
        this.state = {
            enteredTo: null
        }
        
    }

    isSelectingFirstDay = (from, to, day) => {
        const isBeforeFirstDay = from && DateUtils.isDayBefore(day, from)
        const isRangeSelected = from && to
        return !from || isBeforeFirstDay || isRangeSelected
    }

    handleDayClick = (day, modifiers = {}) => {

        if (modifiers.alreadyBooked) {
            return;
        }

        const { from, to } = this.props
        if (from && to && day >= from && day <= to) {
            this.handleResetClick()
            return
        }
        if (this.isSelectingFirstDay(from, to, day)) {

            this.setState({
                enteredTo: null,
            }, () => {
                this.props.onDayChange({
                    from: day,
                    to: null
                })
            })
        } else {
            this.setState({
                enteredTo: day,
            }, () => {
                this.props.onDayChange({
                    from: this.props.from,
                    to: day
                })
            })
        }
    }

    handleDayMouseEnter = (day) => {
        const { from, to } = this.props
        if (!this.isSelectingFirstDay(from, to, day)) {
            this.setState({
                enteredTo: day,
            })
        }
    }

    handleResetClick = () => {
        this.props.onDayChange({
            from: null,
            to: null
        })
    }


    render(){

        const { from } = this.props
        const enteredTo = this.state.enteredTo
        const modifiers = { start: from, end: enteredTo, alreadyBooked: this.props.bookings}
        const disabledDays = [
            ...this.props.bookings,
            {before: from},
        ]
        const selectedDays = [from, { from, to: enteredTo }]
        
        return (
            <div className="BookingPicker">
                <DayPicker
                    onMonthChange={this.props.onMonthChange}
                    numberOfMonths={2}
                    fromMonth={new Date()}
                    toMonth={DateUtils.addMonths(new Date(), 12)}
                    selectedDays={selectedDays}
                    disabledDays={disabledDays}
                    modifiers={modifiers}
                    onDayClick={this.handleDayClick}
                    onDayMouseEnter={this.handleDayMouseEnter}
                />
            </div>
        )
    }

}


BookingPicker.propTypes = {
    onDayChange: PropTypes.func.isRequired,
    from: PropTypes.instanceOf(Date),
    to: PropTypes.instanceOf(Date),
    bookings: PropTypes.arrayOf(PropTypes.shape({
        from: PropTypes.instanceOf(Date),
        to: PropTypes.instanceOf(Date),
    }))
}

export default withStyles(styles)(BookingPicker)