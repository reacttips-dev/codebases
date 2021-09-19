import Icon from './Icon';

const Exclusive = props => (
  <Icon
    width={45}
    height={42}
    viewBox="0 0 30 30"
    title="Zappos Exclusive"
    {...props}>
    <style>{'.prefix__st2{fill:#033753}'}</style>
    <circle
      cx={15}
      cy={15}
      r={14.9}
      fill="#d4efff" />
    <g fill="none" fillRule="evenodd">
      <path
        fill="#f9c045"
        stroke="#033753"
        strokeWidth={1.25}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeMiterlimit={10}
        d="M15 6.3l2 5.4 5.7.3-4.4 3.5 1.5 5.6-4.8-3.2-4.8 3.2 1.5-5.6L7.3 12l5.7-.3z"
      />
      <path
        className="prefix__st2"
        d="M14.9 17c-7.7 0-10.5-3.7-10.6-3.9-.2-.3-.1-.7.1-.9.3-.2.6-.1.8.1 0 .1 2.6 3.4 9.6 3.4 7.1 0 9.8-3.5 9.9-3.5.2-.3.6-.3.8-.1.3.2.3.6.1.9 0 .2-3 4-10.7 4z"
      />
      <path
        className="prefix__st2"
        d="M5.2 21.5V10.1c.5-.2.8-.7.8-1.2 0-.7-.6-1.3-1.3-1.3-.7 0-1.3.6-1.3 1.3 0 .5.3 1 .8 1.2v11.4c-.8.1-1.3.3-1.3.6v.4c.4.5.9.7 1.8.7s1.5-.3 1.8-.6v-.5c0-.3-.5-.5-1.3-.6zM25.8 21.5V10.1c.5-.2.8-.7.8-1.2 0-.7-.6-1.3-1.3-1.3-.7 0-1.3.6-1.3 1.3 0 .5.3 1 .8 1.2v11.4c-.8.1-1.3.3-1.3.6v.4c.4.5.9.7 1.8.7s1.5-.3 1.8-.6v-.5c0-.3-.5-.5-1.3-.6z"
      />
    </g>
  </Icon>
);

export default Exclusive;
