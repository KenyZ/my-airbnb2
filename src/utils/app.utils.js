import params from "./app.params"


// basic fetcher
const fetcher = (route, parameters = {}) => {
    return fetch(params.API_DOMAIN + route, {
        ...parameters,
        headers: {
            ...parameters.headers,

            // send token if needAuth = true
            "Authorization": "Bearer " + localStorage.getItem(params.ACCESS_TOKEN_LS)
        }
    })
    .then(res => res.json())
}

// fetch json data
const jsonFetcher = (route, parameters) => {
    return fetcher(route, {
        headers: {
            "Content-Type": "application/json"
        },
        ...parameters,
    })
}

// fetch data by sending json body
const bodyFetcher = (route, body, method = "GET") => {
    return jsonFetcher(route, {
        method: method,
        body: JSON.stringify(body),
    })
}

// fetch data by sending urlencoded form
const formFetcher = (route, form) => {

    const urlencoded = new URLSearchParams()
  
    for(let key in form){
      urlencoded.append(key, form[key])
    }
    
    return fetcher(route, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: urlencoded.toString()
    })
}

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

    renderUserDisplayName: user => user.first_name + " " + user.last_name,

    isAuthenticated: () => Boolean(localStorage.getItem(params.ACCESS_TOKEN_LS)),


    request: {
        fetcher,
        jsonFetcher,
        bodyFetcher,
        formFetcher,
    },
    
}