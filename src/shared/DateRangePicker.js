import React from 'react'
import {IconButton} from '@material-ui/core'
import {DatePicker, Day} from '@material-ui/pickers'
import moment from 'moment';
import clsx from 'clsx'
import PropTypes from 'prop-types'
import { withStyles, createStyles} from '@material-ui/styles';


const _Utils = {
    isWithinRange: (date, start, end) => (date.diff(start) >= 0 && end.diff(date) >= 0)
}

const styles = createStyles(theme => ({

    alreadyBooked: {
        textDecoration: "line-through"
    },

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
        background: theme.palette.primary.main,
        color: theme.palette.common.white,
        borderTopLeftRadius: "50%",
        borderBottomLeftRadius: "50%",
    },
    endHighlight: {
        background: theme.palette.primary.main,
        color: theme.palette.common.white,
        borderTopRightRadius: "50%",
        borderBottomRightRadius: "50%",
    },

}))


const MyDatePicker = (props) => {

    console.log("rendered")

    React.useEffect(() => {
        console.log("ON MOUNTED")

        return () => {
            console.log("ON UNMOUNTED ####")
        }
    }, [])

    return (
        <DatePicker {...props}/>
    )
} 

class DateRangePicker extends React.Component{

    constructor(props){
        super(props)
        this.state = {
            dateStart: moment(),
            dateEnd: moment(),


            shouldOpenCheckinCalendar: undefined,
            shouldOpenCheckoutCalendar: undefined,

            checkinCalendarHoveredDay: null,
            checkoutCalendarHoveredDay: null,

            openedCalendar: null,
        }
    }

    isAlreadyBooked = date => {
        return this.props.bookings.some(({checkin, checkout}) => {

            let itemCheckin = moment(checkin)
            let itemCheckout = moment(checkout)

            return _Utils.isWithinRange(date, itemCheckin, itemCheckout)
        })
    }

    renderCalendarDay = (day, selectedDate, isInCurrentMonth, dayComponent) => {


        console.log('process rendering dayWrapper')

        const checkin = this.state.checkinCalendarHoveredDay ? this.state.checkinCalendarHoveredDay : this.props.checkin
        const checkout = this.state.checkoutCalendarHoveredDay ? this.state.checkoutCalendarHoveredDay : this.props.checkout

        let alreadyBooked = this.isAlreadyBooked(day)
        let isDisabled = alreadyBooked || !isInCurrentMonth || moment().diff(day, "day") > 0
        let isWithinRange = checkin && checkout && _Utils.isWithinRange(day, checkin, checkout)

        let nextDateIsCoherent = false

        if(this.state.openedCalendar === "checkin" && checkout && day.diff(checkout) >= 0) nextDateIsCoherent = false
        else if(this.state.openedCalendar === "checkout" && checkin && day.diff(checkin) <= 0) nextDateIsCoherent = false
        else nextDateIsCoherent = !isDisabled && true

        const wrapperClassName = clsx({
            [this.props.classes.highlight]: isWithinRange,
            [this.props.classes.firstHighlight]: checkin && day.format("DD-MM-YYYY") === checkin.format("DD-MM-YYYY"),
            [this.props.classes.endHighlight]: checkout && day.format("DD-MM-YYYY") === checkout.format("DD-MM-YYYY"),
        })
      
        const dayClassName = clsx(this.props.classes.day, {
            [this.props.classes.alreadyBooked]: alreadyBooked,
            [this.props.classes.nonCurrentMonthDay]: !isInCurrentMonth,
            [this.props.classes.highlightNonCurrentMonthDay]: !isInCurrentMonth && isWithinRange,
        });
        

        return (
            <div 
                onMouseEnter={() => nextDateIsCoherent && this.setState({
                    [this.state.openedCalendar === "checkin" ? "checkinCalendarHoveredDay" : this.state.openedCalendar === "checkout" ? "checkoutCalendarHoveredDay" : ""] : day
                })}
                onMouseLeave={() => nextDateIsCoherent && this.setState({
                    [this.state.openedCalendar === "checkin" ? "checkinCalendarHoveredDay" : this.state.openedCalendar === "checkout" ? "checkoutCalendarHoveredDay" : ""]: null
                })}
                className={wrapperClassName}
            >
                <IconButton disabled={isDisabled} className={dayClassName}>
                    <span>{day.format("DD")}</span>
                </IconButton>
            </div>
        )

        return dayComponent
    }

    onChange = key => date => {

        console.log("in the onChange()")

        const today = moment()

        // conditions
        const isInCurrentMonth = date.month() === today.month()
        const isInFuture = today.diff(date) < 0
        const isAlreadyBooked = this.isAlreadyBooked(date)


        let nextDateIsCoherent = false

        if(this.state.openedCalendar === "checkin" && this.props.checkout && date.diff(this.props.checkout) >= 0) nextDateIsCoherent = false
        else if(this.state.openedCalendar === "checkout" && this.props.checkin && date.diff(this.props.checkin) <= 0) nextDateIsCoherent = false
        else nextDateIsCoherent = true

        if(isInCurrentMonth && isInFuture && nextDateIsCoherent && !isAlreadyBooked){
            this.props.handleDateChange(key)(date)
        }

    }

    render(){
        console.log("rendering")
        return (
            <React.Fragment>
                <DatePicker
                    // disableToolbar
                    variant="inline"
                    format="MM/DD/YYYY"
                    margin="normal"
                    label="Checkin"
                    value={this.props.checkin}
                    onChange={this.onChange("checkin")}
                    fullWidth
                    inputVariant="outlined"

                    onOpen={() => {this.setState({openedCalendar: "checkin"})}}

                    onMonthChange={this.props.onMonthOrYearChange}
                    onYearChange={this.props.onMonthOrYearChange}
                    renderDay={this.renderCalendarDay}
                    {...this.props.DatePickerProps}
                />
                <DatePicker
                    // disableToolbar
                    variant="inline"
                    format="MM/DD/YYYY"
                    margin="normal"
                    label="Checkout"
                    value={this.props.checkout}
                    onChange={this.onChange("checkout")}
                    fullWidth   
                    inputVariant="outlined"
                    
                    onOpen={() => this.setState({openedCalendar: "checkout"})}
                    
                    onMonthChange={this.props.onMonthOrYearChange}
                    onYearChange={this.props.onMonthOrYearChange}
                    renderDay={this.renderCalendarDay}
                    {...this.props.DatePickerProps}
                />
            </React.Fragment>
        )
    }

}

DateRangePicker.propTypes = {
    // checkin: PropTypes.instanceOf(moment).isRequired,
    // checkout: PropTypes.instanceOf(moment).isRequired,
}

export default withStyles(styles)(DateRangePicker)