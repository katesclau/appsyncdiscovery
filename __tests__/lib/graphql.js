const axios = require('axios')

const throwOnErrors = ({ query, variables, errors }) => {
  if(errors) {
    const errorMessage = `  
      query: ${query.substring(0, 100)},
      variables: ${JSON.stringify(variables, null, 2)},
      errors: ${JSON.stringify(errors, null, 2)}
    `
    console.log(errorMessage)
    throw new Error(errorMessage)
  }
}

module.exports = async (url, query, variables = {}, auth) => {
  const headers = {}
  if (auth) {
    headers.Authorization = auth
  }

  try {
    const resp = await axios({
      method: 'post',
      url,
      headers,
      data: {
        query,
        variables: JSON.stringify(variables)
      },
    })
    const { data: { data, errors } } = resp;
    throwOnErrors({ query, variables, errors })
    return data
  } catch (err) {
    const errors = err.response? err.response.data.errors : []
    throwOnErrors({ query, variables, errors })
    throw err
  }
}