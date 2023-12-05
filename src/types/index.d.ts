

export type PostMessageParamType = {
  apiKey?: string
  secretKey?: string
  otp?: string | WordArray
  oauthSecret?: string
  oauthToken?: string
  recipientID?: string
  accessToken?: string
}

export type PostMessageParamArgType = {
  arg?: PostMessageParamType
}

export type getCredentialParamType = {
  twitterData?: PostMessageParamType,
  otpConfirmationCode?: string | undefined
}

export type getCredentialParamArgType = {
  arg?: getCredentialParamType
}

export type userDataType = {
  screenName?: string
  displayName?: string
  photoUrl?: string
  userId?: string
  lastLogin?: string
  }