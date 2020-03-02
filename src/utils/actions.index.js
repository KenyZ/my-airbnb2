
import params from './app.params'

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


export default {
    submitLoginAction
}