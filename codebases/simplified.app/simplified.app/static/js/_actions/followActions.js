import { FOLLOW_USER, UNFOLLOW_USER } from "./types";

export const followMe = (user) => {
  return {
    type: FOLLOW_USER,
    payload: user,
  };
};

export const unfollowMe = (user) => {
  return {
    type: UNFOLLOW_USER,
    payload: user,
  };
};
