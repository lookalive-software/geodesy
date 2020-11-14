const endsWithDigits = /-\d+$/

module.exports = function paramparse(querystring = ""){
    let kv = query2kv(querystring)
    return {
        options: kv2options(kv),
        paramarray: kv2paramarray(kv)
    }
}

function query2kv(qs = ''){
    if(!qs) return {}
    else return qs
        .split('&')
        .map(param => param.split('='))
        .map(([key, val]) => ({
            [decodeURIComponent(key)]: decodeURIComponent(val)
        }))
        .reduce((a,b) => Object.assign(a,b))
}

function kv2options(query = {}){
    return Object.fromEntries(
        Object.entries(query).filter(([key]) => !endsWithDigits.test(key))
    )

}

/**
 * I iterate through all the object keynames and throw out anything that doesn't end with a digit
 * Then I use the digit as an index into the paramarray to store each p
 * 
 * 
 * @param {*} query 
 */
function kv2paramarray(query = {}){
    let paramarray = []
    // iterate through the keys of the query and sow all the parameters needed for each article
    Object.entries(query)
        .filter(([key]) => endsWithDigits.test(key)) // filter parameters that have a number at the end of their name
        .forEach(([key, value]) => {
            // the pattern properties of the form are suffixed with a number to indicate which geodesy they belong to
            // everything that comes before the dash is used as the name of that parameter, and the number is the index of paramarray to submit to
            let hyphenpos = key.lastIndexOf('-')
            let parameter = key.slice(0, hyphenpos)
            let index = key.slice(hyphenpos + 1)
            // its a little rubbish to be instantiating 3 whole variables inside of the loop
            // it would be just as well to overwrite them each time
            // but these loops are pretty small...
            // if the item at this location in the list already exists, assume its an object and 'merge' the new parameter.
            if(paramarray[index]){
                Object.assign(paramarray[index], {[parameter]: value})
                // paramarray[index][parameteer] = value // Test this first
            } else {
                // otherwise create a new object at that location
                paramarray[index] = {[parameter]: value}
            }
        })
    return paramarray
}