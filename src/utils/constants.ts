export const base_url = 'http://localhost:8080'
export const second_url = 'http://localhost:8081'
// export const base_url = 'https://fa-il.fly.dev'
export const path_graphql_query = '/graphql?path=/query'

export const request_graphql_thrones =
    `{ thrones {
        id
        name
        country
        flagUrl
        props {
            years
            lastMonarch {
                reign {
                    id
                    title
                    country
                    start
                    end
                    coronation
                }
                monarch {
                    id
                    name
                    birth
                    death
                    url
                    gender
                    status
                }
            }
        }
        reignscount
        reigns {
            id
        }
    }
    }`

export const request_graphql_thronedetails =
    `{ throne(country:"_COUNTRY_") {
        id
        name
        country
        allrulers {
            reign { 
                id
                title
                start
                end
                coronation
            }
            monarch {
                id
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
    `{ monarch(id:_ID_) {
    id
    name
    url
    gender
    birth
    death
    status
    imageUrl
    imageCaption
    reigns {
        id
        title
        start
        end
        coronation
        country
         predecessor {
            monarch {
            id
            name
            url
            gender
            birth
            death
            status 
            }
            reign {
                id
                title
                start
                end
                coronation
                country
            }
        }
        successor {
            monarch {
                id
                name
                url
                gender
                birth
                death
                status 
            }
            reign {
                id
                title
                start
                end
                coronation
                country
            }
        }
    }
    father {
        id
        name
        url
        gender
        birth
        death
        status
        imageUrl
        imageCaption
        reigns {
            id
            title
            start
            end
            coronation
            country
        }
    }
    mother {
        id
        name
        url
        gender
        birth
        death
        status
        imageUrl
        imageCaption
        reigns {
            id
            title
            start
            end
            coronation
            country
        }
    }
    children {
        id
        name
        url
        gender
        birth
        death
        status
        imageUrl
        imageCaption
        reigns {
            id
            title
            start
            end
            coronation
            country
        }
    }
}
}`

export const request_graphql_sametimers = `{ sametimerulers(input:{id:"_ID_", from:"_FROM_", to: "_TO_"}) {
        id
        name
        url
        gender
        birth
        death
        reigns {
            id
            title
            country
            start
            end
            coronation
        }
    }
}
`
const request_graphql_simple_monarch_list_generic = `{ _QUERY_(id:"_ID_") {
    id
    name
    url
    gender
    birth
    death
    status
    imageUrl
    imageCaption
    reigns {
        id
        title
        start
        end
        coronation
        country
    }
}
}`

export const request_graphql_spouses = request_graphql_simple_monarch_list_generic
    .replace('_QUERY_', 'rel_spouses')

export const request_graphql_siblings = request_graphql_simple_monarch_list_generic
    .replace('_QUERY_', 'rel_siblings')

export const request_graphql_parent_siblings = request_graphql_simple_monarch_list_generic
    .replace('_QUERY_', 'rel_parent_siblings')

export const request_graphql_niblings = request_graphql_simple_monarch_list_generic
    .replace('_QUERY_', 'rel_niblings')

export const request_graphql_cousins = request_graphql_simple_monarch_list_generic
    .replace('_QUERY_', 'rel_cousins')