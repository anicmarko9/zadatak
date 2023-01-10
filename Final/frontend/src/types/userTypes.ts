export type User = {
  id: number;
  name: string;
  bio?: string;
  email: string;
  photo: string;
  role: string;
};

export type InputData = {
  name?: string;
  email?: string;
  bio?: string;
  photo?: string;
  passwordCurrent?: string;
  password?: string;
  passwordConfirm?: string;
  cities?: string;
  country?: string;
};
