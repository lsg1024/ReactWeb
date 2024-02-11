import React from 'react';

function Header() {
  return (
    <head>
      {/* 필요한 메타 태그 */}
      <meta charset="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
      {/* Bootstrap CSS */}
      <link rel="stylesheet" href="/css/bootstrap.min.css" crossorigin="anonymous" />
      {/* Custom styles */}
      <link href="/css/jumbotron-narrow.css" rel="stylesheet" />
      <title>종합 허브</title>
    </head>
  );
}

export default Header;
