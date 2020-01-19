export default {

    setClassnames: (defaultClassnames, conditionalClassnames) => {
        let className = defaultClassnames

        for(let key in conditionalClassnames){
            className += conditionalClassnames[key] === true ? (" " + key) : ""
        }
    
        return className
    }
    
}