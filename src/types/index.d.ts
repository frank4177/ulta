

export type PostMessageParamType = {
    apiKey?: string
    secretKey?: string
    otp?: number
    oauthSecret?: string
    oauthToken?: string 
    recipientID?: string
  }

  export type PostMessageParamArgType = {
    arg?: PostMessageParamType
  }

  export type getCredentialParamType = {
    token: string,
    otpConfirmationCode: string
  }

  export type getCredentialParamArgType = {
    arg?: getCredentialParamType
  }