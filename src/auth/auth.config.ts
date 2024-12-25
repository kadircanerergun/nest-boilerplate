export type AuthConfig = {
  provider: AUTH_PROVIDERS;
  firebaseOptions?: {
    serviceAccountPath: string;
  };
  cognitoOptions?: {
    region: string;
    userPoolId: string;
    clientId: string;
  };
};

export enum AUTH_PROVIDERS {
  FIREBASE = 'firebase',
  COGNITO = 'cognito',
}
