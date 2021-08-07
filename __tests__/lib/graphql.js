const axios = require('axios')

const throwOnErrors = ({ query, variables, errors }) => {

  if(errors) {
    const errorMessage = `  
      query: ${query.substring(0, 100)},
      variables: ${JSON.stringify(variables, null, 2)},
      errors: ${JSON.stringify(errors, null, 2)}
    `
    throw new Error(errorMessage)
  }
}

module.exports = async (url, query, variables = {}, auth) => {
  const headers = {}
  if (auth) {
    headers.Authorization = auth
  }

  try {
    const resp = await http({
      method: 'post',
      url,
      headers,
      data: {
        query,
        variables: JSON.stringify(variables)
      },
    })
    const { data, errors } = resp;
    throwOnErrors({ query, variables, errors })
    return data
  } catch (err) {
    const errors = err.response? err.response.data.errors : []
    throwOnErrors({ query, variables, errors })
    throw err
  }
}