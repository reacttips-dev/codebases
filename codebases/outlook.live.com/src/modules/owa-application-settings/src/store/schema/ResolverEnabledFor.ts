// Note: The local resolvers, (HX and WEB) take precedence over the remote resolvers and HX takes precedence over web
// So,
// Hx | Web | Remote   => try hx first, fall back to web resolver (remote ignored)
// Hx | Remote         => try hx first, fall back to remote
// Hx | Web            => try hx first, fall back to web resolver (remote ignored)
// Web | Remote        => call web resolver (remote ignored)
// Remote              => only send remote
// Hx                  => call hx, fail if that falls back
// Web                 => call web resolver (remote ignored)
export enum ResolverEnabledFor {
    None = 0,
    Hx = 1 << 0,
    Web = 1 << 1,
    Remote = 1 << 2,
    All = ~(~0 << 3),
}
