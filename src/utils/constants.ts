export const base_url = 'http://localhost:8080'
export const second_url = 'http://localhost:8081'
// export const base_url = 'https://fa-il.fly.dev'
export const path_graphql_query = '/graphql?path=/query'

export const request_graphql_thrones =
    `{ thrones {
        uuid
        name
        country
        flagUrl
        props {
            years
            lastMonarch {
                reign {
                    uuid
                    title
                    country
                    start
                    end
                    coronation
                }
                monarch {
                    uuid
                    name
                    birth
                    death
                    url
                    gender
                    status
                    imageUrl
                    imageCaption
                }
            }
        }
        reignscount
        reigns {
            uuid
        }
    }
    }`

export const request_graphql_thronedetails =
    `{ throne(country:"_COUNTRY_") {
        uuid
        name
        country
        allrulers {
            reign { 
                uuid
                title
                start
                end
                coronation
            }
            monarch {
                uuid
                name
                birth
                death
                imageUrl
                imageCaption
            }
        }
    }
    }`

export const request_graphql_monarchdetails =
    `{ monarch(uuid:_ID_) {
    uuid
    name
    description
    url
    gender
    birth
    death
    status
    imageUrl
    imageCaption
    reigns {
        uuid
        title
        start
        end
        coronation
        country
         predecessor {
            monarch {
            uuid
            name
            url
            gender
            birth
            death
            status 
            }
            reign {
                uuid
                title
                start
                end
                coronation
                country
            }
        }
        successor {
            monarch {
                uuid
                name
                url
                gender
                birth
                death
                status 
            }
            reign {
                uuid
                title
                start
                end
                coronation
                country
            }
        }
    }
    father {
        uuid
        name
        url
        gender
        birth
        death
        status
        imageUrl
        imageCaption
        reigns {
            uuid
            title
            start
            end
            coronation
            country
        }
    }
    mother {
        uuid
        name
        url
        gender
        birth
        death
        status
        imageUrl
        imageCaption
        reigns {
            uuid
            title
            start
            end
            coronation
            country
        }
    }
    children {
        uuid
        name
        url
        gender
        birth
        death
        status
        imageUrl
        imageCaption
        reigns {
            uuid
            title
            start
            end
            coronation
            country
        }
    }
}
}`

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
const request_graphql_simple_monarch_list_generic = `{ _QUERY_(uuid:"_ID_") {
    uuid
    name
    url
    gender
    birth
    death
    status
    imageUrl
    imageCaption
    reigns {
        uuid
        title
        start
        end
        coronation
        country
    }
}
}`

export const request_graphql_spouses = request_graphql_simple_monarch_list_generic
    .replace('_QUERY_', 'spouses')

export const request_graphql_siblings = request_graphql_simple_monarch_list_generic
    .replace('_QUERY_', 'siblings')

export const request_graphql_parent_siblings = request_graphql_simple_monarch_list_generic
    .replace('_QUERY_', 'parent_siblings')

export const request_graphql_niblings = request_graphql_simple_monarch_list_generic
    .replace('_QUERY_', 'niblings')

export const request_graphql_cousins = request_graphql_simple_monarch_list_generic
    .replace('_QUERY_', 'cousins')

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