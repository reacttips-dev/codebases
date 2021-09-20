import React from "react";

const LogoIconOnly: React.FC<{ iconClass: string }> = ({
  iconClass
}: {
  iconClass: string;
}) => (
  <>
    {/** U Icon Path */}
    <path
      className={iconClass}
      d="M29 .5l1 .5v13c0 5.55-2.9 8.7-6 10.1l-7.6 4.4c-.07.02-.13.06-.2.1l-.07.04C14.48 29.54 12.68 30 11 30 6 30 0 26 0 18V6l2 1v11c0 8 6 10 9 10 1.86 0 4.87-.77 6.9-3.25C14.17 23.87 10 20.68 10 14V2.2L2 7 0 6l10-6 1 .5 1 .5v13c0 6.94 4.52 8.6 7.02 8.93.6-1.3.98-2.93.98-4.93V5l2 1v12c0 1.85-.32 3.5-.88 4.9C23.65 22.56 28 20.8 28 14V2.25L22 6l-2-1 8-5 1 .5z"
    />
  </>
);

export default LogoIconOnly;
