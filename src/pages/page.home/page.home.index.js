// Modules
import React from 'react'

// Components


// Assets
import './page.home.scss'

const PageHome = () => {
    return (
        <div className="page page-home">
            <h1>Welcome to my-airbnb</h1>
            <ul>
                <li><a href="/signin">signin</a></li>
                <li><a href="/housings">housings</a></li>
            </ul>
        </div>
    )
}

export default PageHome