
import params from './app.params'
import utils from './app.utils'

const getResponse = async res => {
    
    let json = null

    try {
        json = await res.json()
    } catch (error) {
        throw new Error("hehe")
    }
    return json
}


/**
 * 
 * @param {object} formData 
 * @param {string} formData.email
 * @param {string} formData.password
 */
export function submitLoginAction(formData){
    return fetch(params.API_DOMAIN + "/auth/signin", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(formData)
    })
    .then(getResponse)
}

/**
 * 
 * @param {Number} page
 */
export function getHousingList(page = 0, onlyFavorites = false){

    let requestUrl = "/housing?offset=" + page

    // filter by favorite of user_id
    if(onlyFavorites){
        requestUrl = requestUrl + "&only_favorites=1"
    }

    console.log(requestUrl)
    return utils.request.jsonFetcher(requestUrl)

}


export default {
    submitLoginAction,
    getHousingList
}