export default {

    setClassnames: (defaultClassnames, conditionalClassnames) => {
        let className = defaultClassnames

        for(let key in conditionalClassnames){
            className += conditionalClassnames[key] === true ? (" " + key) : ""
        }
    
        return className
    },
    
    renderHousingTags: housing => {
        return [
            housing.info_guest + " guests",
            housing.info_bed + " beds",
            housing.info_kitchen && housing.info_kitchen + " kitchens",
            housing.info_wifi && "Wifi",
        ].filter(tag => tag)
        .join(" · ")
    },

    renderUserDisplayName: user => user.first_name + " " + user.last_name
    
}