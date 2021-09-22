import * as React from 'react';
import _t from 'i18n!nls/page';
import { isUserRightToLeft } from 'js/lib/language';
import a11yKeyPress from 'js/lib/a11yKeyPress';
import { getShouldLoadRaven } from 'js/lib/sentry';
import type { ErrorInfo } from 'react';
import raven from 'raven-js';
import { ErrorPage } from 'bundles/page/components/ErrorBoundaryWithLogging';
import epic from 'bundles/epic/client';
import type UserAgentInfo from 'js/lib/useragent';
import ApplicationStoreClass from 'bundles/ssr/stores/ApplicationStore';
import connectToStores from 'js/lib/connectToStores';

const DismissKey = 'IE.dismissedAt';
const DismissDuration = 1000 * 60 * 60 * 8 - 1000 * 60; // 7h59m

const fontFamily = '"Source Sans Pro", OpenSans, Arial, sans-serif';

const InlineStyles = {
  Container: {
    position: 'fixed' as const,
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: '#F3F8FF',
    borderBottom: '1px solid #929599',
    padding: '16px 48px',
    zIndex: 999999, // above everything.
  },
  Heading: {
    fontFamily,
    fontWeight: 600,
    fontSize: 20,
    lineHeight: '28px',
    color: '#1F1F1F',
    margin: '16px 0',
  },
  Paragraph: {
    fontFamily,
    fontWeight: 400,
    fontSize: 16,
    lineHeight: '24px',
    color: '#1F1F1F',
    margin: '16px 0',
  },
  List: {
    fontFamily,
    fontWeight: 400,
    fontSize: 16,
    lineHeight: '24px',
    color: '#1F1F1F',
    listStyle: 'none',
    margin: '16px 0',
    padding: 0,
  },
  ListItem: {
    display: 'inline-block' as const,
    marginRight: 16,
  },
  ListItemRTL: {
    display: 'inline-block' as const,
    marginLeft: 16,
  },
  Link: {
    color: '#0056D2',
    textDecoration: 'underline' as const,
  },
  Icon: {
    marginRight: 4,
    verticalAlign: 'text-bottom' as const,
  },
  IconRTL: {
    marginLeft: 4,
    verticalAlign: 'text-bottom' as const,
  },
  Dismiss: {
    fontFamily,
    fontWeight: 700,
    fontSize: 14,
    lineHeight: '20px',
    color: '#0056D2',
    position: 'absolute' as const,
    top: 36,
    right: 48,
  },
  DismissRTL: {
    fontFamily,
    fontWeight: 700,
    fontSize: 14,
    lineHeight: '20px',
    color: '#0056D2',
    position: 'absolute' as const,
    top: 36,
    left: 48,
  },
};

type PropsFromCaller = {
  children?: JSX.Element | null;
};

type PropsForGuard = PropsFromCaller & {
  Component: typeof InternetExplorerBannerWithDismiss | typeof InternetExplorerBannerWithErrorBoundary;
};

type PropsFromConnectToStores = {
  userAgent: UserAgentInfo;
};

type PropsFromDismiss = {
  onDismiss?: () => void;
};

type StateForDismiss = {
  isMounted: boolean;
  isDismissed: boolean;
};

type StateForErrorBoundary = {
  hasError: boolean;
};

export const InternetExplorerBanner = ({ onDismiss }: PropsFromDismiss) => {
  return (
    <div
      role="dialog"
      aria-modal="false"
      aria-labelledby="InternetExplorerBanner-Heading"
      aria-describedby="InternetExplorerBanner-Description"
      style={InlineStyles.Container}
    >
      <h1 id="InternetExplorerBanner-Heading" style={InlineStyles.Heading}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 22"
          width="24"
          height="24"
          role="presentation"
          style={isUserRightToLeft() ? InlineStyles.IconRTL : InlineStyles.Icon}
          fill="currentColor"
        >
          <path d="M22.8698 20L12.8098 1C12.7361 0.847837 12.6211 0.719509 12.4778 0.629717C12.3346 0.539926 12.1689 0.492302 11.9998 0.492302C11.8308 0.492302 11.6651 0.539926 11.5219 0.629717C11.3786 0.719509 11.2635 0.847837 11.1898 1L1.12984 20C1.03423 20.1488 0.979809 20.3204 0.972133 20.4971C0.964457 20.6738 1.0038 20.8494 1.08615 21.006C1.1685 21.1626 1.2909 21.2945 1.44088 21.3883C1.59085 21.4821 1.76303 21.5345 1.93984 21.54H22.0598C22.2367 21.5345 22.4088 21.4821 22.5588 21.3883C22.7088 21.2945 22.8312 21.1626 22.9135 21.006C22.9959 20.8494 23.0352 20.6738 23.0275 20.4971C23.0199 20.3204 22.9655 20.1488 22.8698 20ZM10.9998 5.5H12.9998V14.5H10.9998V5.5ZM11.9998 19.5C11.7032 19.5 11.4132 19.412 11.1665 19.2472C10.9198 19.0824 10.7276 18.8481 10.614 18.574C10.5005 18.2999 10.4708 17.9983 10.5287 17.7074C10.5865 17.4164 10.7294 17.1491 10.9392 16.9393C11.149 16.7296 11.4162 16.5867 11.7072 16.5288C11.9982 16.4709 12.2998 16.5007 12.5739 16.6142C12.848 16.7277 13.0822 16.92 13.247 17.1666C13.4119 17.4133 13.4998 17.7033 13.4998 18C13.4998 18.3978 13.3418 18.7794 13.0605 19.0607C12.7792 19.342 12.3977 19.5 11.9998 19.5Z" />
        </svg>
        {_t('Browser not supported')}
      </h1>
      {onDismiss && (
        <div
          role="button"
          tabIndex={0}
          onClick={onDismiss}
          onKeyDown={(event) => a11yKeyPress(event, onDismiss)}
          aria-label={_t('Dismiss browser not supported warning')}
          style={isUserRightToLeft() ? InlineStyles.DismissRTL : InlineStyles.Dismiss}
        >
          {_t('Dismiss')}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 16 16"
            width="16"
            height="16"
            role="presentation"
            style={isUserRightToLeft() ? InlineStyles.Icon : InlineStyles.IconRTL}
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M13.5855 14.3527L1.64551 2.35266L2.35438 1.64733L14.2944 13.6473L13.5855 14.3527Z"
            />
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M14.3436 2.3534L2.35365 14.3534L1.64625 13.6466L13.6362 1.64659L14.3436 2.3534Z"
            />
          </svg>
        </div>
      )}
      <p id="InternetExplorerBanner-Description" style={InlineStyles.Paragraph}>
        {_t(
          'Sorry, you’re using a browser that is no longer supported. You might be unable to access content on this or any other page.'
        )}
      </p>
      <p style={InlineStyles.Paragraph}>{_t('We recommend one of the following options to access Coursera:')}</p>
      <ul style={InlineStyles.List}>
        <li style={isUserRightToLeft() ? InlineStyles.ListItemRTL : InlineStyles.ListItem}>
          <a href="https://www.google.com/chrome/" target="_blank" rel="noopener noreferrer" style={InlineStyles.Link}>
            <img
              src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAMAAABg3Am1AAABGlBMVEVHcEyscEX6yD/q2tbqqUXaUkcPm1fcSz4YlVj7yD7kgU0Ql1TsqjAcn13+zD8SllUTlVURmVf4xj/eVUnfWk3eTkP1wkBitIoPm1jxwD31tDIRmVbdW1D7yD/u16Tiny7cmy7dT0LdUEb4xD/it20YiU7vvz3OTENMi1fHPzHj0o7nxEr/zUDbRDcPnVhChfTx8fHUQTT+xzz9wTjKOyzPPS+5NigOkE/8vDUQiEzXQTQPmFTEOCnmqDL8zkh0pfOkwfJPjfTr7fK5zvKNtPN6qPPwsTSpOirw6Ncyi07t377S5dvkv7yLTzLo7PGz1sHYeXD10HRPdkeMqVHpyU/A3c/dpZ+zt03TwU5YmkxrYz6VzLKZi3Cs//+dYHjoAAAAXnRSTlMABtL9GHTz9RzzIdbz//xyW5OSk13QWPv7bPLCLLj+9PXdvXX8+YU1muLi7f////////////////////////////////////////////////////////////////8G2cuUcgAAAoRJREFUSMeVlnljmkAQxRFFRFsPvGuM5uwFuBrFqmnjjVeisTVpk37/z9FdLncAMX1/v59vZnbWhWGcimbS52c81tl5OhNljijEZWWgLBfysUfTvOwSnz4UE+A87AYS8PKfZOWDyp64/Rle9hGfcfq5elf2Fefwt+r/RXDNVqvePUJQVX1sNnXCH+DtzgOfbwlxtKisNd1P2q0Z8bY2IuGt6oro1j3EG2eeUpR7QuwjNk+rYHBxelmtViuVyjtDH7BEI0BR5poVgYlNEOkaotnld0PT6fQbkUA2MaFgvWhGBC5qha2j8WQyHg0RWhh23X2DdYGBEgF6mlmUjH++P6jpGvQRmu3NRCyuSNGBraoT9RV6uKvZuntAC9t808AKMUnF0D0hWhuEKD8mEHq0zUQ5MiM9Yq5iohVE/RpQH80atiRJEo0WzAh1g4YDCAyG6FH3EjdWmYlZwFxT1Sc0qjk0QqemVxfLhC1AeVHVFRo7gTFaUH5JYAo28F5Tg2jiBCZoRgNxClC2bwL2JeG+j5YUF/ZNk769m5ZA0yUKUP56jpUGytbBmX17HdwPGhDt1dBVyLtX4wvtl3Lm8tkRa+fyrUFAHF+IGCSWcL13vyTYs3mBQAZ1gdY/gV8qmlcUEPklMrXMd0BBkn5F4ZwM5HW3XO5e81edZxggMoxHhKV2pzP3CnB1YaqHgd8w4ML6q4wdCPgDA1j7IfIqigTAkQrUW5csuPwYgCON5+gHIuEVAM+4CJ8gRwYJePbzYyIMA9pgpELO/YxGYsBPjzTOer7tgUSYAqiRCteBA98CkVTYDrBHKoh+XxuRRKlHOm6bI22wxdCxD5pIMlWKXX0VBLYs5tzuf/LsTPW7ML9fAAAAAElFTkSuQmCC"
              width="24"
              height="24"
              alt=""
              style={isUserRightToLeft() ? InlineStyles.IconRTL : InlineStyles.Icon}
            />
            Google Chrome
          </a>
        </li>
        <li style={isUserRightToLeft() ? InlineStyles.ListItemRTL : InlineStyles.ListItem}>
          <a href="https://www.microsoft.com/edge" target="_blank" rel="noopener noreferrer" style={InlineStyles.Link}>
            <img
              src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAMAAABg3Am1AAABSlBMVEVHcEwQX6ErtMMNTZATfLlR3XYCedMbgZ83yVdS3W87zXQ+z2wWfrADeM8NUJUOTY8LhNAxwekOSowNTpFG02gtxL0vwtksvd80x1gMVp8PTI8/zloAd9Qzwe0sv90EeM4NU5sBeNQ9z5VB0XIotrQAedU5y4MOT5U0we0ms7UhoLErw8gvwt8amccBe9UNUpoMVZ40we4OTZAEfdYNUJYFgNcNT5MMidowwuQPjd1S3n8rw80Sfbosw9kvwd9a5HUJhdlE1JQLSoksw9UuwtwsxcUyweoxx7wUg8EHg9gSkd1H1owRidI/0Z01x2Yzx30Qhclg6HAIdL80yrEAedU6zqQrw9M/z21E1HlC0V1N2oZJ1mktxbYJeshE1IQ5zIw0yZUNdrU6zqozxnI1yqkgl8QIYaoGargwxpwxxYovxaYloc4nssUQX2ZDSHHpAAAAbnRSTlMARSAuE/zyBf7+QJn9w3lilXDwmLPlVvbOrsjhbfWT2e5OfWuoXtvT0WL+v83k////////////////////////////////////////////////////////////////////////////////////RQ8YrUMAAAOnSURBVEjHhZbpX9pMFIUDBAKyCoL7Wu3eJAQMApG0aQ2KVAtaAdlroUXb//9r78xkkhF4eQ/w4wPnybl35k4Cx03Lndp5lyyeFZPJd4dvlgRusfjl919OTz9/vrsrFs/Ozsqd5GFqAePeWS2VSl8IUkRIudO5SR7w8+3C8uoJiEUQcfPz+9eDeSnu16ZpzhIY+PRyacaf2k6bpo0QAlVVxsDl5Ysp/3IaaYq4w8APAIAIzvHbBKqKFGUD9wWWSKXTNnHyLAIBX6Gk+/tC4cDpd5sBzDnAJQQUCjrtXHjN+p8D5fKNVVFB173CswbMp9Ho/Px89FRieiiXUQskQNeDTkHmkzYcDrVhSINPaHTKVGQBul6r6W4E7Jhpc4TcmnaOBN8aIOwiUaC2guZt2yxpwzpyf8MiTOgP3QZo4Z4COnSxfLI6rNe1LlirRIhBBJ4lpmcAarDh75Ef7NWLXK5SqcIbMYCE/qDZ++kApCb3qob81WouX8nnK0Q4RQuVYbrJJFmrVNO9XOoD+DPVXC6fy+cpEXPxvCumve2gWR18uuz1CgWvFwg9wO0gP1SDZGVoUbI/rlDn5vH7wAJ0rx4AcTHk//iRADhE9tCR8bx9fPw96Pd7vV4TEgI6vLhwVzwGwCLylZyacM7g4eNvBPR7zWYTAJywKx4fX1zYGXnJcDlT/Ab8A+JvBrztQDuwyXUzxywxNgzmyPODwWTS7zex2ghY4XwIsImuYSjMgRcmk8k1qNloNNpYSwCwhGQoqscBlq6vAWhcXzUbbUS0NjluN8MQEKBmmR6C6PIPD40GvFtIcITCGYYYQ4CUYAIeQFdI2N5C5yGWYQjVUCV5jzYhvLTcV36kVmsF/bIvOoSIAmQ5QhPWWLvfH8RX4m8dom4oWVmW9+jCuleIGWuN3gLCok38QhWBNuyVdb8Irm36/ZtrQedeeSSKBHEAed1ug5u9DQs+SmTqFJDWFz1IYiIluhSQpVeeBU8dHyVEG5AlKTL9GBFcNHbrlhIyXiXsByU8TGGeSNyIUjRMiV8KbQKUlbJ765Goy+NxRROvFMVgFs9nESILAAJSVUVVkIw409b+rUWMLcJKIAC2K8ZftqEjixBVNTuTQIjo8yXYsoi6gomZBCU6vbj7Vh+k7+mE+N/ZDXeHSQgQWWkqYWPuNgpbJKSu2ggB4pH/GhQ+hje9O1YAyVoJ8QS/6M/JFt5E3zhLWlU2Ijz3f39ojmLhXV/GtxuGbZ51/wMBgHIIKpI9AQAAAABJRU5ErkJggg=="
              width="24"
              height="24"
              alt=""
              style={isUserRightToLeft() ? InlineStyles.IconRTL : InlineStyles.Icon}
            />
            Microsoft Edge
          </a>
        </li>
        <li style={isUserRightToLeft() ? InlineStyles.ListItemRTL : InlineStyles.ListItem}>
          <a
            href="https://www.mozilla.org/firefox/new/"
            target="_blank"
            rel="noopener noreferrer"
            style={InlineStyles.Link}
          >
            <img
              src="data:image/png;base64,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"
              width="24"
              height="24"
              alt=""
              style={isUserRightToLeft() ? InlineStyles.IconRTL : InlineStyles.Icon}
            />
            Mozilla Firefox
          </a>
        </li>
      </ul>
      <p style={InlineStyles.Paragraph}>
        {_t('Have questions?')}{' '}
        <a
          href="https://learners.coursera.help/hc/articles/209818543-Recommended-browsers-and-devices"
          target="_blank"
          rel="noopener noreferrer"
          style={InlineStyles.Link}
        >
          {_t('Learn more in our learner help center.')}
        </a>
      </p>
    </div>
  );
};

export class InternetExplorerBannerWithDismiss extends React.Component<PropsFromCaller, StateForDismiss> {
  state = {
    isMounted: false,
    isDismissed: false,
  };

  componentDidMount() {
    let isDismissed: boolean;
    try {
      const dismissedAt = sessionStorage.getItem(DismissKey);
      isDismissed = dismissedAt ? +dismissedAt > Date.now() - DismissDuration : false;
    } catch (err) {
      isDismissed = false;
    }

    this.setState({ isMounted: true, isDismissed });
  }

  onDismiss = () => {
    try {
      sessionStorage.setItem(DismissKey, String(Date.now()));
    } catch (err) {
      // do nothing
    }

    this.setState({ isDismissed: true });
  };

  render() {
    const { children } = this.props;
    const { isMounted, isDismissed } = this.state;

    return (
      <>
        {!isDismissed && <InternetExplorerBanner onDismiss={isMounted ? this.onDismiss : undefined} />}
        {children}
      </>
    );
  }
}

export class InternetExplorerBannerWithErrorBoundary extends React.Component<PropsFromCaller, StateForErrorBoundary> {
  state = {
    hasError: false,
  };

  static getDerivedStateFromError() {
    return {
      hasError: true,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    if (getShouldLoadRaven()) {
      raven.captureException(error, {
        extra: errorInfo,
        tags: { source: 'InternetExplorerBannerWithErrorBoundary' },
      });
    }
  }

  render() {
    const { children } = this.props;
    const { hasError } = this.state;

    return <InternetExplorerBannerWithDismiss>{hasError ? <ErrorPage /> : children}</InternetExplorerBannerWithDismiss>;
  }
}

export const InternetExplorerBannerWithGuard = ({
  userAgent,
  children = null,
  Component,
}: PropsForGuard & PropsFromConnectToStores) => {
  const shouldRenderBanner = userAgent?.browser?.name === 'IE';

  if (!shouldRenderBanner) {
    return children;
  }

  return <Component>{children}</Component>;
};

export default connectToStores<PropsForGuard & PropsFromConnectToStores, PropsForGuard>(
  [ApplicationStoreClass],
  (ApplicationStore: ApplicationStoreClass, props) => ({
    ...props,
    userAgent: ApplicationStore.getUserAgent(),
  })
)(InternetExplorerBannerWithGuard);
