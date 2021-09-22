import { AuthorProfile, Contributor, CourseRole } from 'bundles/discussions/lib/types';

export function isString(input: unknown): input is string {
  return typeof input === 'string';
}

export function isAnswerId(id: unknown): boolean {
  if (typeof id === 'string') {
    return /^\w+-\w+-\w+$/.test(id);
  }
  return false;
}

export function isContributorProfile(profile: unknown): profile is AuthorProfile {
  if (profile && typeof profile === 'object') {
    if (typeof profile['userId'] === 'number') {
      return true;
    }
  }
  return false;
}

export function isCourseRole(role: unknown): role is CourseRole {
  if (typeof role === 'string') {
    if (role in CourseRole) {
      return true;
    }
  }
  return false;
}
