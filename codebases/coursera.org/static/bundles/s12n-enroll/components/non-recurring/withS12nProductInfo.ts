import { compose, withProps } from 'recompose';
import gql from 'graphql-tag';
import waitFor from 'js/lib/waitFor';
import waitForGraphQL from 'js/lib/waitForGraphQL';
import { tupleToStringKey } from 'js/lib/stringKeyTuple';

import Naptime from 'bundles/naptimejs';
import CoursesV1 from 'bundles/naptimejs/resources/courses.v1';
import OnDemandSpecializationsV1 from 'bundles/naptimejs/resources/onDemandSpecializations.v1';
// @ts-ignore TS7016 Untyped import http://go.dkandu.me/strict-ts-migration#TS7016
import PartnersV1 from 'bundles/naptimejs/resources/partners.v1';
import getS12nProductLabels from 'bundles/s12n-common/constants/s12nProductLabels';
import { PRODUCTS } from 'bundles/xdp/constants/index';

import type {
  S12nCoursesByIdQuery,
  S12nCoursesByIdQueryVariables,
} from 'bundles/s12n-enroll/components/non-recurring/__generated__/S12nCoursesByIdQuery';

import type { SDPPageQuery_XdpV1Resource_slug_elements_xdpMetadata_XdpV1_sdpMetadataMember_sdpMetadata_courses as Course } from 'bundles/xdp/components/__generated__/SDPPageQuery';

type PropsFromCaller = {
  s12nId: string;
  onSdp: boolean;
  courseIdOverride?: string;
};

type PropsFromProductNaptime = {
  s12n: OnDemandSpecializationsV1;
  course?: CoursesV1;
};

type PropsFromPartnerNaptime = {
  partner: PartnersV1;
};

type PropsFromCoursesGraphQL = {
  courses: Array<Course>;
};

export type PropsFromWithS12nProductInfo = {
  s12nName: string;
  productName: string;
  product: string;
  numOfCourses: number;
  partnerName: string;
  courseId: string;
} & PropsFromCoursesGraphQL;

const getS12nCoursesById = gql`
  query S12nCoursesByIdQuery($productId: String!) {
    XdpV1Resource {
      get(id: $productId) {
        id
        xdpMetadata {
          ... on XdpV1_sdpMetadataMember {
            sdpMetadata {
              id
              courses {
                id
                material {
                  weeks {
                    modules {
                      id
                      totalDuration
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
`;

export const withS12nProductInfo = <InputProps extends PropsFromCaller>() =>
  compose<PropsFromWithS12nProductInfo & InputProps, InputProps>(
    Naptime.createContainer<PropsFromProductNaptime, InputProps>(({ s12nId, courseIdOverride }) => {
      return {
        s12n: OnDemandSpecializationsV1.get(s12nId, {
          fields: ['name', 'productVariant', 'courseIds', 'partnerIds'],
        }),
        ...(courseIdOverride
          ? {
              course: CoursesV1.get(courseIdOverride, {
                fields: ['name'],
              }),
            }
          : {}),
      };
    }),
    waitFor<PropsFromProductNaptime>(({ s12n }) => !!s12n?.partnerIds?.length),
    Naptime.createContainer<PropsFromPartnerNaptime, PropsFromProductNaptime>(({ s12n }) => {
      return {
        partner: PartnersV1.get(s12n.partnerIds[0], {
          fields: ['name'],
        }),
      };
    }),
    waitForGraphQL<
      { s12nId: string },
      S12nCoursesByIdQuery,
      S12nCoursesByIdQueryVariables,
      { courses?: Array<Course> }
    >(getS12nCoursesById, {
      options: ({ s12nId }: { s12nId: string }) => ({
        variables: {
          productId: tupleToStringKey([PRODUCTS.specialization, s12nId]),
        },
      }),
      props: ({ data }) => {
        const s12nCourses = data?.XdpV1Resource?.get?.xdpMetadata?.sdpMetadata?.courses;

        // TS convert the courses variable into the format that is used in SDPQuery
        return { courses: s12nCourses as Array<Course> };
      },
    }),
    withProps<
      PropsFromWithS12nProductInfo,
      InputProps & PropsFromProductNaptime & PropsFromPartnerNaptime & PropsFromCoursesGraphQL
    >(({ s12n, course, partner, courses, courseIdOverride }) => {
      const { SPECIALIZATION_LABEL, PROFESSIONAL_CERTIFICATE_LABEL } = getS12nProductLabels();

      return {
        productName: course?.name ?? s12n.name,
        product: s12n.isProfessionalCertificate ? PROFESSIONAL_CERTIFICATE_LABEL : SPECIALIZATION_LABEL,
        s12nName: s12n.name,
        partnerName: partner.name,
        numOfCourses: s12n.courseIds?.length,
        courseId: courseIdOverride ?? s12n.courseIds?.[0],
        courses,
      };
    })
  );
