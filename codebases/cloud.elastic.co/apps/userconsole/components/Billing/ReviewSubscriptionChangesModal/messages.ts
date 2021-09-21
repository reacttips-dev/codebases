/*
 * ELASTICSEARCH CONFIDENTIAL
 * __________________
 *
 *  Copyright Elasticsearch B.V. All rights reserved.
 *
 * NOTICE:  All information contained herein is, and remains
 * the property of Elasticsearch B.V. and its suppliers, if any.
 * The intellectual and technical concepts contained herein
 * are proprietary to Elasticsearch B.V. and its suppliers and
 * may be covered by U.S. and Foreign Patents, patents in
 * process, and are protected by trade secret or copyright
 * law.  Dissemination of this information or reproduction of
 * this material is strictly forbidden unless prior written
 * permission is obtained from Elasticsearch B.V.
 */

import { defineMessages } from 'react-intl'

const messages = defineMessages({
  modalTitle: {
    id: `review-changes-modal.title`,
    defaultMessage: `Changes required`,
  },
  modalDescription: {
    id: `review-changes-modal.description`,
    defaultMessage: `You are using features not included with the {subscription} subscription. You can {upgradeToLevel} or remove these features from your deployments.`,
  },
  upgrade: {
    id: `review-changes-modal.description.upgrade`,
    defaultMessage: `upgrade to {upgradeLevel}`,
  },
  modalFooter: {
    id: `review-changes-modal.footer`,
    defaultMessage: `Got questions? {readTheDocs} or {askForHelp}`,
  },
  readTheDocs: {
    id: `review-changes-modal.footer.read-the-docs`,
    defaultMessage: `Read the docs`,
  },
  askForHelp: {
    id: `review-changes-modal.footer.ask-for-help`,
    defaultMessage: `Ask for help`,
  },
  defaultCallToAction: {
    id: `review-changes-modal.default-feature-action`,
    defaultMessage: `{link} if you have questions about how to remove this feature.`,
  },
  defaultCallToActionLink: {
    id: 'default-call-to-action.contact-support',
    defaultMessage: 'Contact support',
  },
  changes: {
    id: `review-changes-modal.changes`,
    defaultMessage: `{numberOfChanges} {numberOfChanges, plural, one {change} other {changes}}`,
  },
  ml: {
    id: `feature.ml`,
    defaultMessage: `Machine learning`,
  },
  mlFeatureDescription: {
    id: `feature.ml.description`,
    defaultMessage: `Edit your deployment to {link}.`,
  },
  mlLink: {
    id: `feature.ml.description.link`,
    defaultMessage: `disable Machine Learning`,
  },
  graph: {
    id: `feature.graph`,
    defaultMessage: `Graph analytics`,
  },
  graphFeatureDescription: {
    id: 'feature.graph.description',
    defaultMessage: `Disable the graph analytics feature in the {link} in Kibana or through the graph or _xpack/graph endpoints.`,
  },
  graphLink: {
    id: `feature.graph.description.link`,
    defaultMessage: `Graph settings`,
  },
  securityDlsFls: {
    id: `feature.fls`,
    defaultMessage: `Field level security`,
  },
  securityDlsFlsDescription: {
    id: `feature.fls.description`,
    defaultMessage: `Remove any user role configurations based on field access {link} or the Kibana Roles page.`,
  },
  securityDlsFlsDescriptionLink: {
    id: `feature.fls.description.link`,
    defaultMessage: `through the API`,
  },
  jdbc: {
    id: `feature.jdbc`,
    defaultMessage: `JDBC client`,
  },
  jdbcDescription: {
    id: 'feature.jdbc.description',
    defaultMessage: `Make sure that there are no Elasticsearch clients that use the SQL endpoint, including direct access to _sql, JDBC/ODBC/etc.`,
  },
  odbc: {
    id: `feature.odbc`,
    defaultMessage: `ODBC client`,
  },
  odbcDescription: {
    id: 'feature.odbc.description',
    defaultMessage: `Make sure that there are no Elasticsearch clients that use the SQL endpoint, including direct access to _sql, JDBC/ODBC/etc.`,
  },
  plugins: {
    id: `feature.plugins`,
    defaultMessage: `Custom plugins`,
  },
  pluginsDescription: {
    id: 'feature.plugins.description',
    defaultMessage: `Remove any uploaded custom plugins from the deployment.`,
  },
  pdf: {
    id: `feature.pdf`,
    defaultMessage: `PDF/PNG Reports`,
  },
  pdfDescription: {
    id: 'feature.pdf.description',
    defaultMessage: `Remove client access to the Kibana reporting API, or disable reporting from the Kibana UI.`,
  },
})

export const features = {
  default: {
    description: messages.defaultCallToAction,
    linkText: messages.defaultCallToActionLink,
  },
  machine_learning: {
    prettyName: messages.ml,
    description: messages.mlFeatureDescription,
    link: `machineLearningDocLink`,
    linkText: messages.mlLink,
  },
  graph: {
    prettyName: messages.graph,
    description: messages.graphFeatureDescription,
    link: `graphDocLink`,
    linkText: messages.graphLink,
  },
  security_dls_fls: {
    prettyName: messages.securityDlsFls,
    description: messages.securityDlsFlsDescription,
    link: `fieldSecurityDocLink`,
    linkText: messages.securityDlsFlsDescriptionLink,
  },
  jdbc: {
    prettyName: messages.jdbc,
    description: messages.jdbcDescription,
  },
  odbc: {
    prettyName: messages.odbc,
    description: messages.odbcDescription,
  },
  plugins: {
    prettyName: messages.plugins,
    description: messages.pluginsDescription,
  },
  reporting: {
    prettyName: messages.pdf,
    description: messages.pdfDescription,
  },
}

export default messages
