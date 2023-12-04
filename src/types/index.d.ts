

export type PostMessageParamType = {
    apiKey?: string
    secretKey?: string
    otp?: number
    oauthSecret?: string
    oauthToken?: string 
    recipientID?: string
    accessToken?: string
  }

  export type PostMessageParamArgType = {
    arg?: PostMessageParamType
  }

  export type getCredentialParamType = {
    twitterData: PostMessageParamType,
    otpConfirmationCode: string
  }

  export type getCredentialParamArgType = {
    arg?: getCredentialParamType
  }