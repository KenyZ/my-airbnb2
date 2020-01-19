import React, {
    useEffect,
    useState
} from 'react'

export default function widthWindowWidth(Component){
    return props => {

        const [windowWidth, setWindowWidth] = useState(window.innerWidth)

        const onWindomResize = event => {
            setWindowWidth(window.innerWidth)
        }
        
        const initComponent = () => {
            window.addEventListener("resize", onWindomResize)
            return () => window.removeEventListener("resize", onWindomResize)
        }
    
        useEffect(initComponent, [])

        return <Component {...props} windowWidth={windowWidth}/>
    }

}