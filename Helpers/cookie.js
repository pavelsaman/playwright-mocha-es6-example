
export default function getCookie (cookieArray, searchObj) {
    
    for (let cookie of cookieArray) {
        if (cookie[searchObj.searchFor] === searchObj.searchValue) {
            return true;
        }
    }

    return false;
}