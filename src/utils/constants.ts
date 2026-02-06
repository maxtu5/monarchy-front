export const base_url = 'http://localhost:8080'
// export const base_url = 'https://tuiken.site/monarchy-api'
export const second_url = 'http://localhost:8081'
export const path_graphql_query = '/graphql?path=/query'


export const request_graphql_sametimers = `{ sametimerulers(input:{from:"_FROM_", to: "_TO_"}) {
        uuid
        name
        url
        gender
        birth
        death
        imageUrl
        imageCaption
        reigns {
            uuid
            title
            country
            start
            end
            coronation
        }
    }
}
`


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