import React from 'react';
import { LegalTabNavigation } from '../../../../components/LegalTabNavigation';
import { windowUndefined } from '../../../../../helpers/serverRenderingUtils';

import styles from '../../styles.sass';

function scrollToSection(e, id) {
  e.preventDefault();
  if (!windowUndefined()) {
    const el = document.getElementById(id);
    el.scrollIntoView();
  }
}

export function PrivacyPolicy({ pathname }) {
  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>
        <h1 className={styles.h1}>Anchor Privacy Policy</h1>
        <LegalTabNavigation pathname={pathname} />
        <p>Date of Last Revision: October 23, 2019</p>
        <ol>
          <li>
            <a
              href="#introduction"
              onClick={e => scrollToSection(e, 'introduction')}
            >
              Introduction
            </a>
          </li>
          <li>
            <a href="#about" onClick={e => scrollToSection(e, 'about')}>
              About this Policy
            </a>
          </li>
          <li>
            <a href="#rights" onClick={e => scrollToSection(e, 'rights')}>
              Your rights and your preferences: Giving you choice and control
            </a>
          </li>
          <li>
            <a href="#collect" onClick={e => scrollToSection(e, 'collect')}>
              Personal data we collect from you
            </a>
          </li>
          <li>
            <a href="#use" onClick={e => scrollToSection(e, 'use')}>
              What we use your personal data for
            </a>
          </li>
          <li>
            <a href="#share" onClick={e => scrollToSection(e, 'share')}>
              Sharing your personal data
            </a>
          </li>
          <li>
            <a href="#retention" onClick={e => scrollToSection(e, 'retention')}>
              Data retention and deletion
            </a>
          </li>
          <li>
            <a href="#cookies" onClick={e => scrollToSection(e, 'cookies')}>
              Cookies
            </a>
          </li>
          <li>
            <a href="#transfer" onClick={e => scrollToSection(e, 'transfer')}>
              Transfer to other countries
            </a>
          </li>
          <li>
            <a href="#links" onClick={e => scrollToSection(e, 'links')}>
              Links
            </a>
          </li>
          <li>
            <a href="#safe" onClick={e => scrollToSection(e, 'safe')}>
              Keeping your personal data safe
            </a>
          </li>
          <li>
            <a href="#children" onClick={e => scrollToSection(e, 'children')}>
              Children
            </a>
          </li>
          <li>
            <a href="#changes" onClick={e => scrollToSection(e, 'changes')}>
              Changes to this Policy
            </a>
          </li>
          <li>
            <a href="#contact" onClick={e => scrollToSection(e, 'contact')}>
              How to contact us
            </a>
          </li>
        </ol>
        <section id="introduction">
          <h2>1. Introduction</h2>
          <p>
            Thanks for choosing Anchor, a service offered by Spotify ({`"`}
            <strong>Anchor</strong>
            {`"`}, {`"`}
            <strong>we</strong>
            {`"`}, {`"`}
            <strong>our</strong>
            {`"`}, {`"`}
            <strong>us</strong>
            {`"`}), which allows creators the opportunity to create, share and
            monetize podcasts.
          </p>
          <p>
            We want to give you the best possible experience to ensure that you
            enjoy our service today, tomorrow and in the future. Your privacy
            and the security of your personal data is, and will always be,
            enormously important to us. So, we want to transparently explain how
            and why we gather, store, share and use your personal data - as well
            as outline the controls and choices you have around when and how you
            share your personal data. That is our objective, and this Privacy
            Policy (the
            {` `}
            {`"`}
            <strong>Policy</strong>
            {`"`}) will explain what we mean in further detail below.
          </p>
        </section>
        <section id="about">
          <h2>2. About this Policy</h2>
          <p>
            This Policy sets out the essential details relating to your personal
            data relationship with us when you use the Anchor website, mobile
            applications, and any other products and services that link to this
            Policy (collectively, the {`"`}
            <strong>Services</strong>
            {`"`}).
          </p>
          <p>
            From time to time, we may develop new or offer additional services.
            If the introduction of these new or additional services results in
            any change to the way we collect or process your personal data we
            will provide you with more information and additional terms or
            policies. Unless stated otherwise when we introduce these new or
            additional services, they will be subject to this Policy.
          </p>
        </section>
        <section id="rights">
          <h2>
            3. Your rights and your preferences: Giving you choice and control
          </h2>
          <p>
            The General Data Protection Regulation or "GDPR" gives certain
            rights to individuals in relation to their personal data. As
            available and except as limited under applicable law, the rights
            afforded to individuals are:
          </p>
          <ul>
            <li>
              <strong>Right of access</strong> - the right to be informed of and
              request access to the personal data we process about you;
            </li>
            <li>
              <strong>Right to rectification</strong> - the right to request
              that we amend or update your personal data where it is inaccurate
              or incomplete;
            </li>
            <li>
              <strong>Right to erasure</strong> - the right to request that we
              delete your personal data;
            </li>
            <li>
              <strong>Right to restrict processing</strong> - the right to
              request that we temporarily or permanently stop processing all or
              some of your personal data;
            </li>
            <li>
              <strong>Right to data portability</strong> - the right to request
              a copy of your personal data in electronic format and the right to
              transmit that personal data for use in another party’s service;
              and
            </li>
            <li>
              <strong>Right to object</strong> -
              <ul>
                <li>
                  the right, at any time, to object to us processing your
                  personal data on grounds relating to your particular
                  situation;
                </li>
                <li>
                  the right to object to your personal data being processed for
                  direct marketing purposes;
                </li>
              </ul>
            </li>
            <li>
              <strong>Right to withdraw consent</strong> - If we rely on your
              consent to process your personal data, you have the right to
              withdraw that consent at any time. Withdrawal of consent will not
              affect any processing of your data before we received notice that
              you wished to withdraw consent.
            </li>
            <li>
              <strong>
                Right not to be subject to Automated Decision-making
              </strong>{' '}
              - the right to not be subject to a decision based solely on
              automated decision making, including profiling, where the decision
              would have a legal effect on you or produce a similarly
              significant effect.
            </li>
          </ul>
          <p>
            In addition to the rights above, you always have the following
            choices regarding promotional communications and notifications:
          </p>
          <ul>
            <li>
              <strong>Promotional Communications</strong> - you may opt out of
              receiving promotional communications from us by following the
              instructions in those messages or by contacting us at any time. If
              you opt out from promotional communications, we may still send you
              non-promotional emails, such as those about your account or our
              ongoing business relations.
            </li>
            <li>
              <strong>Mobile Push Notifications/Alerts</strong> - with your
              consent, we may send promotional and non-promotional push
              notifications or alerts to your mobile device. You can deactivate
              these messages at any time by changing the notification settings
              on your mobile device.
            </li>
          </ul>
          <p>
            If you have any questions about your privacy, your rights, or how to
            exercise them, please see the “How to contact us” section below for
            information on how to contact us. If you have concerns around our
            processing of your personal data, we hope you will continue to work
            with us to resolve them. However, you can also contact and have the
            right to lodge a complaint with the Swedish Data Protection
            Authority (Datainspektionen) or your local Data Protection
            Authority.
          </p>
        </section>
        <section id="collect">
          <h2>4. Personal data we collect from you</h2>
          <h3>Personal data you provide to us</h3>
          <p>We collect personal data that you provide to us:</p>
          <table className={styles.twoColTable} border="1">
            <thead>
              <tr>
                <th>Categories of personal data</th>
                <th>Description of category</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <strong>User Data</strong>
                </td>
                <td>
                  If you are a creator, you will be required to provide certain
                  required personal data to create an account, such as your
                  name, email address, password, and address. You also have the
                  option to provide us other information about yourself, such as
                  a profile photo, biography, country information, and website.
                </td>
              </tr>
              <tr>
                <td>
                  <strong>Payment and Purchase Data</strong>
                </td>
                <td>
                  If you are a listener and choose to support a creator, we
                  collect your name and email address. Our payment processor
                  collects your payment information.
                </td>
              </tr>
              <tr>
                <td>
                  <strong>Payment and Purchase Data</strong>
                </td>
                <td>
                  Contests, Surveys and Sweepstakes Data When you complete any
                  forms, submit a survey, or participate in a contest, we
                  collect the personal data you provide.
                </td>
              </tr>
            </tbody>
          </table>
          <h3>
            Personal data collected when you use the services (“Usage Data”)
          </h3>
          <p>
            When you use the Services, we collect certain data automatically.
            Usage Data includes:
          </p>
          <table className={styles.twoColTable} border="1">
            <thead>
              <tr>
                <th>Categories of personal data</th>
                <th>Description of category</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <strong>User content</strong>
                </td>
                <td>
                  When you create and share content using our Services, we
                  collect any personal data included in that content.
                </td>
              </tr>
              <tr>
                <td>
                  <strong>Log data</strong>
                </td>
                <td>
                  Information that your browser automatically sends whenever you
                  use the Services. Log Data includes your Internet Protocol (“
                  <strong>IP</strong>”) address, browser type and settings, the
                  date and time of your request, and how you interacted with the
                  Services.
                </td>
              </tr>
              <tr>
                <td>
                  <strong>Cookies</strong>
                </td>
                <td>
                  Information from cookies stored on your device. Please see our
                  Cookie Policy to learn more about how we use cookies.
                </td>
              </tr>
              <tr>
                <td>
                  <strong>Device information</strong>
                </td>
                <td>
                  Includes type of device you are using, operating system,
                  settings, unique device identifiers, network information and
                  other device-specific information. Information collected may
                  depend on the type of device you use and its settings.
                </td>
              </tr>
              <tr>
                <td>
                  <strong>Other usage information</strong>
                </td>
                <td>
                  We collect information about how you use our Services and
                  Spotify’s other services, such as the types of content that
                  you post or listen to, the features you use, the actions you
                  take, the other Users you interact with and the time,
                  frequency and duration of your activities.
                </td>
              </tr>
            </tbody>
          </table>
          <h3>Personal data collected from other sources</h3>
          <table className={styles.twoColTable} border="1">
            <thead>
              <tr>
                <th>Categories of personal data</th>
                <th>Description of category</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <strong>Data from Social Media Services</strong>
                </td>
                <td>
                  If you create an account or log in to the Services using
                  credentials from social media services such as Facebook,
                  Google, or Twitter (“<strong>Social Media Services</strong>”),
                  we will have access to certain information from that Social
                  Media Service, such as your name and email address in
                  accordance with the authorization procedures determined by
                  such Social Media Service.
                </td>
              </tr>
            </tbody>
          </table>
        </section>
        <section id="use">
          <h2>5. What we use your personal data for</h2>
          <p>
            When you use or interact with the Services, we use a variety of
            technologies to process the personal data we collect about you for
            various reasons. We have set out in the table below the reasons why
            we process your personal data, the associated legal bases we rely
            upon to legally permit us to process your personal data, and the
            categories of personal data (identified in Section 4) used for these
            purposes:
          </p>

          <table className={styles.threeColTable} border="1">
            <thead>
              <tr>
                <th>
                  Description of why Anchor processes your personal data
                  ('processing purpose')
                </th>
                <th>Legal Basis for the processing purpose</th>
                <th>
                  Categories of personal data used by Anchor for the processing
                  purpose
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  To provide, personalize, and improve our Services, for
                  example, by allowing creators to create and distribute their
                  content and to allow listeners to support that content.
                </td>
                <td>
                  <ul>
                    <li>Performance of a Contract</li>
                    <li>Legitimate Interest</li>
                  </ul>
                </td>
                <td>
                  <ul>
                    <li>User Data</li>
                    <li>Usage Data</li>
                    <li>Payment and Purchase Data</li>
                  </ul>
                </td>
              </tr>
              <tr>
                <td>
                  To provide, personalize, and improve your experience with the
                  Services and other services and products provided by Spotify,
                  for example by providing customized, personalized, or
                  localized content, recommendations, features, and advertising.
                </td>
                <td>
                  <ul>
                    <li>Performance of a Contract</li>
                    <li>Legitimate Interest</li>
                  </ul>
                </td>
                <td>
                  <ul>
                    <li>User Data</li>
                    <li>Usage Data</li>
                    <li>Payment and Purchase Data</li>
                  </ul>
                </td>
              </tr>
              <tr>
                <td>
                  To understand how you access and use the Services to ensure
                  technical functionality of the Services, develop new products
                  and services, and analyze your use of the Services, including
                  your interaction with applications, advertising, products, and
                  services that are made available, linked to, or offered
                  through the Services.
                </td>
                <td>
                  <ul>
                    <li>Performance of a Contract</li>
                    <li>Legitimate Interest</li>
                  </ul>
                </td>
                <td>
                  <ul>
                    <li>User Data</li>
                    <li>Usage Data</li>
                  </ul>
                </td>
              </tr>
              <tr>
                <td>To communicate with you for Service-related purposes.</td>
                <td>
                  <ul>
                    <li>Performance of a Contract</li>
                    <li>Legitimate Interest</li>
                  </ul>
                </td>
                <td>
                  <ul>
                    <li>User Data</li>
                    <li>Usage Data</li>
                  </ul>
                </td>
              </tr>
              <tr>
                <td>
                  To process your payment to prevent or detect fraud including
                  fraudulent payments and fraudulent use of the Services.
                </td>
                <td>
                  <ul>
                    <li>Performance of a Contract</li>
                    <li>Compliance with legal obligations</li>
                    <li>Legitimate Interest</li>
                  </ul>
                </td>
                <td>
                  <ul>
                    <li>User Data</li>
                    <li>Usage Data</li>
                    <li>Payment and Purchase Data</li>
                  </ul>
                </td>
              </tr>
              <tr>
                <td>
                  To communicate with you, either directly or through one of our
                  partners, for marketing, research, participation in contests,
                  surveys and sweepstakes, promotional purposes, via emails,
                  notifications, or other messages, consistent with any
                  permissions you may have communicated to us.
                </td>
                <td>
                  <ul>
                    <li>Consent</li>
                    <li>Legitimate Interest</li>
                  </ul>
                </td>
                <td>
                  <ul>
                    <li>User Data</li>
                    <li>Contests, Surveys and Sweepstakes Data</li>
                  </ul>
                </td>
              </tr>
              <tr>
                <td>
                  To comply with legal obligations and legal process, respond to
                  requests from public and government authorities including
                  public and government authorities outside your country of
                  residence; enforce our Terms of Use; and to protect our
                  rights, privacy, safety or property of others.
                </td>
                <td>
                  <ul>
                    <li>Legitimate Interest</li>
                  </ul>
                </td>
                <td>
                  <ul>
                    <li>User Data</li>
                    <li>Usage Data</li>
                    <li>Device information</li>
                    <li>Payment and Purchase Data</li>
                  </ul>
                </td>
              </tr>
            </tbody>
          </table>
        </section>
        <section id="share">
          <h2>6. Sharing your personal data</h2>
          <p>
            We may share or disclose your personal data under the following
            circumstances, or as otherwise described in this Policy:
          </p>
          <ul>
            <li>
              <strong>With Your Consent or at Your Direction.</strong> The
              Services are designed to enable creators to broadly and instantly
              disseminate information to a wide range of listeners and services.
              When you share information or content via the Services, you should
              think carefully about what you are making public.
            </li>
            <li>
              <strong>Public Profile Information and Posts.</strong> Your public
              user profile information and public posts are immediately
              delivered via RSS feeds and our APIs to our partners and other
              third parties, including search engines, developers, and
              publishers that integrate the Services content into their
              services.
            </li>
            <li>
              <strong>Social Media Services.</strong> If you elect to access and
              use Social Media Services, you will be sharing your information
              (which could include personal data) with those Social Media
              Services and others on the Social Media Services platform.
            </li>
            <li>
              <strong>Vendors and Service Providers.</strong> To assist us in
              meeting business operations needs and to perform certain services
              and functions: providers of hosting, email communication and
              customer support services, analytics, marketing, advertising (for
              more details on the third parties that place cookies through the
              Services, please see our Cookie Policy). Pursuant to our
              instructions, these parties will access, process or store personal
              data in the course of performing their duties to us.
            </li>
            <li>
              <strong>Within the Spotify Group of Companies.</strong> We will
              share your personal data with other companies in the Spotify Group
              to carry out our daily business operations and to enable us to
              maintain and provide the Services to you.
            </li>
            <li>
              <strong>Business Transfers.</strong> If we are involved in a
              merger, acquisition, financing due diligence, reorganization,
              bankruptcy, receivership, sale of all or a portion of our assets,
              or transition of service to another provider, your personal data
              and other information may be transferred to a successor or
              affiliate as part of that transaction along with other assets.
            </li>
            <li>
              <strong>Legal Requirements.</strong> We will share your personal
              data when we in good faith believe it is necessary for us to do so
              in order to comply with a legal obligation under applicable law,
              or respond to valid legal process, such as a search warrant, a
              court order, or a subpoena. We also will also share your personal
              data where we in good faith believe that it is necessary for the
              purpose of our own, or a third party’s legitimate interest
              relating to national security, law enforcement, litigation,
              criminal investigation, protecting the safety of any person, or to
              prevent death or imminent bodily harm, provided that we deem that
              such interest is not overridden by your interests or fundamental
              rights and freedoms requiring the protection of your personal
              data.
            </li>
          </ul>
          <p>
            We also share personal data with partners that provide analytics
            services and serve advertisements on our behalf across the web and
            in mobile applications. These entities may use cookies, web beacons,
            device identifiers and other technologies to collect information
            about your use of the Services and other websites and applications,
            including your IP address, web browser, mobile network information,
            pages viewed, time spent on pages or in apps, links clicked, and
            conversion information. This information may be used by us and
            others to, among other things, analyze and track data, determine the
            popularity of certain content, deliver advertising and content
            targeted to your interests on our Services and other websites, and
            better understand your online activity. For more information about
            interest-based ads, or to opt out of having your web browsing
            information used for behavioral advertising purposes, please visit
            {` `}
            <a
              target="_blank"
              rel="noopener noreferrer"
              href="http://www.aboutads.info/choices"
            >
              www.aboutads.info/choices
            </a>
            . Your device may also include a feature (“Limit Ad Tracking” on iOS
            or “Opt Out of Interest-Based Ads” or “Opt Out of Ads
            Personalization” on Android) that allows you to opt out of having
            certain information collected through apps used for behavioral
            advertising purposes.
          </p>
        </section>
        <section id="retention">
          <h2>7. Data retention and deletion</h2>
          <p>
            We keep your personal data only as long as necessary to provide you
            with the Services and for legitimate and essential business
            purposes, such as maintaining the performance of the Services,
            making data-driven business decisions about new features and
            offerings, complying with our legal obligations, and resolving
            disputes. We keep some of your personal data, such as your user data
            and user content, for as long as you are a user of the Services.
          </p>
          <p>
            If you have elected to receive marketing communications from us, we
            retain information required to send these communications until you
            opt out of receiving these communications in accordance with our
            policies.
          </p>
        </section>
        <section id="cookies">
          <h2>8. Cookies</h2>
          <p>
            The Services use cookies to operate and administer the Services,
            gather usage data, and make it easier for you to use the Services
            during future visits.
          </p>
          <p>
            <strong>What Are Cookies?</strong> A “cookie” is a piece of
            information sent to your browser by a website you visit. By choosing
            to use our Services after having been notified of our use of cookies
            in the ways described in this Policy, and, in applicable
            jurisdictions, through notice and unambiguous acknowledgement of
            your consent, you agree to such use.
          </p>
          <p>
            Some cookies expire after a certain amount of time, or upon logging
            out (session cookies), others remain on your computer or terminal
            device for a longer period (persistent cookies). Our Services use
            first party cookies (cookies set directly by Spotify) as well as
            third party cookies, as described below. For more details on cookies
            please visit All About Cookies.
          </p>
          <p>
            <strong>Type of Cookies Used.</strong> The Services use the
            following technologies:
          </p>
          <ul>
            <li>
              <strong>Strictly Necessary Cookies</strong>: Used to provide Users
              with the Services and to use some of their features, such as the
              ability to log-in and access to secure areas. These cookies are
              served by Spotify and are essential for using and navigating the
              Services. Without these cookies, basic functions of our Services
              would not work. Because these cookies are strictly necessary to
              deliver the Services, you cannot refuse them.
            </li>
            <li>
              <strong>Analytics/Performance</strong>: Used to better understand
              the behavior of the Users on our Services and improve our Services
              accordingly, for example by making sure Users are finding what
              they need easily. The Site uses Google Analytics, a web analytics
              service provided by Google Inc. (“Google”). You can prevent your
              data from being collected by Google Analytics on our Services by
              downloading and installing the Google Analytics Opt-out Browser
              Add-on for your current web browser. For more information on
              Google Analytics privacy practices, read here.
            </li>
            <li>
              <strong>Your Choices</strong>. On most web browsers, you will find
              a “help” section on the toolbar. Please refer to this section for
              information on how to receive a notification when you are
              receiving a new cookie and how to turn cookies off. Please note
              that if you limit the ability of websites to set cookies, you may
              be unable to access certain parts of the Services and you may not
              be able to benefit from the full functionality of the Services. If
              you access the Services on your mobile device, you may not be able
              to control tracking technologies through the settings.
            </li>
          </ul>
        </section>
        <section id="transfer">
          <h2>9. Transfer to other countries</h2>
          <p>
            Spotify USA, Inc. is based in the United States and we process and
            store personal data in the United States and other countries.
            Therefore, we and our service providers may transfer your personal
            data to, or store or access it in, jurisdictions that may not
            provide equivalent levels of data protection as your home
            jurisdiction. We will take steps to ensure that your personal data
            receives an adequate level of protection in the jurisdictions in
            which we process it.
          </p>
          <p>
            If you are accessing our Services from the EU/EEA or other regions,
            please note that your personal data will be transmitted to our
            servers in the United States and the data may be transmitted to our
            service providers supporting our business operations (described
            above). In such instances we will ensure that the transfer of your
            personal data is carried out in accordance with applicable privacy
            laws and, in particular, that appropriate contractual, technical,
            and organizational measures are in place such as the Standard
            Contractual Clauses approved by the EU Commission.
          </p>
        </section>
        <section id="links">
          <h2>10. Links</h2>
          <p>
            Please note that this Policy only applies to the Services. When
            using the Services, you may find links to other websites not
            operated or controlled by us (“<strong>Third Party Sites</strong>”),
            including the Social Media Services. The information that you share
            with Third Party Sites will be governed by the specific privacy
            policies and terms of service of the Third Party Sites and not by
            this Policy. By providing these links we do not imply that we
            endorse or have reviewed these Third Party Sites. Please contact any
            Third Party Sites directly for information on their privacy
            practices and policies.
          </p>
        </section>
        <section id="safe">
          <h2>11. Keeping your personal data safe</h2>
          <p>
            We are committed to protecting our users’ personal data. We
            implement appropriate technical and organisational measures to help
            protect the security of your personal data; however, please note
            that no system is ever completely secure. We have implemented
            various policies including pseudonymisation, encryption, access, and
            retention policies to guard against unauthorised access and
            unnecessary retention of personal data in our systems.
          </p>
          <p>
            Your password protects your user account, so we encourage you to use
            a strong password that is unique to your Anchor account, never share
            your password with anyone, limit access to your computer and
            browser, and log out after having used the Services.
          </p>
        </section>
        <section id="children">
          <h2>12. Children</h2>
          <p>
            The Services are not directed to children under the age of 13 years.
            The Services are also not offered to children whose age makes it
            illegal to process their personal data or requires parental consent
            for the processing of their personal data under the GDPR or other
            local law.{' '}
          </p>
          <p>
            We do not knowingly collect personal data from children under 13
            years or under the applicable age limit (the “Age Limit”). If you
            are under the Age Limit, please do not use the Services, and do not
            provide any personal data to us.
          </p>
          <p>
            If you are a parent of a child under the Age Limit and become aware
            that your child has provided personal data to us, please contact us,
            and you may request exercise of your applicable rights detailed in
            the ‘Your rights and your preferences: Giving you choice and
            control’ Section 3 of this Policy.
          </p>
          <p>
            If we learn that we have collected the personal data of a child
            under the age of 13 years, we will take reasonable steps to delete
            the personal data. This may require us to delete the Anchor account
            for that child.
          </p>
        </section>
        <section id="changes">
          <h2>13. Changes to this Policy</h2>
          <p>
            We may change this Policy from time to time. If we make changes, we
            will notify you by revising the date at the top of the policy and,
            in case of material changes, we will provide you with additional
            notice (such as adding a statement to our homepage or sending you a
            notification). We encourage you to review the Policy whenever you
            access the Services or otherwise interact with us to stay informed
            about our information practices and the choices available to you.
          </p>
        </section>
        <section id="contact">
          <h2>14. How to contact us</h2>
          <p>
            Thank you for reading our Policy. If you have any questions about
            this Policy, please contact our Data Protection Officer by emailing{' '}
            <a href="mailto:privacy@spotify.com">privacy@spotify.com</a> or by
            writing to your relevant data controller at the address below.
          </p>
          <p>Data controller if you reside in the US:</p>
          <div className={styles.addressContainer}>
            <span className={styles.addressLine}>Spotify USA, Inc.</span>
            <span className={styles.addressLine}>150 Greenwich St</span>
            <span className={styles.addressLine}>New York, NY 10007</span>
            <span className={styles.addressLine}>USA</span>
          </div>

          <p>Data controller if you reside in any other country than the US:</p>
          <div className={styles.addressContainer}>
            <span className={styles.addressLine}>Spotify AB</span>
            <span className={styles.addressLine}>Regeringsgatan 19</span>
            <span className={styles.addressLine}>111 53 Stockholm</span>
            <span className={styles.addressLine}>Sweden</span>
          </div>
        </section>
      </div>
    </div>
  );
}
