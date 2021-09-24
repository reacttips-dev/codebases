import { BIRTHDATE_ERROR_MESSAGE } from 'client/user';

type Params = {
  birthdate: string;
  userId: number;
};

export const updateBirthdate = async (params: Params) => {
  try {
    const response = await fetch('/api/proxy/v3/users/updateBirthdate', {
      method: 'POST',
      credentials: 'same-origin',
      headers: new Headers({
        'Content-Type': 'application/json',
      }),
      body: JSON.stringify(params),
    });
    if (response.ok) {
      return response.status;
    }
    if (response.status === 422) {
      throw new Error(BIRTHDATE_ERROR_MESSAGE);
    }
    throw new Error(`${response.status} - ${response.statusText}`);
  } catch (err) {
    throw new Error(err.message);
  }
};
