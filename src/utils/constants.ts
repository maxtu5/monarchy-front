const isLocal = window.location.hostname === 'localhost';
export const base_url = isLocal
    ? 'http://localhost:8080'
    : 'https://tuiken.site/monarchy-api'
export const second_url = 'http://localhost:8081'
export const path_graphql_query = '/graphql?path=/query'

export const request_find_monarchs_byname = `
    { findmonarchs(search:"_SRCH_") {
        uuid
        name
        }
    }`

export const request_find_monarchs_byyear = `
    { findmonarchsyear(search:"_SRCH_") {
        uuid
        name
        }
    }`