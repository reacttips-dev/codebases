import * as React from "react"
import { Link } from "gatsby"
import CopyButton from "../../../../components/copy"

function CliCtaBlock(props) {
  return (
    <pre
      css={theme => ({
        color: theme.colors.white,
        backgroundColor: theme.colors.magenta[50],
        backgroundImage: `linear-gradient(90deg, ${theme.colors.magenta[50]} 0%, ${theme.colors.purple[50]} 100%)`,
        fontFamily: theme.fonts.monospace,
        padding: theme.space[5],
        borderRadius: 99999,
        fontSize: theme.fontSizes[1],
        display: "flex",
        alignItems: "center",
        width: "100%",
      })}
    >
      {/* Overloading the current CTA link properties for this use */}
      {!!props.anchorText && (
        <strong
          css={theme => ({
            marginRight: theme.space[4],
            textTransform: "uppercase",
            fontSize: theme.fontSizes[0],
            letterSpacing: theme.letterSpacings.tracked,
            lineHeight: 1,
            padding: theme.space[3],
            borderRadius: 99999,
            color: theme.colors.magenta[50],
            backgroundColor: theme.colors.white,
          })}
        >
          {props.anchorText}
        </strong>
      )}
      <span>{props.name}</span>
      <CopyButton
        content={props.name}
        css={theme => ({
          color: theme.colors.white,
          backgroundColor: "transparent",
          boxShadow: "inset 0 0 0 1px white",
          borderRadius: theme.radii[1],
          marginLeft: "auto",
          opacity: 1,
          "&:hover, &:focus, &:not([disabled]):hover": {
            backgroundColor: theme.colors.purple[50],
          },
          // specificity hack
          "&:hover, &:focus, &:active, &:not([disabled]):hover": {
            boxShadow: "inset 0 0 0 1px white",
          },
        })}
      />
    </pre>
  )
}

function CtaLink({ name, href }) {
  return (
    <Link
      to={href}
      css={theme => ({
        display: "block",
        textAlign: "center",
        color: theme.colors.link.color,
        textDecoration: "none",
        "&:hover": {
          textDecoration: "underline",
        },
        "&:focus": {
          textDecoration: "underline",
        },
      })}
    >
      {name}
    </Link>
  )
}

export default function UsedByCtaBlock({ data }) {
  return (
    <div
      css={{
        maxWidth: 352,
        marginLeft: "auto",
        marginRight: "auto",
      }}
    >
      <ul
        css={theme => ({
          listStyle: "none",
          margin: 0,
          padding: 0,
          display: "flex",
          alignItems: "baseline",
          flexWrap: "wrap",
          justifyContent: "space-around",
          fontSize: theme.fontSizes[1],
        })}
      >
        {data.content?.map((link, i) => (
          <li
            key={i}
            css={{
              width: i === 0 ? "100%" : "50%",
            }}
          >
            {link.href !== null ? (
              <CtaLink {...link} />
            ) : (
              <CliCtaBlock {...link} />
            )}
          </li>
        ))}
      </ul>
    </div>
  )
}
